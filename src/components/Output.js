import React from 'react';
import styled from 'styled-components';
import { PROMPT_COLOR } from '../constants';

const OutputLine = styled.div`
  margin-bottom: 5px;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const CommandOutput = styled(OutputLine)`
  &::before {
    content: '${props => props.prompt} ';
    color: ${PROMPT_COLOR};
  }
`;

const ResultOutput = styled(OutputLine)``;

const colorMap = {
  '\x1b[0m': 'color: inherit;',
  '\x1b[1m': 'font-weight: bold;',
  '\x1b[1;33m': 'color: #FFFF00; font-weight: bold;',
  '\x1b[1;36m': 'color: #00FFFF; font-weight: bold;',
  '\x1b[1;32m': 'color: #00FF00; font-weight: bold;',
};

const AnsiSpan = styled.span`
  ${props => colorMap[props.code] || ''}
`;

const parseAnsiString = (str) => {
  if (typeof str !== 'string') {
    console.error('Expected string in parseAnsiString, got:', typeof str, str);
    return [<AnsiSpan key={0}>{String(str)}</AnsiSpan>];
  }

  // eslint-disable-next-line no-control-regex
  const regex = /\x1b\[[0-9;]*m/g;
  const parts = str.split(regex);
  const codes = str.match(regex) || [];

  return parts.map((part, index) => (
    <AnsiSpan key={index} code={codes[index] || ''}>
      {part}
    </AnsiSpan>
  ));
};

const Output = ({ type, content, prompt }) => {
  if (type === 'command') {
    return <CommandOutput prompt={prompt}>{content}</CommandOutput>;
  } else {
    return <ResultOutput>{parseAnsiString(content)}</ResultOutput>;
  }
};

export default Output;