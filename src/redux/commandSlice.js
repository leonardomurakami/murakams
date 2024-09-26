import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commandHandler from '../components/CommandHandler';
import { addOutput, clearOutput, setModern } from './shellSlice';
import { setCurrentPath } from './fileSystemSlice';

export const executeCommand = createAsyncThunk(
  'command/execute',
  async (command, { dispatch, getState }) => {
    const currentPath = getState().fileSystem.currentPath;
    const prompt = getPrompt(currentPath);
    dispatch(addOutput({ type: 'command', content: command, prompt }));
    
    const result = await commandHandler(command, dispatch, getState);
    
    if (result) {
      if (result.type === 'cd') {
        dispatch(setCurrentPath(result.newPath));
        dispatch(addOutput({ type: 'result', content: result.content, prompt: getPrompt(result.newPath) }));
      } else if (result.type === 'clear') {
        dispatch(clearOutput());
      } else if (result.type === 'upgrade' || result.type === 'downgrade') {
        dispatch(setModern(result.type === 'upgrade'));
        dispatch(addOutput({ type: 'result', content: result.content, prompt }));
      } else {
        dispatch(addOutput({ type: 'result', content: result.content || result, prompt }));
      }
    } else {
      console.error('Command returned undefined:', command);
      dispatch(addOutput({ type: 'result', content: 'Error: Command returned no result', prompt }));
    }
    
    return result;
  }
);

const getPrompt = (currentPath) => {
    const user = 'user';
    const host = 'murakams';
    if (!currentPath.startsWith('~')) {
        currentPath = `~${currentPath}`;
    }
    currentPath = currentPath.replace(/\/\//g, '/');
    return `${user}@${host}:${currentPath}>`;
};

const commandSlice = createSlice({
  name: 'command',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(executeCommand.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(executeCommand.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload === undefined) {
          console.error('executeCommand fulfilled with undefined payload');
        }
      })
      .addCase(executeCommand.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.error('executeCommand rejected:', action.error);
      });
  },
});

export default commandSlice.reducer;