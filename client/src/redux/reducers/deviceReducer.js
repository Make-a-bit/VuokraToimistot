import {
    ADD_OFFICE_DEVICE_SUCCESS, DELETE_OFFICE_DEVICE_SUCCESS,
    EDIT_OFFICE_DEVICE_SUCCESS, FETCH_OFFICE_DEVICES_SUCCESS,
    SELECTED_DEVICE_OFFICE_SET, RESET_APP_STATE
} from "../actions/actiontypes";

/**
 * @typedef {Object} OfficeDevice
 * @property {number|string} id - Unique identifier for the device
 */

/**
 * @typedef {Object} DeviceState
 * @property {OfficeDevice[]} devices - List of office devices
 * @property {OfficeDevice|null} selectedDeviceOffice - Currently selected device or null
 */

/**
 * The initial state for the device reducer.
 * @type {DeviceState}
 */
const initialState = {
    devices: [],
    selectedDeviceOffice: null,
}

/**
 * Redux reducer for managing office devices.
 * @param {DeviceState} state - Current state of the reducer
 * @param {Object} action - Redux action object
 * @param {string} action.type - Action type
 * @param {*} [action.payload] - Action payload, varies by action type
 * @returns {DeviceState} New state after applying the action
 *
 * Reasoning: 
 * - `state` is always a DeviceState object.
 * - `action` is a Redux action, with a string `type` and optional `payload`.
 * - Returns a new DeviceState object.
 */
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

        case RESET_APP_STATE:
            return initialState;

        default: return state;
    }
}