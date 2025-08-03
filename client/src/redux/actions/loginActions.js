import {
    LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT,
    SHOW_LOADING, HIDE_LOADING, RESET_APP_STATE
} from "../actions/actiontypes";

import mainURI from "../../constants/apiEndpoint";

/**
 * Dispatches login actions and handles authentication.
 * @param {{ username: string, [key: string]: any }} user - The user credentials object. Assumed to have at least a username property based on usage.
 * @returns {function(function): Promise<void>} A thunk function for Redux dispatch.
 */
export const loginUser = (user) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(`${mainURI}/auth`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                const token = await response.text(); 
                localStorage.setItem("token", token);
                dispatch({ type: LOGIN_SUCCESS, payload: user.username })
            } else {
                dispatch({ type: LOGIN_FAILED });
            }
        } catch {
            dispatch({ type: LOGIN_FAILED })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Dispatches logout and app state reset actions.
 * @returns {function(function): void} A thunk function for Redux dispatch.
 */
export const logoutUser = () => {
    return (dispatch) => {
        dispatch({ type: LOGOUT });
        dispatch({ type: RESET_APP_STATE });
    }
}
