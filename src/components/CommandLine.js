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

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding-top: 10px;
`;

const Prompt = styled.span`
  color: #0f0;
  margin-right: 8px;
`;

const InputOverlayWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const GhostInput = styled.div`
  position: absolute;
  top: 1px;
  left: 1px;
  color: #0f0;
  pointer-events: none;
  white-space: pre;
  overflow: hidden;
  display: flex;
`;

const Input = styled.input`
  background-color: transparent;
  border: none;
  color: #0f0;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  caret-color: #0f0;
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
        // Replace base in lastToken with the suggestion
        const tokens = input.trim().split(/\s+/);
        const lastToken = tokens[tokens.length - 1] || '';
        const lastSlashIndex = lastToken.lastIndexOf('/');
        let dir = '';
        let base = lastToken;
        if (lastSlashIndex !== -1) {
          dir = lastToken.slice(0, lastSlashIndex + 1);
          base = lastToken.slice(lastSlashIndex + 1);
        }
        tokens[tokens.length - 1] = dir + base + ghostSuggestion;
        const newInput = tokens.join(' ');
        setInput(newInput);
        setGhostSuggestion('');
        updateAutocomplete(newInput);
      } else if (autocompleteOptions.length > 0) {
        // Find common prefix among autocompleteOptions
        const tokens = input.trim().split(/\s+/);
        const lastToken = tokens[tokens.length - 1] || '';
        const lastSlashIndex = lastToken.lastIndexOf('/');
        let dir = '';
        let base = lastToken;
        if (lastSlashIndex !== -1) {
          dir = lastToken.slice(0, lastSlashIndex + 1);
          base = lastToken.slice(lastSlashIndex + 1);
        }
  
        const commonPrefix = autocompleteOptions.reduce((acc, curr) => {
          const suggestionBase = curr.slice(dir.length);
          let i = 0;
          while (
            i < acc.length &&
            i < suggestionBase.length &&
            acc[i] === suggestionBase[i]
          )
            i++;
          return acc.slice(0, i);
        }, autocompleteOptions[0].slice(dir.length));
  
        if (commonPrefix.length > base.length) {
          tokens[tokens.length - 1] = dir + commonPrefix;
          const newInput = tokens.join(' ');
          setInput(newInput);
          updateAutocomplete(newInput);
        } else {
          // No common prefix longer than base
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
    inputRef.current?.focus();
  }, []);

  const getPrompt = () => {
    const user = 'user';
    const host = 'murakams';
    return `${user}@${host}:${currentPath}>`;
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
              fontFamily: modern
                ? "'Fira Code', 'Courier New', monospace"
                : "'Courier New', monospace",
            }}
          />
        </InputOverlayWrapper>
      </InputWrapper>
    </form>
  );
});

export default CommandLine;
