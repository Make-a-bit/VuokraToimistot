import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducer"; // Make sure this path is correct

export const store = configureStore({
    reducer: rootReducer,
});
