import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import CommandLine from './CommandLine';
import Output from './Output';
import commandHandler from './CommandHandler';
import CRTEffect from './CRTEffect';
import RandomPopupGenerator from './PopupGenerator';

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
  const [output, setOutput] = useState([{ type: 'result', content: 'Welcome to Murakams Inc. central server!\nType `help` to get help on available commands or `whoami` to see your current logged user!\nAlso, please logout if you\'re not supposed to be here, this server isn\'t the most secure' }]);
  const [isModern, setIsModern] = useState(() => {
    const saved = localStorage.getItem('shellStyle');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const shellContainerRef = useRef(null);
  const commandLineRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('shellStyle', JSON.stringify(isModern));
  }, [isModern]);

  const handleCommand = useCallback(async (command) => {
    const newOutput = [...output, { type: 'command', content: command }];
    setOutput(newOutput);

    try {
      const result = await commandHandler(command);
      if (result && result.type === 'clear') {
        setOutput([]);
      } else if (result && result.type === 'upgrade') {
        setIsModern(true);
        setOutput(prev => [...prev, { type: 'result', content: 'Shell upgraded to modern style.' }]);
      } else if (result && result.type === 'downgrade') {
        setIsModern(false);
        setOutput(prev => [...prev, { type: 'result', content: 'Shell downgraded to classic style.' }]);
      } else {
        setOutput(prev => [...prev, { type: 'result', content: result }]);
      }
    } catch (error) {
      setOutput(prev => [...prev, { type: 'result', content: `Error: ${error.message}` }]);
    }
  }, [output]);

  useEffect(() => {
    if (shellContainerRef.current) {
      shellContainerRef.current.scrollTop = shellContainerRef.current.scrollHeight;
    }
  }, [output]);

  const handleShellClick = useCallback((e) => {
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
            <Output key={index} type={item.type} content={item.content} />
          ))}
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