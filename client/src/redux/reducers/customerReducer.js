import {
    ADD_CUSTOMER_SUCCESS, DELETE_CUSTOMER_SUCCESS,
    EDIT_CUSTOMER_SUCCESS, FETCH_CUSTOMERS_SUCCESS,
    RESET_APP_STATE
} from "../actions/actiontypes"

/**
 * The initial state of the customer reducer.
 * @type {{ customers: Array<Object> }}
 * Reasoning: customers is always an array of objects representing customers.
 */
const initialState = {
    customers: [],
}

/**
 * Customer reducer function to handle customer-related actions.
 * @param {{ customers: Array<Object> }} state - The current state of the reducer.
 * @param {{ type: string, payload?: any }} action - The action dispatched to the reducer.
 * @returns {{ customers: Array<Object> }} The new state after applying the action.
 * Reasoning: state always has a customers array; action has a type and may have a payload.
 */
export const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_CUSTOMER_SUCCESS:
            return {
                ...state,
                customers: [...state.customers, action.payload],
            }

        case DELETE_CUSTOMER_SUCCESS:
            return {
                ...state,
                customers: state.customers.filter((a) => a.id !== action.payload.id),
            };

        case EDIT_CUSTOMER_SUCCESS:
            return {
                ...state,
                customers: state.customers.map(c =>
                    c.id === action.payload.id ? action.payload : c
                ),
            }

        case FETCH_CUSTOMERS_SUCCESS:
            return {
                ...state,
                customers: action.payload
            };

        case RESET_APP_STATE:
            return initialState;

        default: return state;
    }
}