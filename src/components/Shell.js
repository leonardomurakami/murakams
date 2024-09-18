import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import CommandLine from './CommandLine';
import Output from './Output';
import commandHandler from './CommandHandler';
import CRTEffect from './CRTEffect';

const textShadow = keyframes`
  0% { text-shadow: 0.2389924193300864px 0 1px rgba(0,30,255,0.5), -0.2389924193300864px 0 1px rgba(255,0,80,0.3), 0 0 3px; }
  25% { text-shadow: 0.7389924193300864px 0 1px rgba(0,30,255,0.5), -0.7389924193300864px 0 1px rgba(255,0,80,0.3), 0 0 3px; }
  50% { text-shadow: 0.8928974010788217px 0 1px rgba(0,30,255,0.5), -0.8928974010788217px 0 1px rgba(255,0,80,0.3), 0 0 3px; }
  75% { text-shadow: 0.5928974010788217px 0 1px rgba(0,30,255,0.5), -0.5928974010788217px 0 1px rgba(255,0,80,0.3), 0 0 3px; }
  100% { text-shadow: 0.2389924193300864px 0 1px rgba(0,30,255,0.5), -0.2389924193300864px 0 1px rgba(255,0,80,0.3), 0 0 3px; }
`;

const flicker = keyframes`
  0% { opacity: 0.99; }
  50% { opacity: 0.98; }
  100% { opacity: 0.99; }
`;

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

  ${props => !props.modern && css`
    animation: ${textShadow} 5.s infinite, ${flicker} 0.15s infinite;

    &::before {
      content: " ";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      z-index: 2;
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
    }
  `}
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
  const [output, setOutput] = useState([{ type: 'result', content: 'Welcome to the shell!\nType `help` to get help on available commands' }]);
  const [isModern, setIsModern] = useState(() => {
    const saved = localStorage.getItem('shellStyle');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const shellContainerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('shellStyle', JSON.stringify(isModern));
  }, [isModern]);

  const handleCommand = useCallback((command) => {
    const newOutput = [...output, { type: 'command', content: command }];
    const result = commandHandler(command);
    if (result && result.type === 'clear') {
      setOutput([]);
    } else if (result && result.type === 'upgrade') {
      setIsModern(true);
      setOutput([...newOutput, { type: 'result', content: 'Shell upgraded to modern style.' }]);
    } else if (result && result.type === 'downgrade') {
      setIsModern(false);
      setOutput([...newOutput, { type: 'result', content: 'Shell downgraded to classic style.' }]);
    } else {
      setOutput([...newOutput, { type: 'result', content: result }]);
    }
  }, [output]);

  useEffect(() => {
    if (shellContainerRef.current) {
      shellContainerRef.current.scrollTop = shellContainerRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <CRTEffect modern={isModern}>
    <ShellContainer ref={shellContainerRef} modern={isModern}>
      <OutputContainer>
        {output.map((item, index) => (
          <Output key={index} type={item.type} content={item.content} />
        ))}
      </OutputContainer>
      <CommandLineContainer>
        <CommandLine onCommand={handleCommand} modern={isModern} />
      </CommandLineContainer>
    </ShellContainer>
    </CRTEffect>
  );
};

export default Shell;