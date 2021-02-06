import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { summarySlice } from "./summary";

const rootReducer = combineReducers({
  "summary": summarySlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export { store };

export type RootState = ReturnType<typeof rootReducer>;