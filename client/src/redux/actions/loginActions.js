import {
    LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT,
    SHOW_LOADING, HIDE_LOADING, RESET_APP_STATE
} from "../actions/actiontypes";

const mainURI = "https://localhost:7017";

export const loginUser = (user) => {
//    console.log(user)
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

export const logoutUser = () => {
    return (dispatch) => {
        dispatch({ type: LOGOUT });
        dispatch({ type: RESET_APP_STATE });
    }
}