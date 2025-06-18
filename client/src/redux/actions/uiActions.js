import {
    CLEAR_MESSAGES, HIDE_LOADING, SHOW_ERROR, SHOW_LOADING, SHOW_SUCCESS
} from "./actiontypes";

export function clearMessages() {
    return { type: CLEAR_MESSAGES };
}

export function hideLoading() {
    return { type: HIDE_LOADING }
}

export function showError(message) {
    return { type: SHOW_ERROR, payload: message }
}

export function showLoading() {
    return { type: SHOW_LOADING }
}

export function showSuccess(message) {
    return { type: SHOW_SUCCESS, payload: message }
}