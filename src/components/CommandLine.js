import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

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

const SuggestionOverlay = styled.div`
  position: absolute;
  color: #666;
  pointer-events: none;
  opacity: 0.5;
  font-family: inherit;
  font-size: inherit;
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
  &:focus {
    outline: none;
  }
`;

const suggestions = [
  "cat",
  "ls",
  "whoami",
  "write",
  "rm",
  "help",
  "clear",
  "upgrade",
  "downgrade",
  "cd",
  "mkdir"
];

const CommandLine = ({ onCommand, modern }) => {
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCommand(input);
    setInput('');
    setSuggestion('');
  };

  const handleTabCompletion = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestion) {
        setInput(suggestion);
        setSuggestion(''); // Clear suggestion after using it
      }
    }
  };

  useEffect(() => {
    if (input.length > 0) {
      const matchedSuggestion = suggestions.find((cmd) => cmd.startsWith(input));
      setSuggestion(matchedSuggestion || '');
    } else {
      setSuggestion('');
    }
  }, [input]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <InputWrapper>
        <Prompt>{modern ? '❯' : '$'}</Prompt>
        <InputOverlayWrapper>
          <SuggestionOverlay>
            {input.length > 0 && suggestion && suggestion.startsWith(input) ? suggestion : ''}
          </SuggestionOverlay>
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleTabCompletion}
            style={{ fontFamily: modern ? "'Fira Code', 'Courier New', monospace" : "'Courier New', monospace" }}
          />
        </InputOverlayWrapper>
      </InputWrapper>
    </form>
  );
};

export default CommandLine;
