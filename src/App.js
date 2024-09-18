import React from 'react';
import styled from 'styled-components';
import Shell from './components/Shell';

const AppContainer = styled.div`
  height: 100vh;
  background-color: #000;
  position: relative;
  overflow: hidden;
`;

function App() {
  return (
    <AppContainer>
    <Shell />
    </AppContainer>
  );
}

export default App;