import {
    ADD_OFFICE_DEVICE_SUCCESS, EDIT_OFFICE_DEVICE_SUCCESS,
    DELETE_OFFICE_DEVICE_SUCCESS, FETCH_OFFICE_DEVICES_SUCCESS,
    HIDE_LOADING, SHOW_LOADING, SHOW_ERROR, SHOW_SUCCESS,
    SELECTED_DEVICE_OFFICE_SET
} from "./actiontypes";

import mainURI from "../../constants/apiEndpoint";

/**
 * Adds a new device via API and dispatches Redux actions.
 * apiEndPoint is expected to be a string URL.
 * device is expected to be an object representing the device.
 * Returns a thunk function for Redux.
 * @param {string} apiEndPoint
 * @param {Object} device
 * @returns {function(Function): Promise<void>}
 */
export const addDevice = (apiEndPoint, device) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(apiEndPoint, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(device)
            });

            if (response.ok) {
                const createdDevice = await response.json();
                dispatch({ type: ADD_OFFICE_DEVICE_SUCCESS, payload: createdDevice })
                dispatch({ type: SHOW_SUCCESS, payload: "Laitteen tallennus onnistui!" })
            }
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Laitteen tallennus epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Deletes a device via API and dispatches Redux actions.
 * device is expected to be an object with at least an 'id' property.
 * Returns a thunk function for Redux.
 * @param {{id: number, [key: string]: any}} device
 * @returns {function(Function): Promise<void>}
 */
export const deleteDevice = (device) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            await fetch(`${mainURI}/device/delete/${device.id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            dispatch({ type: DELETE_OFFICE_DEVICE_SUCCESS, payload: device })
            dispatch({ type: SHOW_SUCCESS, payload: "Laitteen poistaminen onnistui!" })
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Laitteen poistaminen epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Edits a device via API and dispatches Redux actions.
 * device is expected to be an object representing the device.
 * Returns a thunk function for Redux.
 * @param {Object} device
 * @returns {function(Function): Promise<void>}
 */
export const editDevice = (device) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/device/update`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(device)
            });

            if (response.ok) {
                const editedDevice = await response.json();
                dispatch({ type: EDIT_OFFICE_DEVICE_SUCCESS, payload: editedDevice })
                dispatch({ type: SHOW_SUCCESS, payload: "Laitteen päivitys onnistui!" })
            }
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Laitteen päivitys epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Fetches devices for a given office or all devices if officeId is null or <= 0.
 * officeId is expected to be a number or null.
 * Returns a thunk function for Redux.
 * @param {?number} officeId
 * @returns {function(Function): Promise<void>}
 */
export const fetchDevices = (officeId) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const uri = (officeId !== null && officeId > 0)
                ? `${mainURI}/device/by-office?id=${officeId}`
                : `${mainURI}/device/all`;
            const response = await fetch(uri, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            dispatch({ type: FETCH_OFFICE_DEVICES_SUCCESS, payload: data })
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Laitteiden nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Sets the selected office for a device.
 * office is expected to be an object (could be null or undefined if not set).
 * Returns a thunk function for Redux.
 * @param {Object} office
 * @returns {function(Function): Promise<void>}
 */
export const setDeviceOffice = (office) => {
    return async (dispatch) => {
        dispatch({ type: SELECTED_DEVICE_OFFICE_SET, payload: office })
    }
}