import {
    ADD_RESERVATION_SUCCESS, DELETE_RESERVATION_SUCCESS,
    EDIT_RESERVATION_SUCCESS, FETCH_RESERVATION_SUCCESS, FETCH_RESERVED_DATES_SUCCESS,
    HIDE_LOADING, SHOW_LOADING, SHOW_ERROR, SHOW_SUCCESS,
    SELECTED_RESERVATION_OFFICE_SET, SELECTED_RESERVATION_OFFICE_PROPERTY_SET,
} from "../actions/actiontypes";

import mainURI from "../../constants/apiEndpoint";

/**
 * Adds a reservation by sending a POST request.
 * @param {Object} reservation - The reservation object to add.
 * @returns {function(Function): Promise<Object|null>} Thunk action returning the created reservation or null.
 */
export const addReservation = (reservation) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/reservation`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(reservation),
            });

            if (response.ok) {
                const createdReservation = await response.json();
                dispatch({ type: ADD_RESERVATION_SUCCESS, payload: createdReservation })
                dispatch({ type: SHOW_SUCCESS, payload: "Varauksen tallennus onnistui!" })
                return createdReservation;
            }
        } catch {
            dispatch({ type: SHOW_ERROR, payload: "Varauksen tallennus epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
        return null;
    }
}

/**
 * Deletes a reservation by sending a DELETE request.
 * @param {{id: number}} reservation - The reservation object to delete, must contain an id.
 * @returns {function(Function): Promise<void>} Thunk action.
 */
export const deleteReservation = (reservation) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            await fetch(`${mainURI}/reservation/delete/${reservation.id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            dispatch({ type: DELETE_RESERVATION_SUCCESS, payload: reservation })
            dispatch({ type: SHOW_SUCCESS, payload: "Varauksen poisto onnistui!" })
        } catch {
            dispatch({ type: SHOW_ERROR, payload: "Varauksen poisto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Fetches all reservations.
 * @returns {function(Function): Promise<void>} Thunk action.
 */
export const fetchReservations = () => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/reservation`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            dispatch({ type: FETCH_RESERVATION_SUCCESS, payload: data })
        } catch {
            dispatch({ type: SHOW_ERROR, payload: "Varausten nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Fetches reserved dates for a property.
 * @param {number|string} propertyId - The ID of the property.
 * @returns {function(Function): Promise<void>} Thunk action.
 */
export const fetchReservedDates = (propertyId) => async (dispatch) => {
    dispatch({ type: SHOW_LOADING });
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${mainURI}/reservation/reserved-dates/${propertyId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        dispatch({ type: FETCH_RESERVED_DATES_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: SHOW_ERROR, payload: "Virhe varaustietojen haussa!" });
    } finally {
        dispatch({ type: HIDE_LOADING })
    }
};

/**
 * Updates a reservation by sending a PUT request.
 * @param {Object} reservation - The reservation object to update.
 * @returns {function(Function): Promise<void>} Thunk action.
 */
export const updateReservation = (reservation) => async (dispatch) => {
    dispatch({ type: SHOW_LOADING })
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${mainURI}/reservation/update`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(reservation)
        });

        if (response.ok) {
            const editedReservation = await response.json();
            dispatch({ type: EDIT_RESERVATION_SUCCESS, payload: editedReservation })
            dispatch({ type: SHOW_SUCCESS, payload: "Varauksen päivitys onnistui!" })
        }
    } catch {
        dispatch({ type: SHOW_ERROR, payload: "Varauksen päivitys epäonnistui!" })
    } finally {
        dispatch({ type: HIDE_LOADING })
    }
}

/**
 * Sets the selected office.
 * @param {Object} office - The office object to set as selected.
 * @returns {{type: string, payload: Object}} Action object.
 */
export const setOffice = (office) => ({
    type: SELECTED_RESERVATION_OFFICE_SET,
    payload: office,
});

/**
 * Sets the selected property.
 * @param {Object} property - The property object to set as selected.
 * @returns {{type: string, payload: Object}} Action object.
 */
export const setProperty = (property) => ({
    type: SELECTED_RESERVATION_OFFICE_PROPERTY_SET,
    payload: property
});