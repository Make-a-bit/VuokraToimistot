import {
    ADD_RESERVATION_SUCCESS, DELETE_RESERVATION_SUCCESS,
    EDIT_RESERVATION_SUCCESS, FETCH_RESERVATION_SUCCESS,
    HIDE_LOADING, SHOW_LOADING, SHOW_ERROR, SHOW_SUCCESS,
    SELECTED_RESERVATION_OFFICE_SET, SELECTED_RESERVATION_OFFICE_PROPERTY_SET,
} from "../actions/actiontypes";

const mainURI = "https://localhost:7017";

export const addProperty = (reservation) => {
    console.log("Reservation:", reservation);
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(`${mainURI}`, { // UPDATE URI !!
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
