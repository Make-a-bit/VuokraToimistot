import {
    ADD_RESERVATION_SUCCESS, DELETE_RESERVATION_SUCCESS,
    EDIT_RESERVATION_SUCCESS, FETCH_RESERVATION_SUCCESS,
    SELECTED_RESERVATION_OFFICE, SELECTED_RESERVATION_OFFICE_PROPERTY,
} from "../actions/actiontypes";

const initialState = {
    reservations: [],
    selectedReservationOffice: null,
    selectedReservationOfficeProperty: null,
}

export const reservationReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_RESERVATION_SUCCESS:
            return {
                ...state,
                reservations: [...state.reservations, action.payload]
            }

        default: return state;
    }
}