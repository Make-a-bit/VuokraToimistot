import { LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT } from "../actions/actiontypes";

/**
 * The initial state for the login reducer.
 * @type {{loggedUser: string, loginError: boolean}}
 */
const initialState = {
    loggedUser: "",
    loginError: false,
};

/**
 * Reducer for handling login-related actions.
 * @param {{loggedUser: string, loginError: boolean}} state - The current state of the login reducer.
 * @param {{type: string, payload?: string}} action - The dispatched action. `payload` is expected to be a string when type is LOGIN_SUCCESS.
 * @returns {{loggedUser: string, loginError: boolean}} The new state after applying the action.
 *
 * Reasoning: 
 * - `state` is always an object with `loggedUser` (string) and `loginError` (boolean) based on initialState and all return statements.
 * - `action.type` is a string (imported constants).
 * - `action.payload` is only used in LOGIN_SUCCESS and is assigned to `loggedUser`, which is a string.
 */
export const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                loggedUser: action.payload,
                loginError: false,
            };

        case LOGIN_FAILED:
            return {
                ...state,
                loggedUser: "",
                loginError: true,
            };

        case LOGOUT:
            return {
                ...state,
                loggedUser: "",
                loginError: false,
            };

        default:
            return state;
    }
};