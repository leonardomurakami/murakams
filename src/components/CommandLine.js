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
  margin-left: 8px;
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
  const [savedInput, setSavedInput] = useState('');
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const currentPath = useSelector((state) => state.fileSystem.currentPath);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input);
      setHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
      setSavedInput('');
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
        // ... (rest of the tab completion logic)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex === -1) {
        setSavedInput(input); // Save current input before navigating history
      }
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
        setInput(savedInput); // Restore saved input when returning from history
      }
    }
  };

  useEffect(() => {
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