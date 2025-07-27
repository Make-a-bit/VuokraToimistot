import {
    ADD_INVOICE_SUCCESS, DELETE_INVOICE_SUCCESS,
    EDIT_INVOICE_SUCCESS, FETCH_INVOICES_SUCCESS,
    HIDE_LOADING, SHOW_ERROR, SHOW_LOADING, SHOW_SUCCESS
} from "../actions/actiontypes";

const mainURI = "https://localhost:7017";

export const createInvoice = (reservation) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(`${mainURI}/invoice`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
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

export const fetchInvoices = () => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(`${mainURI}/invoice`, {
                method: "GET"
            });
            const data = await response.json();
            console.log("Invoice:", data)
            dispatch({ type: FETCH_INVOICES_SUCCESS, payload: data })
        } catch {
            dispatch({ type: SHOW_ERROR, payload: "Laskujen nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}