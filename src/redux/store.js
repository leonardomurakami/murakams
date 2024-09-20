import { configureStore } from '@reduxjs/toolkit';
import shellReducer from './shellSlice';
import fileSystemReducer from './fileSystemSlice';
import commandReducer from './commandSlice';

const store = configureStore({
  reducer: {
    shell: shellReducer,
    fileSystem: fileSystemReducer,
    command: commandReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;