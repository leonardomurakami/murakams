import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getAutocompleteSuggestions } from '../redux/fileSystemSlice';
import {
  PROMPT_COLOR,
  TEXT_COLOR,
  MODERN_FONT,
  CLASSIC_FONT,
  DEFAULT_USER,
  DEFAULT_HOST,
} from '../constants';

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 10px;
  flex-wrap: nowrap;
  overflow-x: auto;
`;

const Prompt = styled.span`
  color: ${PROMPT_COLOR};
  white-space: nowrap;
  margin-right: 8px;
`;

const InputOverlayWrapper = styled.div`
  position: relative;
  flex-grow: 1;
  min-width: 0;
`;

const GhostInput = styled.div`
  position: absolute;
  top: 1px;
  left: 1px;
  color: ${TEXT_COLOR};
  pointer-events: none;
  white-space: pre;
  overflow: hidden;
  display: flex;
`;

const Input = styled.input`
  background-color: transparent;
  border: none;
  color: ${TEXT_COLOR};
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  caret-color: ${TEXT_COLOR};
  caret-shape: block;
  position: relative;
  z-index: 1;
  &:focus {
    outline: none;
  }
`;

const CommandLine = forwardRef(({ onCommand, modern }, ref) => {
  const [input, setInput] = useState('');
  const [ghostSuggestion, setGhostSuggestion] = useState('');
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const currentPath = useSelector((state) => state.fileSystem.currentPath);

  useImperativeHandle(ref, () => ({
    focus: () => {
      // eslint-disable-next-line
      inputRef.current?.focus();
    },
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input);
      setHistory((prevHistory) => [...prevHistory, input]);
      setHistoryIndex(-1);
      setInput('');
      setGhostSuggestion('');
      setAutocompleteOptions([]);
    }
  };

  const updateAutocomplete = async (value) => {
    const suggestions = await dispatch(getAutocompleteSuggestions(value)).unwrap();

    if (suggestions.length === 1) {
      const tokens = value.trim().split(/\s+/);
      const lastToken = tokens[tokens.length - 1] || '';
      const suggestion = suggestions[0];

      if (suggestion.startsWith(lastToken)) {
        const completion = suggestion.slice(lastToken.length);
        setGhostSuggestion(completion);
      } else {
        setGhostSuggestion('');
      }
    } else {
      setGhostSuggestion('');
    }
    setAutocompleteOptions(suggestions);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setHistoryIndex(-1);
    updateAutocomplete(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (ghostSuggestion) {
        const tokens = input.split(' ');
        let lastToken = tokens[tokens.length - 1];
        const lastSlashIndex = lastToken.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
          const pathPrefix = lastToken.substring(0, lastSlashIndex + 1);
          const filenamePart = lastToken.substring(lastSlashIndex + 1);
          lastToken = pathPrefix + filenamePart + ghostSuggestion;
        } else {
          lastToken += ghostSuggestion;
        }
        tokens[tokens.length - 1] = lastToken;
        const newInput = tokens.join(' ');
        setInput(newInput);
        setGhostSuggestion('');
        updateAutocomplete(newInput);
      } else if (autocompleteOptions.length > 0) {
        const tokens = input.split(' ');
        let lastToken = tokens[tokens.length - 1];
        const lastSlashIndex = lastToken.lastIndexOf('/');
        const pathPrefix = lastSlashIndex !== -1 ? lastToken.substring(0, lastSlashIndex + 1) : '';
        const filenamePart = lastSlashIndex !== -1 ? lastToken.substring(lastSlashIndex + 1) : lastToken;
  
        const relevantOptions = autocompleteOptions.map(option => {
          const optionParts = option.split('/');
          return optionParts[optionParts.length - 1];
        });
  
        const commonPrefix = relevantOptions.reduce((acc, curr) => {
          let i = 0;
          while (i < acc.length && i < curr.length && acc[i] === curr[i]) i++;
          return acc.slice(0, i);
        });
  
        if (commonPrefix.length > filenamePart.length) {
          lastToken = pathPrefix + commonPrefix;
          tokens[tokens.length - 1] = lastToken;
          const newInput = tokens.join(' ');
          setInput(newInput);
          updateAutocomplete(newInput);
        } else if (autocompleteOptions.length === 1) {
          // If there's only one option, use it
          lastToken = pathPrefix + autocompleteOptions[0];
          tokens[tokens.length - 1] = lastToken;
          const newInput = tokens.join(' ');
          setInput(newInput);
          updateAutocomplete(newInput);
        } else {
          // Multiple options, you might want to display them to the user
          console.log('Multiple options:', autocompleteOptions);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    inputRef.current?.focus();
  }, []);

  const getPrompt = () => {
    return `${DEFAULT_USER}@${DEFAULT_HOST}:${currentPath}>`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputWrapper>
        <Prompt>{getPrompt()}</Prompt>
        <InputOverlayWrapper>
          <GhostInput>
            <span>{input}</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>{ghostSuggestion}</span>
          </GhostInput>
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{
              fontFamily: modern ? MODERN_FONT : CLASSIC_FONT,
            }}
          />
        </InputOverlayWrapper>
      </InputWrapper>
    </form>
  );
});

export default CommandLine;