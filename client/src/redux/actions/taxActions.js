import {
    ADD_TAX_SUCCESS, DELETE_TAX_SUCCESS,
    EDIT_TAX_SUCCESS, FETCH_TAXES_SUCCESS,
    HIDE_LOADING, SHOW_ERROR, SHOW_LOADING, SHOW_SUCCESS
} from "../actions/actiontypes";

import mainURI from "../../constants/apiEndpoint";

/**
 * Adds a new tax entry by sending a POST request.
 * @param {{ id?: number, [key: string]: any }} tax - The tax object to add. Assumed to have at least an optional id and other properties.
 * @returns {function(Function): Promise<void>} Thunk action for Redux dispatch.
 */
export const addTax = (apiEndPoint, tax) => {
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
                body: JSON.stringify(tax)
            });

            if (response.ok) {
                const createdTax = await response.json();
                dispatch({ type: ADD_TAX_SUCCESS, payload: createdTax })
                dispatch({ type: SHOW_SUCCESS, payload: "Verokannan luonti onnistui!" })
            }
        } catch {
            dispatch({ type: SHOW_ERROR, payload: "Verokannan luonti epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Deletes a tax entry by sending a DELETE request.
 * @param {{ id: number, [key: string]: any }} tax - The tax object to delete. Must have an id property.
 * @returns {function(Function): Promise<void>} Thunk action for Redux dispatch.
 */
export const deleteTax = (tax) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/tax/delete/${tax.id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (response.ok) {
                dispatch({ type: DELETE_TAX_SUCCESS, payload: tax })
                dispatch({ type: SHOW_SUCCESS, payload: "Verokannan poisto onnistui!" })
            }
            else {
                dispatch({ type: SHOW_ERROR, payload: "Verokannan poisto epäonnistui!" })
            }
        } catch {
            dispatch({ type: SHOW_ERROR, payload: "Verokannan poisto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Edits an existing tax entry by sending a PUT request.
 * @param {{ id: number, [key: string]: any }} tax - The tax object to edit. Must have an id property.
 * @returns {function(Function): Promise<void>} Thunk action for Redux dispatch.
 */
export const editTax = (tax) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/tax/update`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(tax)
            });

            if (response.ok) {
                const editedTax = await response.json();
                dispatch({ type: EDIT_TAX_SUCCESS, payload: editedTax })
                dispatch({ type: SHOW_SUCCESS, payload: "Verokannan päivitys onnistui!" })
            }
        } catch {
            dispatch({ type: SHOW_ERROR, payload: "Verokannan päivitys epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Fetches all tax entries by sending a GET request.
 * @returns {function(Function): Promise<void>} Thunk action for Redux dispatch.
 */
export const fetchTaxes = () => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/tax`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            dispatch({ type: FETCH_TAXES_SUCCESS, payload: data })
        } catch (e) {
            dispatch({ type: SHOW_ERROR, payload: "Verokantojen nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

// Reasoning: The tax parameter is assumed to be an object with at least an id property for delete/edit,
// and possibly other properties for add / edit.The thunk actions return a function that takes dispatch
// and returns a Promise <void>.