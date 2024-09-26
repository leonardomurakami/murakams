import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_SHELL_STYLE } from '../constants';

const initialState = {
  output: [{ type: 'result', content: 'Welcome to Murakams Inc. central server!\nType `help` to get help on available commands or `whoami` to see your current logged user!\nAlso, please logout if you\'re not supposed to be here, this server isn\'t the most secure' }],
  isModern: JSON.parse(localStorage.getItem('shellStyle')) || DEFAULT_SHELL_STYLE,
};

const shellSlice = createSlice({
  name: 'shell',
  initialState,
  reducers: {
    addOutput: (state, action) => {
      state.output.push(action.payload);
    },
    clearOutput: (state) => {
      state.output = [];
    },
    setModern: (state, action) => {
      state.isModern = action.payload;
      localStorage.setItem('shellStyle', JSON.stringify(action.payload));
    },
  },
});

export const { addOutput, clearOutput, setModern } = shellSlice.actions;

export default shellSlice.reducer;