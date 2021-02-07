import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { slotSlice } from "./SlotSlice";
import { summarySlice } from "./SummarySlice";

const rootReducer = combineReducers({
  "slot": slotSlice.reducer,
  "summary": summarySlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export { store };

export type RootState = ReturnType<typeof rootReducer>;