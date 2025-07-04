import {
    ADD_RESERVATION_SUCCESS, DELETE_RESERVATION_SUCCESS,
    EDIT_RESERVATION_SUCCESS, FETCH_RESERVATION_SUCCESS, FETCH_RESERVED_DATES_SUCCESS,
    HIDE_LOADING, SHOW_LOADING, SHOW_ERROR, SHOW_SUCCESS,
    SELECTED_RESERVATION_OFFICE_SET, SELECTED_RESERVATION_OFFICE_PROPERTY_SET,
    SET_RESERVED_DATES, SET_AVAILABLE_DEVICES, SET_AVAILABLE_SERVICES,
} from "../actions/actiontypes";

const mainURI = "https://localhost:7017";

export const addReservation = (reservation) => {
    console.log("Reservation:", reservation);
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
                console.log("Created reservation:", createdReservation)
                dispatch({ type: ADD_RESERVATION_SUCCESS, payload: createdReservation })
                dispatch({ type: SHOW_SUCCESS, payload: "Varauksen tallennus onnistui!" })
            }
        } catch (err) {
            dispatch({ type: SHOW_ERROR, payload: "Varauksen tallennus epäonnistui!" })
            console.log("Error while adding a new reservation:", err)
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
            console.log("Reservations:", data)
            dispatch({ type: FETCH_RESERVATION_SUCCESS, payload: data })
        } catch (error) {
            console.log("Error while fetching reservations:", error)
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

export const setOffice = (office) => ({
    type: SELECTED_RESERVATION_OFFICE_SET,
    payload: office,
});

export const setProperty = (property) => ({
    type: SELECTED_RESERVATION_OFFICE_PROPERTY_SET,
    payload: property
});