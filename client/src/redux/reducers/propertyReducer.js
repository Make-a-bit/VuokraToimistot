import {
    ADD_PROPERTY_SUCCESS, DELETE_PROPERTY_SUCCESS,
    EDIT_PROPERTY_SUCCESS, FETCH_PROPERTIES_SUCCESS,
    SELECTED_PROPERTY_OFFICE_SET, RESET_APP_STATE
} from "../actions/actiontypes"

/**
 * @typedef {Object} Property
 * @property {number|string} id - Unique identifier for the property
 */

/**
 * @typedef {Object} State
 * @property {Property[]} properties - Array of property objects
 * @property {Property|null} selectedPropertyOffice - Currently selected property or null
 */

/**
 * @type {State}
 * The initial state contains an empty array of properties and no selected property.
 */
const initialState = {
    properties: [],
    selectedPropertyOffice: null,
}

/**
 * @typedef {Object} Action
 * @property {string} type - Action type
 * @property {any} [payload] - Optional payload for the action
 */

/**
 * Reducer for property-related actions.
 * @param {State} state - Current state of the property reducer
 * @param {Action} action - Action dispatched to the reducer
 * @returns {State} New state after applying the action
 */
export const propertyReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PROPERTY_SUCCESS:
            return {
                ...state,
                properties: [...state.properties, action.payload],
            }

        case DELETE_PROPERTY_SUCCESS:
            return {
                ...state,
                properties: state.properties.filter((a) => a.id !== action.payload.id),
            }

        case EDIT_PROPERTY_SUCCESS:
            return {
                ...state,
                properties: state.properties.map(p =>
                    p.id === action.payload.id ? action.payload : p
                ),
            }

        case FETCH_PROPERTIES_SUCCESS:
            return {
                ...state,
                properties: action.payload
            }

        case SELECTED_PROPERTY_OFFICE_SET:
            return {
                ...state,
                selectedPropertyOffice: action.payload
            }

        case RESET_APP_STATE:
            return initialState;

        default: return state;
    }
}