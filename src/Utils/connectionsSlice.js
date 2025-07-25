// connectionsSlice.js - Fixed
import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
  name: "connections", // Changed from "connection" to "connections"
  initialState: [],
  reducers: {
    addConnections: (state, action) => {
      return action.payload || []; // Added null check
    },
    removeConnections: () => {
      return []; // Return empty array instead of null
    },
  },
});

export const { addConnections, removeConnections } = connectionsSlice.actions;
export default connectionsSlice.reducer;