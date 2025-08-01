import {
    ADD_CUSTOMER_SUCCESS, DELETE_CUSTOMER_SUCCESS,
    EDIT_CUSTOMER_SUCCESS, FETCH_CUSTOMERS_SUCCESS,
    RESET_APP_STATE
} from "../actions/actiontypes"

const initialState = {
    customers: [],
}

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