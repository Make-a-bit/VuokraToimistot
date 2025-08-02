import {
    ADD_OFFICE_SERVICE_SUCCESS, DELETE_OFFICE_SERVICE_SUCCESS,
    EDIT_OFFICE_SERVICE_SUCCESS, FETCH_OFFICE_SERVICES_SUCCESS,
    SELECTED_SERVICE_OFFICE_SET, RESET_APP_STATE
} from "../actions/actiontypes"

/**
 * The initial state for the service reducer.
 * @type {{services: Array<Object>, selectedServiceOffice: (Object|null)}}
 * Reasoning: 'services' is always an array (populated by payloads), 'selectedServiceOffice' is either an object or null.
 */
const initialState = {
    services: [],
    selectedServiceOffice: null,
}

/**
 * Service reducer to handle office service actions.
 * @param {{services: Array<Object>, selectedServiceOffice: (Object|null)}} state - Current state of the reducer.
 * @param {{type: string, payload?: any}} action - Redux action with optional payload.
 * @returns {{services: Array<Object>, selectedServiceOffice: (Object|null)}} New state after applying the action.
 * Reasoning: State shape is defined by initialState, action is a standard Redux action object.
 */
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

        case RESET_APP_STATE:
            return initialState;

        default: return state;
    }
}