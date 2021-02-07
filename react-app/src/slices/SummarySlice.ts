import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { EdiumSummary, LoadedState } from "./slices.types";


const loadSummary = createAsyncThunk(
  "summary/load",
  async function () {
    const res = await fetch("http://localhost:59130/edia");
    const json = await res.json();
    const edia = json.map((raw: EdiumSummary) => ({
      id: raw.id,
      kind: raw.kind,
      name: raw.name
    }));
    return edia;
  }
);

const summarySlice = createSlice({
  name: 'summary',
  initialState: {
    loadedState: "no" as LoadedState,
    edia: [] as EdiumSummary[]
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loadSummary.pending, (state) => {
      state.loadedState = "loading";
    });
    builder.addCase(loadSummary.fulfilled, (state, action) => {
      state.edia = action.payload;
      state.loadedState = "yes";
    });
    builder.addCase(loadSummary.rejected, (state) => {
      console.error("Error on summary/load");
      state.loadedState = "no";
    });
  },
});

const summarySliceThunks = { loadSummary };

export { summarySlice, summarySliceThunks };