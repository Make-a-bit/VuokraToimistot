import {
    ADD_OFFICE_SUCCESS,
    DELETE_OFFICE_SUCCESS,
    EDIT_OFFICE_SUCCESS,
    FETCH_OFFICES_SUCCESS,
    HIDE_LOADING, SHOW_LOADING, SHOW_ERROR, SHOW_SUCCESS,
} from "./actiontypes"

import mainURI from "../../constants/apiEndpoint";

/**
 * Adds a new office by making a POST request to the given API endpoint.
 * @param {string} apiEndPoint - The API endpoint URL.
 * @param {Object} office - The office object to add.
 * @returns {function(Function): Promise<void>} Thunk action for Redux dispatch.
 */
export const addOffice = (apiEndPoint, office) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(apiEndPoint, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(office),
            });

            if (response.ok) {
                const createdOffice = await response.json();
                dispatch({ type: ADD_OFFICE_SUCCESS, payload: createdOffice })
                dispatch({ type: SHOW_SUCCESS, payload: "Kohteen tallennus onnistui!" })
            } else {
                throw new Error("API error")
            }
        } catch (err) {
            dispatch({ type: SHOW_ERROR, payload: "Kohteen tallennus epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Deletes an office by making a DELETE request.
 * @param {Object} office - The office object to delete. Must contain an 'id' property.
 * @returns {function(Function): Promise<void>} Thunk action for Redux dispatch.
 */
export const deleteOffice = (office) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            await fetch(`${mainURI}/office/delete/${office.id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            dispatch({ type: DELETE_OFFICE_SUCCESS, payload: office });
            dispatch({ type: SHOW_SUCCESS, payload: "Kohteen poistaminen onnistui!" })
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Kohteen poistaminen epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Edits an office by making a PUT request.
 * @param {Object} office - The office object to edit.
 * @returns {function(Function): Promise<void>} Thunk action for Redux dispatch.
 */
export const editOffice = (office) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/office/update`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(office),
            });

            if (response.ok) {
                const editedOffice = await response.json();
                dispatch({ type: EDIT_OFFICE_SUCCESS, payload: editedOffice })
                dispatch({ type: SHOW_SUCCESS, payload: "Kohteen päivitys onnistui!" })
            }
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Kohteen päivitys epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Fetches all offices by making a GET request.
 * @returns {function(Function): Promise<void>} Thunk action for Redux dispatch.
 */
export const fetchOffices = () => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/office`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            dispatch({ type: FETCH_OFFICES_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Kohteiden nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}