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
})
export const store = configureStore({
    reducer: rootReducer,
});
