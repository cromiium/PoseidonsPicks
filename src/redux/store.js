import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import accountReducer from './reducers/accountReducer';

const store = configureStore({
  reducer: accountReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;