import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { getCurrentPath, readDirectory } from '../components/FileSystem';

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
  top: 0;
  left: 0;
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
  white-space: pre;
  overflow: hidden;
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

const commands = [
  'ls', 'cd', 'cat', 'clear', 'help', 'whoami', 'write', 'rm', 'mkdir', 'upgrade', 'downgrade',
  'pwd', 'touch', 'echo', 'grep', 'head', 'tail', 'less', 'more', 'find', 'chmod', 'chown'
];

const CommandLine = forwardRef(({ onCommand, modern }, ref) => {
  const [input, setInput] = useState('');
  const [ghostSuggestion, setGhostSuggestion] = useState('');
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input);
      setHistory(prevHistory => [...prevHistory, input]);
      setHistoryIndex(-1);
      setInput('');
      setGhostSuggestion('');
      setAutocompleteOptions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setHistoryIndex(-1);
    updateAutocomplete(value);
  };

  const updateAutocomplete = async (value) => {
    const [command, ...args] = value.split(' ');
    
    if (args.length === 0) {
      const matchingCommands = commands.filter(cmd => cmd.startsWith(command));
      if (matchingCommands.length === 1) {
        setGhostSuggestion(matchingCommands[0]);
      } else {
        setGhostSuggestion('');
      }
      setAutocompleteOptions(matchingCommands);
    } else if (['ls', 'cd', 'cat', 'rm', 'touch', 'mkdir', 'grep', 'find'].includes(command)) {
      const currentPath = getCurrentPath();
      const partialPath = args.join(' ').trim();
      let fullPath;
  
      if (partialPath.startsWith('/')) {
        fullPath = partialPath;
      } else {
        fullPath = `${currentPath}/${partialPath}`;
      }
      
      fullPath = fullPath.replace(/\/+/g, '/');
      
      const lastSlashIndex = fullPath.lastIndexOf('/');
      const dirPath = fullPath.substring(0, lastSlashIndex + 1);
      const partial = fullPath.substring(lastSlashIndex + 1);
  
      const files = await readDirectory(dirPath);
      if (files) {
        const matchingFiles = files.filter(file => file.startsWith(partial));
        if (matchingFiles.length === 1) {
          let suggestion;
          if (dirPath === currentPath + '/') {
            const completedArg = args.slice(0, -1).concat(matchingFiles[0]).join(' ');
            suggestion = `${command} ${completedArg}`.trim();
          } else {
            const relativePath = dirPath.startsWith(currentPath) 
              ? dirPath.slice(currentPath.length) 
              : dirPath;
            suggestion = `${command} ${relativePath}${matchingFiles[0]}`.trim();
          }
          suggestion = suggestion.replace(/\/+/g, '/').trim(); // Normalize again
          setGhostSuggestion(suggestion);
        } else {
          setGhostSuggestion('');
        }
        setAutocompleteOptions(matchingFiles);
      } else {
        setGhostSuggestion('');
        setAutocompleteOptions([]);
      }
    } else {
      setGhostSuggestion('');
      setAutocompleteOptions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (ghostSuggestion) {
        setInput(ghostSuggestion);
        setGhostSuggestion('');
      } else if (autocompleteOptions.length > 0) {
        // Find common prefix among options
        const commonPrefix = autocompleteOptions.reduce((acc, curr) => {
          let i = 0;
          while (i < acc.length && i < curr.length && acc[i] === curr[i]) i++;
          return acc.slice(0, i);
        });
        if (commonPrefix.length > 0) {
          const [command] = input.split(' ');
          setInput(input.includes(' ') ? `${command} ${commonPrefix}` : commonPrefix);
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

  return (
    <form onSubmit={handleSubmit}>
      <InputWrapper>
        <Prompt>{modern ? '❯' : '$'}</Prompt>
        <InputOverlayWrapper>
          <GhostInput>{ghostSuggestion}</GhostInput>
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{ fontFamily: modern ? "'Fira Code', 'Courier New', monospace" : "'Courier New', monospace" }}
          />
        </InputOverlayWrapper>
      </InputWrapper>
    </form>
  );
});

export default CommandLine;