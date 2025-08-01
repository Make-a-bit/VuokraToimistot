import { LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT } from "../actions/actiontypes";

const initialState = {
    loggedUser: "",
    loginError: false,
};

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