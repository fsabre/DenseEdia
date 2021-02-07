import { createSlice } from '@reduxjs/toolkit';

import { Edium, LoadedState } from "./slices.types";

function blankEdium(): Edium {
  return {
    id: 0,
    name: "",
    kind: "",
    creationDate: "",
    elements: []
  };
}

const slotSlice = createSlice({
  name: 'slot',
  initialState: {
    slot1:
    {
      loadedState: "no" as LoadedState,
      edium: blankEdium(),
    },
    slot2:
    {
      loadedState: "no" as LoadedState,
      edium: blankEdium(),
    }
  },
  reducers: {
    "startLoading": (state, action) => {
      const destSlot: "slot1" | "slot2" = action.payload.slot;
      state[destSlot].edium.id = action.payload.id;
      state[destSlot].loadedState = "loading";
    },
    "endLoading": (state, action) => {
      const destSlot: "slot1" | "slot2" = action.payload.slot;
      state[destSlot].edium = action.payload.edium;
      state[destSlot].loadedState = "yes";
    },
    "failLoading": (state, action) => {
      const destSlot: "slot1" | "slot2" = action.payload.slot;
      console.error("Error on loadFullEdium");
      state[destSlot].loadedState = "no";
    },
    "empty": (state, action) => {
      const destSlot: "slot1" | "slot2" = action.payload.slot;
      state[destSlot].edium = blankEdium();
      state[destSlot].loadedState = "no";
    },
  },
});

export { slotSlice };