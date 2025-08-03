import {
    ADD_RESERVATION_SUCCESS, DELETE_RESERVATION_SUCCESS,
    EDIT_RESERVATION_SUCCESS, FETCH_RESERVATION_SUCCESS,
    FETCH_RESERVED_DATES_SUCCESS,
    SELECTED_RESERVATION_OFFICE_SET, SELECTED_RESERVATION_OFFICE_PROPERTY_SET,
    SET_AVAILABLE_DEVICES, SET_AVAILABLE_SERVICES,
    RESET_APP_STATE
} from "../actions/actiontypes";

/**
 * The initial state for the reservation reducer.
 * - reservations: Array of reservation objects.
 * - reservedDates: Array of reserved date objects or strings.
 * - availableDevices: Array of device objects.
 * - availableServices: Array of service objects.
 * - selectedReservationCustomer: Selected customer object or null.
 * - selectedReservationOffice: Selected office object or null.
 * - selectedReservationOfficeProperty: Selected office property object or null.
 * 
 * @type {{
 *   reservations: Array<Object>,
 *   reservedDates: Array<Object|string>,
 *   availableDevices: Array<Object>,
 *   availableServices: Array<Object>,
 *   selectedReservationCustomer: Object|null,
 *   selectedReservationOffice: Object|null,
 *   selectedReservationOfficeProperty: Object|null
 * }}
 */
const initialState = {
    reservations: [],
    reservedDates: [],
    availableDevices: [],
    availableServices: [],
    selectedReservationCustomer: null,
    selectedReservationOffice: null,
    selectedReservationOfficeProperty: null,
}

/**
 * Reducer for reservation-related actions.
 * 
 * @param {typeof initialState} state - The current state.
 * @param {{ type: string, payload?: any }} action - The dispatched action.
 * @returns {typeof initialState} The new state after applying the action.
 * 
 * Reasoning: 
 * - state is always the shape of initialState.
 * - action is a Redux action with a string type and optional payload.
 * - Returns a new state object matching the initialState shape.
 */
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

        case EDIT_RESERVATION_SUCCESS:
            return {
                ...state,
                reservations: state.reservations.map(r => 
                    r.id === action.payload.id ? action.payload : r
                ),
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

        case RESET_APP_STATE:
            return initialState;

        default: return state;
    }
}