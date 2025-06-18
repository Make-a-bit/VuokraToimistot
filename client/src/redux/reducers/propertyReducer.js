import {
    ADD_PROPERTY_SUCCESS, DELETE_PROPERTY_SUCCESS,
    EDIT_PROPERTY_SUCCESS, FETCH_PROPERTIES_SUCCESS
} from "../actions/actiontypes"

const initialState = {
    properties: [],
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

        default: return state;
    }
}