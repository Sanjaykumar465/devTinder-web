import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "./feedSlice";
import connectionsReducer from "./connectionsSlice"; // Better naming
import userReducer from "./userSlice";
import requestReducer from "./requestSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionsReducer,
    requests: requestReducer,
  },
});

export default appStore;
