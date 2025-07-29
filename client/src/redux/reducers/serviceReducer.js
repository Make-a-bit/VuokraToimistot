import {
    ADD_OFFICE_SERVICE_SUCCESS, DELETE_OFFICE_SERVICE_SUCCESS,
    EDIT_OFFICE_SERVICE_SUCCESS, FETCH_OFFICE_SERVICES_SUCCESS,
    SELECTED_SERVICE_OFFICE_SET
} from "../actions/actiontypes"

const initialState = {
    services: [],
    selectedServiceOffice: null,
}

export const serviceReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_OFFICE_SERVICE_SUCCESS:
            return {
                ...state,
                services: [...state.services, action.payload]
            }

        case DELETE_OFFICE_SERVICE_SUCCESS:
            return {
                ...state,
                services: state.services.filter((s) => s.id !== action.payload.id),
            }

        case EDIT_OFFICE_SERVICE_SUCCESS:
            return {
                ...state,
                services: state.services.map(s => 
                    s.id === action.payload.id ? action.payload : s
                ),
            }

        case FETCH_OFFICE_SERVICES_SUCCESS:
            return {
                ...state,
                services: action.payload
            }

        case SELECTED_SERVICE_OFFICE_SET:
            return {
                ...state,
                selectedServiceOffice: action.payload
            }

        default: return state;
    }
}