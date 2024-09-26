import React from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';
import store from './redux/store';
import Shell from './components/Shell';

const AppContainer = styled.div`
  height: 100vh;
  background-color: #000;
  position: relative;
  overflow: hidden;
`;

function App() {
  return (
    <Provider store={store}>
      <AppContainer>
        <Shell />
      </AppContainer>
    </Provider>
  );
}

export default App;