import {
    ADD_RESERVATION_SUCCESS, DELETE_RESERVATION_SUCCESS,
    EDIT_RESERVATION_SUCCESS, FETCH_RESERVATION_SUCCESS,
    FETCH_RESERVED_DATES_SUCCESS,
    SELECTED_RESERVATION_OFFICE_SET, SELECTED_RESERVATION_OFFICE_PROPERTY_SET,
    SET_AVAILABLE_DEVICES, SET_AVAILABLE_SERVICES,
} from "../actions/actiontypes";

const initialState = {
    reservations: [],
    reservedDates: [],
    availableDevices: [],
    availableServices: [],
    selectedReservationCustomer: null,
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

        case DELETE_RESERVATION_SUCCESS:
            return {
                ...state,
                reservations: state.reservations.filter((r) => r.id !== action.payload.id)
            }

        case FETCH_RESERVATION_SUCCESS:
            return {
                ...state,
                reservations: action.payload
            }

        case FETCH_RESERVED_DATES_SUCCESS:
            return {
                ...state,
                reservedDates: action.payload
            }

        case SELECTED_RESERVATION_OFFICE_SET:
            return {
                ...state,
                selectedReservationOffice: action.payload
            }

        case SELECTED_RESERVATION_OFFICE_PROPERTY_SET:
            return {
                ...state,
                selectedReservationOfficeProperty: action.payload
            }

        case SET_AVAILABLE_DEVICES:
            return {
                ...state,
                availableDevices: action.payload
            }

        case SET_AVAILABLE_SERVICES:
            return {
                ...state,
                availableServices: action.payload
            }

        default: return state;
    }
}