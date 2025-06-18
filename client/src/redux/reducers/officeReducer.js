import {
    ADD_OFFICE_SUCCESS, DELETE_OFFICE_SUCCESS,
    EDIT_OFFICE_SUCCESS, FETCH_OFFICES_SUCCESS,
    SELECTED_OFFICE_SET
} from "../actions/actiontypes"

const initialState = {
    offices: [],
    selectedOffice: null,
};

export const officeReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_OFFICE_SUCCESS:
            return {
                ...state,
                offices: [...state.offices, action.payload],
            }

        case DELETE_OFFICE_SUCCESS:
            return {
                ...state,
                offices: state.offices.filter((a) => a.id !== action.payload.id),
            }

        case EDIT_OFFICE_SUCCESS:
            return {
                ...state,
                offices: state.offices.map(o =>
                    o.id === action.payload.id ? action.payload : o
                ),
            }

        case FETCH_OFFICES_SUCCESS:
            return {
                ...state,
                offices: action.payload
            };

        case SELECTED_OFFICE_SET:
            return {
                ...state,
                selectedOffice: action.payload
            }

        default: return state;
    }
}