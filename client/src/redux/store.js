import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { customerReducer } from "./reducers/customerReducer";
import { officeReducer } from "./reducers/officeReducer";
import { propertyReducer } from "./reducers/propertyReducer";
import { uiReducer } from "./reducers/uiReducer";

const rootReducer = combineReducers({
    customers: customerReducer,
    offices: officeReducer,
    properties: propertyReducer,
    ui: uiReducer
})
export const store = configureStore({
    reducer: rootReducer,
});
