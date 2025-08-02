import {
    ADD_INVOICE_SUCCESS, DELETE_INVOICE_SUCCESS,
    EDIT_INVOICE_SUCCESS, FETCH_INVOICES_SUCCESS,
    RESET_APP_STATE
} from "../actions/actiontypes";

/**
 * @typedef {Object} Invoice
 * @property {number|string} id - Unique identifier for the invoice
 */

/**
 * @type {{ invoices: Invoice[] }}
 * The initial state contains an array of invoices.
 */
const initialState = {
    invoices: [],
};

/**
 * Reducer for managing invoice state.
 * @param {{ invoices: Invoice[] }} state - Current state object containing invoices array.
 * @param {{ type: string, payload?: any }} action - Redux action with type and optional payload.
 * @returns {{ invoices: Invoice[] }} New state after applying the action.
 *
 * Reasoning: 
 * - `state` is always an object with an `invoices` array.
 * - `action` is a Redux action, with a string `type` and optional `payload`.
 * - The reducer always returns a state object of the same shape.
 */
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

        case RESET_APP_STATE:
            return initialState;

        default: return state;
    }
}