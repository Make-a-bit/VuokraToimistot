import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { customerReducer } from "./reducers/customerReducer";
import { deviceReducer } from "./reducers/deviceReducer";
import { officeReducer } from "./reducers/officeReducer";
import { propertyReducer } from "./reducers/propertyReducer";
import { serviceReducer } from "./reducers/serviceReducer";
import { uiReducer } from "./reducers/uiReducer";

const rootReducer = combineReducers({
    customers: customerReducer,
    devices: deviceReducer,
    offices: officeReducer,
    properties: propertyReducer,
    services: serviceReducer,
    ui: uiReducer,
})
export const store = configureStore({
    reducer: rootReducer,
});
