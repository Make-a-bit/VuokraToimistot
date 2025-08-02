import {
    ADD_OFFICE_SERVICE_SUCCESS,
    DELETE_OFFICE_SERVICE_SUCCESS,
    EDIT_OFFICE_SERVICE_SUCCESS,
    FETCH_OFFICE_SERVICES_SUCCESS,
    HIDE_LOADING, SHOW_LOADING, SHOW_ERROR, SHOW_SUCCESS,
    SELECTED_SERVICE_OFFICE_SET
} from "./actiontypes"

import mainURI from "../../constants/apiEndpoint";

/**
 * Adds a new office service via API.
 * apiEndPoint is expected to be a string URL.
 * service is expected to be an object representing the service to add.
 * Returns a thunk function for Redux dispatch.
 * @param {string} apiEndPoint 
 * @param {Object} service
 * @returns {function(function): Promise<void>}
 */
export const addOfficeService = (apiEndPoint, service) => {
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
                body: JSON.stringify(service),

            });

            if (response.ok) {
                const createdService = await response.json();
                dispatch({ type: ADD_OFFICE_SERVICE_SUCCESS, payload: createdService })
                dispatch({ type: SHOW_SUCCESS, payload: "Palvelun tallennus onnistui" })
            } else {
                throw new Error("API error")
            }
        } catch (err) {
            dispatch({ type: SHOW_ERROR, payload: "Palvelun tallennus epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Deletes a service via API.
 * service is expected to be an object with at least an 'id' property (number or string).
 * Returns a thunk function for Redux dispatch.
 * @param {{id: number|string, [key: string]: any}} service
 * @returns {function(function): Promise<void>}
 */
export const deleteService = (service) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            await fetch(`${mainURI}/service/delete/${service.id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            dispatch({ type: DELETE_OFFICE_SERVICE_SUCCESS, payload: service })
            dispatch({ type: SHOW_SUCCESS, payload: "Palvelun poisto onnistui!" })
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Palvelun poisto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Edits an existing service via API.
 * service is expected to be an object representing the service to edit.
 * Returns a thunk function for Redux dispatch.
 * @param {Object} service
 * @returns {function(function): Promise<void>}
 */
export const editService = (service) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/service/update`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(service)
            });

            if (response.ok) {
                const editedService = await response.json();
                dispatch({ type: EDIT_OFFICE_SERVICE_SUCCESS, payload: editedService })
                dispatch({ type: SHOW_SUCCESS, payload: "Palvelun päivitys onnistui!" })
            }
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Palvelun päivitys epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Fetches services for a given office or all services if officeId is null/undefined/0.
 * officeId is expected to be a number or null/undefined.
 * Returns a thunk function for Redux dispatch.
 * @param {?number} officeId
 * @returns {function(function): Promise<void>}
 */
export const fetchServices = (officeId) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const uri = (officeId != null && officeId > 0)
                ? `${mainURI}/service/by-office?id=${officeId}`
                : `${mainURI}/service/all`;
            const response = await fetch(uri, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            dispatch({ type: FETCH_OFFICE_SERVICES_SUCCESS, payload: data })
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Palvelujen nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Sets the selected office in the Redux store.
 * office is expected to be an object (structure not specified).
 * Returns a thunk function for Redux dispatch.
 * @param {Object} office
 * @returns {function(function): Promise<void>}
 */
export const setOffice = (office) => {
    return async (dispatch) => {
        dispatch({ type: SELECTED_SERVICE_OFFICE_SET, payload: office })
    }
}