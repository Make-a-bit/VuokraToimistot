import {
    CLEAR_MESSAGES, HIDE_LOADING, SHOW_ERROR, SHOW_LOADING, SHOW_SUCCESS
} from "../actions/actiontypes"

/**
 * The initial state for the UI reducer.
 * loadingState: boolean indicating if loading is active.
 * errorMessage: string or null for error messages.
 * successMessage: string or null for success messages.
 * @type {{loadingState: boolean, errorMessage: (string|null), successMessage: (string|null)}}
 */
const initialState = {
    loadingState: false,
    errorMessage: null,
    successMessage: null,
}

/**
 * UI reducer to handle loading, error, and success message state.
 * @param {{loadingState: boolean, errorMessage: (string|null), successMessage: (string|null)}} state - Current UI state.
 * @param {{type: string, payload?: string}} action - Redux action with optional payload.
 * @returns {{loadingState: boolean, errorMessage: (string|null), successMessage: (string|null)}} New UI state.
 *
 * Reasoning: 
 * - state is always an object matching initialState's shape.
 * - action.type is a string, action.payload is only used for error/success and is a string.
 */
export const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_LOADING:
            return { ...state, loadingState: true };

        case HIDE_LOADING:
            return { ...state, loadingState: false };

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