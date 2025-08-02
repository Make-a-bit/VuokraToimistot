import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { customerReducer } from "./reducers/customerReducer";
import { deviceReducer } from "./reducers/deviceReducer";
import { invoiceReducer } from "./reducers/invoiceReducer";
import { loginReducer } from "./reducers/loginReducer";
import { officeReducer } from "./reducers/officeReducer";
import { propertyReducer } from "./reducers/propertyReducer";
import { reservationReducer } from "./reducers/reservationReducer";
import { serviceReducer } from "./reducers/serviceReducer";
import { taxReducer } from "./reducers/taxReducer";
import { uiReducer } from "./reducers/uiReducer";

/**
 * The root reducer combines all feature reducers into a single reducer function.
 * @type {import('redux').Reducer}
 * Reasoning: combineReducers returns a Redux reducer function.
 */
const rootReducer = combineReducers({
    customers: customerReducer,
    devices: deviceReducer,
    invoices: invoiceReducer,
    login: loginReducer,
    offices: officeReducer,
    properties: propertyReducer,
    reservations: reservationReducer,
    services: serviceReducer,
    taxes: taxReducer,
    ui: uiReducer,
});

/**
 * The Redux store instance for the application.
 * @type {import('@reduxjs/toolkit').EnhancedStore}
 * Reasoning: configureStore returns an EnhancedStore from Redux Toolkit.
 */
export const store = configureStore({
    reducer: rootReducer,
});