import {
    ADD_OFFICE_DEVICE_SUCCESS, DELETE_OFFICE_DEVICE_SUCCESS,
    EDIT_OFFICE_DEVICE_SUCCESS, FETCH_OFFICE_DEVICES_SUCCESS,
    SELECTED_DEVICE_OFFICE_SET
} from "../actions/actiontypes";

const initialState = {
    devices: [],
    selectedDeviceOffice: null,
}

export const deviceReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_OFFICE_DEVICE_SUCCESS:
            return {
                ...state,
                devices: [...state.devices, action.payload]
            }

        case DELETE_OFFICE_DEVICE_SUCCESS:
            return {
                ...state,
                devices: state.devices.filter((d) => d.id !== action.payload.id),
            }

        case EDIT_OFFICE_DEVICE_SUCCESS:
            return {
                ...state,
                devices: state.devices.map(d =>
                    d.id === action.payload.id ? action.payload : d
                ),
            }

        case FETCH_OFFICE_DEVICES_SUCCESS:
            return {
                ...state,
                devices: action.payload
            }

        case SELECTED_DEVICE_OFFICE_SET:
            return {
                ...state,
                selectedDeviceOffice: action.payload
            }

        default: return state;
    }
}