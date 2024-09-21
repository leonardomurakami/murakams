import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import CommandLine from './CommandLine';
import Output from './Output';
import CRTEffect from './CRTEffect';
import RandomPopupGenerator from './PopupGenerator';
import { executeCommand } from '../redux/commandSlice';
import {
  BACKGROUND_COLOR,
  MODERN_BACKGROUND,
  TEXT_COLOR,
  MODERN_FONT,
  CLASSIC_FONT,
} from '../constants';

const ShellContainer = styled.div`
  background: ${props => props.modern ? MODERN_BACKGROUND : BACKGROUND_COLOR};
  color: ${TEXT_COLOR};
  font-family: ${props => props.modern ? MODERN_FONT : CLASSIC_FONT};
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
    // eslint-disable-next-line
    commandLineRef.current?.focus();
  }, []);

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
          {status === 'loading' && <Output type="result" content="Processing..." />}
        </OutputContainer>
        <CommandLineContainer>
          <CommandLine 
            onCommand={handleCommand} 
            modern={isModern} 
            ref={commandLineRef}
          />
        </CommandLineContainer>
      </ShellContainer>
    </CRTEffect>
  );
};

export default Shell;