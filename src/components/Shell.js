import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import CommandLine from './CommandLine';
import Output from './Output';
import CRTEffect from './CRTEffect';
import RandomPopupGenerator from './PopupGenerator';
import { executeCommand } from '../redux/commandSlice';

const ShellContainer = styled.div`
  background: ${props => props.modern ? 'linear-gradient(45deg, rgba(26, 26, 26, 0.9), rgba(42, 42, 42, 0.9))' : 'rgba(0, 0, 0, 0.9)'};
  color: #00ff00;
  font-family: ${props => props.modern ? "'Fira Code', 'Courier New', monospace" : "'Courier New', monospace"};
  height: 95vh;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: text;
`;

const OutputContainer = styled.div`
  flex-grow: 1;
  position: relative;
  z-index: 3;
`;

const CommandLineContainer = styled.div`
  width: 100%;
  position: relative;
  z-index: 3;
`;

const Shell = () => {
  const { output, isModern } = useSelector(state => state.shell);
  const { status } = useSelector(state => state.command);
  const currentPath = useSelector(state => state.fileSystem.currentPath);
  const dispatch = useDispatch();
  const shellContainerRef = useRef(null);
  const commandLineRef = useRef(null);

  const handleCommand = useCallback((command) => {
    dispatch(executeCommand(command));
  }, [dispatch]);

  useEffect(() => {
    if (shellContainerRef.current) {
      shellContainerRef.current.scrollTop = shellContainerRef.current.scrollHeight;
    }
  }, [output]);

  const handleShellClick = useCallback((e) => {
    commandLineRef.current?.focus();
  }, []);

  const getPrompt = useCallback(() => {
    const user = 'user';
    const host = 'murakams';
    return `${user}@${host}:${currentPath}>`;
  }, [currentPath]);

  return (
    <CRTEffect isModern={isModern}>
      <RandomPopupGenerator />
      <ShellContainer 
        ref={shellContainerRef} 
        modern={isModern} 
        onClick={handleShellClick}
      >
        <OutputContainer>
          {output.map((item, index) => (
            <Output key={index} type={item.type} content={item.content} prompt={item.prompt} />
          ))}
          {status === 'loading' && <Output type="result" content="Processing..." prompt={getPrompt()} />}
        </OutputContainer>
        <CommandLineContainer>
          <CommandLine 
            onCommand={handleCommand} 
            modern={isModern} 
            prompt={getPrompt()}
            ref={commandLineRef}
          />
        </CommandLineContainer>
      </ShellContainer>
    </CRTEffect>
  );
};

export default Shell;