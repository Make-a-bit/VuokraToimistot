import {
    ADD_TAX_SUCCESS, DELETE_TAX_SUCCESS,
    EDIT_TAX_SUCCESS, FETCH_TAXES_SUCCESS,
    RESET_APP_STATE
} from "../actions/actiontypes";

/**
 * @typedef {Object} Vat
 * @property {number|string} id - Unique identifier for the VAT entry
 */

/**
 * @typedef {Object} TaxState
 * @property {Vat[]} vats - Array of VAT objects
 */

/**
 * The initial state of the tax reducer.
 * Chose {TaxState} because it contains an array of VAT objects.
 * @type {TaxState}
 */
const initialState = {
    vats: []
}

/**
 * The tax reducer function.
 * Annotated state as {TaxState} and action as {Object} with required shape.
 * @param {TaxState} state - Current state of the reducer
 * @param {{ type: string, payload?: any }} action - Redux action object
 * @returns {TaxState} The new state after applying the action
 */
export const taxReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TAX_SUCCESS:
            return {
                ...state,
                vats: [...state.vats, action.payload]
            }

        case DELETE_TAX_SUCCESS:
            return {
                ...state,
                vats: state.vats.filter((v) => v.id !== action.payload.id)
            }

        case EDIT_TAX_SUCCESS:
            return {
                ...state,
                vats: state.vats.map(v => 
                    v.id === action.payload.id ? action.payload : v
                ),
            }

        case FETCH_TAXES_SUCCESS:
            return {
                ...state,
                vats: action.payload
            }

        case RESET_APP_STATE:
            return initialState;

        default: return state;
    }
}