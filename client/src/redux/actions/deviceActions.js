import {
    ADD_OFFICE_DEVICE_SUCCESS, EDIT_OFFICE_DEVICE_SUCCESS,
    DELETE_OFFICE_DEVICE_SUCCESS, FETCH_OFFICE_DEVICES_SUCCESS,
    HIDE_LOADING, SHOW_LOADING, SHOW_ERROR, SHOW_SUCCESS,
    SELECTED_DEVICE_OFFICE_SET
} from "./actiontypes";

const mainURI = "https://localhost:7017";

export const addDevice = (apiEndPoint, device) => {
    console.log("Device", device)
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(apiEndPoint, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(device)
            });

            if (response.ok) {
                const createdDevice = await response.json();
                console.log("Created device:", createdDevice);
                dispatch({ type: ADD_OFFICE_DEVICE_SUCCESS, payload: createdDevice })
                dispatch({ type: SHOW_SUCCESS, payload: "Laitteen tallennus onnistui!" })
            }
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Laitteen tallennus epäonnistui!" })
            console.log("Error while saving new device", error)
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const deleteDevice = (device) => {
    console.log("Device to del:", device)
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            await fetch(`${mainURI}/device/delete/${device.id}`, {
                method: "DELETE"
            });
            dispatch({ type: DELETE_OFFICE_DEVICE_SUCCESS, payload: device })
            dispatch({ type: SHOW_SUCCESS, payload: "Laitteen poistaminen onnistui!" })
        } catch (error) {
            console.log("Error while deleting device:", error)
            dispatch({ type: SHOW_ERROR, payload: "Laitteen poistaminen epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const editDevice = (device) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(`${mainURI}/device/update`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(device)
            });

            if (response.ok) {
                const editedDevice = await response.json();
                console.log("Device edited:", editedDevice)
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

export const fetchDevices = (officeId) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(`${mainURI}/device/?id=${officeId}`, {
                method: "GET",
            });

            const data = await response.json();
            dispatch({ type: FETCH_OFFICE_DEVICES_SUCCESS, payload: data })
        } catch (error) {
            console.log("Error while fetching office devices:", error)
            dispatch({ type: SHOW_ERROR, payload: "Laitteiden nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const setDeviceOffice = (office) => {
    return async (dispatch) => {
        dispatch({ type: SELECTED_DEVICE_OFFICE_SET, payload: office })
    }
}