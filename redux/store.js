import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer/rootReducer";

export const store = configureStore({
  reducer: rootReducer,
});

const makeStore = () => store;

