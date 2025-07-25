import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "./feedSlice";
import connectionsReducer from "./connectionsSlice"; // Better naming
import userReducer from "./userSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionsReducer, // Changed from "connection" to "connections"
  },
});

export default appStore;