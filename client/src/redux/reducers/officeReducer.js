import {
    ADD_OFFICE_SUCCESS, DELETE_OFFICE_SUCCESS,
    EDIT_OFFICE_SUCCESS, FETCH_OFFICES_SUCCESS,
    RESET_APP_STATE
} from "../actions/actiontypes"

/**
 * @typedef {Object} Office
 * @property {number|string} id - Unique identifier for the office
 * @property {any} [otherProps] - Other properties of the office object
 */

/**
 * @typedef {Object} OfficeState
 * @property {Office[]} offices - Array of office objects
 */

/**
 * The initial state of the office reducer.
 * Chose OfficeState type because it contains an array of Office objects.
 * @type {OfficeState}
 */
const initialState = {
    offices: [],
};

/**
 * Office reducer function to handle office-related actions.
 * Annotated state as OfficeState and action as a Redux action with a payload.
 * @param {OfficeState} state - Current state of the office reducer
 * @param {{ type: string, payload?: any }} action - Redux action object
 * @returns {OfficeState} New state after applying the action
 */
export const officeReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_OFFICE_SUCCESS:
            return {
                ...state,
                offices: [...state.offices, action.payload],
            }

        case DELETE_OFFICE_SUCCESS:
            return {
                ...state,
                offices: state.offices.filter((a) => a.id !== action.payload.id),
            }

        case EDIT_OFFICE_SUCCESS:
            return {
                ...state,
                offices: state.offices.map(o =>
                    o.id === action.payload.id ? action.payload : o
                ),
            }

        case FETCH_OFFICES_SUCCESS:
            return {
                ...state,
                offices: action.payload
            };

        case RESET_APP_STATE:
            return initialState;

        default: return state;
    }
}