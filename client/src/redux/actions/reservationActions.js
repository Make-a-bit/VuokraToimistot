import {
    ADD_RESERVATION_SUCCESS, DELETE_RESERVATION_SUCCESS,
    EDIT_RESERVATION_SUCCESS, FETCH_RESERVATION_SUCCESS, FETCH_RESERVED_DATES_SUCCESS,
    HIDE_LOADING, SHOW_LOADING, SHOW_ERROR, SHOW_SUCCESS,
    SELECTED_RESERVATION_OFFICE_SET, SELECTED_RESERVATION_OFFICE_PROPERTY_SET,
} from "../actions/actiontypes";

const mainURI = "https://localhost:7017";

export const addReservation = (reservation) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(`${mainURI}/reservation`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
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

export const deleteReservation = (reservation) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            await fetch(`${mainURI}/reservation/delete/${reservation.id}`, {
                method: "DELETE"
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

export const fetchReservations = () => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(`${mainURI}/reservation`, {
                method: "GET"
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

export const fetchReservedDates = (propertyId) => async (dispatch) => {
    dispatch({ type: SHOW_LOADING });
    try {
        const response = await fetch(`${mainURI}/reservation/reserved-dates/${propertyId}`);
        const data = await response.json();
        dispatch({ type: FETCH_RESERVED_DATES_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: SHOW_ERROR, payload: "Virhe varaustietojen haussa!" });
    } finally {
        dispatch({ type: HIDE_LOADING })
    }
};

export const updateReservation = (reservation) => async (dispatch) => {
    dispatch({ type: SHOW_LOADING })
    try {
        const response = await fetch(`${mainURI}/reservation/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
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

export const setOffice = (office) => ({
    type: SELECTED_RESERVATION_OFFICE_SET,
    payload: office,
});

export const setProperty = (property) => ({
    type: SELECTED_RESERVATION_OFFICE_PROPERTY_SET,
    payload: property
});