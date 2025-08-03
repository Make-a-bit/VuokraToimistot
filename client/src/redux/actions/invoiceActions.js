import {
    ADD_INVOICE_SUCCESS, DELETE_INVOICE_SUCCESS,
    EDIT_INVOICE_SUCCESS, FETCH_INVOICES_SUCCESS,
    HIDE_LOADING, SHOW_ERROR, SHOW_LOADING, SHOW_SUCCESS
} from "../actions/actiontypes";

import mainURI from "../../constants/apiEndpoint";

/**
 * Creates an invoice for a given reservation.
 * @param {Object} reservation - The reservation object to create an invoice for.
 * @returns {function(Function): Promise<void>} Thunk action for Redux dispatch.
 * Chose Object for reservation as its structure is not specified but is serialized to JSON.
 */
export const createInvoice = (reservation) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/invoice`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(reservation)
            });

            if (response.ok) {
                const createdInvoice = await response.json();
                dispatch({ type: ADD_INVOICE_SUCCESS, payload: createdInvoice })
                dispatch({ type: SHOW_SUCCESS, payload: "Laskun luonti onnistui!" })
            }
        } catch {
            dispatch({ type: SHOW_ERROR, payload: "Laskun luonti epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Deletes a given invoice.
 * @param {Object} invoice - The invoice object to delete.
 * @returns {function(Function): Promise<void>} Thunk action for Redux dispatch.
 * Chose Object for invoice as its structure is not specified but is serialized to JSON.
 */
export const deleteInvoice = (invoice) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            await fetch(`${mainURI}/invoice`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(invoice)
            });
            dispatch({ type: DELETE_INVOICE_SUCCESS, payload: invoice })
            dispatch({ type: SHOW_SUCCESS, payload: "Laskun poisto onnistui!" })
        } catch {
            dispatch({ type: SHOW_ERROR, payload: "Laskun poisto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Fetches all invoices.
 * @returns {function(Function): Promise<void>} Thunk action for Redux dispatch.
 * No parameters, returns a thunk for async Redux.
 */
export const fetchInvoices = () => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/invoice`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json();
                dispatch({ type: FETCH_INVOICES_SUCCESS, payload: data })
            } else {
                const errorText = await response.text();
                console.error('Invoice fetch error:', errorText);
                throw new Error(errorText);
            }
        } catch {
            dispatch({ type: SHOW_ERROR, payload: "Laskujen nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Updates a given invoice.
 * @param {Object} invoice - The invoice object to update.
 * @returns {function(Function): Promise<void>} Thunk action for Redux dispatch.
 * Chose Object for invoice as its structure is not specified but is serialized to JSON.
 */
export const updateInvoice = (invoice) => async (dispatch) => {
    dispatch({ type: SHOW_LOADING })
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${mainURI}/invoice/update`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(invoice)
        });

        if (response.ok) {
            const updatedInvoice = await response.json();
            dispatch({ type: EDIT_INVOICE_SUCCESS, payload: updatedInvoice })
            dispatch({ type: SHOW_SUCCESS, payload: "Laskun päivitys onnistui!" })
        }
    } catch {
        dispatch({ type: SHOW_ERROR, payload: "Laskun päivitys epäonnistui!" })
    } finally {
        dispatch({ type: HIDE_LOADING })
    }
}