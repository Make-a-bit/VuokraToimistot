import {
    ADD_PROPERTY_SUCCESS, DELETE_PROPERTY_SUCCESS,
    EDIT_PROPERTY_SUCCESS, FETCH_PROPERTIES_SUCCESS,
    SELECTED_PROPERTY_OFFICE_SET, RESET_APP_STATE
} from "../actions/actiontypes"

const initialState = {
    properties: [],
    selectedPropertyOffice: null,
}

export const propertyReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PROPERTY_SUCCESS:
            return {
                ...state,
                properties: [...state.properties, action.payload],
            }

        case DELETE_PROPERTY_SUCCESS:
            return {
                ...state,
                properties: state.properties.filter((a) => a.id !== action.payload.id),
            }

        case EDIT_PROPERTY_SUCCESS:
            return {
                ...state,
                properties: state.properties.map(p =>
                    p.id === action.payload.id ? action.payload : p
                ),
            }

        case FETCH_PROPERTIES_SUCCESS:
            return {
                ...state,
                properties: action.payload
            }

        case SELECTED_PROPERTY_OFFICE_SET:
            return {
                ...state,
                selectedPropertyOffice: action.payload
            }

        case RESET_APP_STATE:
            return initialState;

        default: return state;
    }
}