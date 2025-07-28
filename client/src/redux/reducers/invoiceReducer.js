import {
    ADD_INVOICE_SUCCESS, DELETE_INVOICE_SUCCESS,
    EDIT_INVOICE_SUCCESS, FETCH_INVOICES_SUCCESS
} from "../actions/actiontypes";

const initialState = {
    invoices: [],
};

export const invoiceReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_INVOICE_SUCCESS:
            return {
                ...state,
                invoices: [...state.invoices, action.payload],
            }

        case FETCH_INVOICES_SUCCESS:
            return {
                ...state,
                invoices: action.payload
            }

        case EDIT_INVOICE_SUCCESS:
            return {
                ...state,
                invoices: state.invoices.map(i =>
                    i.id === action.payload.id ? action.payload : i
                ),
            }

        case DELETE_INVOICE_SUCCESS:
            return {
                ...state,
                invoices: state.invoices.filter((i) => i.id !== action.payload.id)
            }

        default: return state;
    }
}