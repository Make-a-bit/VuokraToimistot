import {
    CLEAR_MESSAGES, HIDE_LOADING, SHOW_ERROR, SHOW_LOADING, SHOW_SUCCESS
} from "../actions/actiontypes"

const initialState = {
    loadingState: false,
    errorMessage: null,
    successMessage: null,
}

export const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_LOADING:
            return { ...state, loading: true };

        case HIDE_LOADING:
            return { ...state, loading: false };

        case SHOW_ERROR:
            return { ...state, errorMessage: action.payload };

        case SHOW_SUCCESS:
            return { ...state, successMessage: action.payload };

        case CLEAR_MESSAGES:
            return { ...state, errorMessage: null, successMessage: null };

        default:
            return state;
    }
}