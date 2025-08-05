import {
    ADD_PROPERTY_SUCCESS,
    DELETE_PROPERTY_SUCCESS,
    EDIT_PROPERTY_SUCCESS,
    FETCH_PROPERTIES_SUCCESS,
    HIDE_LOADING, SHOW_LOADING, SHOW_ERROR, SHOW_SUCCESS,
    SELECTED_PROPERTY_OFFICE_SET
} from "./actiontypes";

import mainURI from "../../constants/apiEndpoint";

/**
 * Adds a new property via API.
 * @param {string} apiEndPoint - The API endpoint to send the request to.
 * @param {Object} property - The property object to add.
 * @returns {function(Function): Promise<void>} Thunk function for Redux dispatch.
 * Chose string for apiEndPoint as it is used as a URL, and Object for property as it is serialized to JSON.
 */
export const addProperty = (apiEndPoint, property) => {
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
                body: JSON.stringify(property),
            });

            if (response.ok) {
                const createdProperty = await response.json();
                dispatch({ type: ADD_PROPERTY_SUCCESS, payload: createdProperty })
                dispatch({ type: SHOW_SUCCESS, payload: "Vuokratilan tallennus onnistui!" })
            }
        } catch (err) {
            dispatch({ type: SHOW_ERROR, payload: "Vuokratilan tallennus epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Deletes a property via API.
 * @param {{id: number, [key: string]: any}} property - The property object to delete, must have an id.
 * @returns {function(Function): Promise<void>} Thunk function for Redux dispatch.
 * Chose object with id:number as id is used in the URL.
 */
export const deleteProperty = (property) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            await fetch(`${mainURI}/property/delete/${property.id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            dispatch({ type: DELETE_PROPERTY_SUCCESS, payload: property });
            dispatch({ type: SHOW_SUCCESS, payload: "Vuokratilan poisto onnistui!" })
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Vuokratilan poisto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Edits an existing property via API.
 * @param {Object} property - The property object to edit.
 * @returns {function(Function): Promise<void>} Thunk function for Redux dispatch.
 * Chose Object for property as it is serialized to JSON.
 */
export const editProperty = (property) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/property/update`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(property)
            });

            if (response.ok) {
                const editedProperty = await response.json();
                dispatch({ type: EDIT_PROPERTY_SUCCESS, payload: editedProperty })
                dispatch({ type: SHOW_SUCCESS, payload: "Vuokratilan päivitys onnistui!" })
            }
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Vuokratilan päivitys epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Fetches properties for a given office or all properties.
 * @param {number|null|undefined} officeId - The office ID to filter properties, or null/undefined for all.
 * @returns {function(Function): Promise<void>} Thunk function for Redux dispatch.
 * Chose number|null|undefined for officeId as it is checked for null and compared as a number.
 */
export const fetchProperties = (officeId) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const uri = (officeId != null && officeId > 0)
                ? `${mainURI}/property/by-office?id=${officeId}`
                : `${mainURI}/property/all`;
            const response = await fetch(uri, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            dispatch({ type: FETCH_PROPERTIES_SUCCESS, payload: data });
        } catch (error) {
            console.log("Error:", error)
            dispatch({ type: SHOW_ERROR, payload: "Vuokratilojen nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Sets the selected office for property.
 * @param {Object} office - The office object to set as selected.
 * @returns {function(Function): Promise<void>} Thunk function for Redux dispatch.
 * Chose Object for office as it is passed as payload.
 */
export const setPropertyOffice = (office) => {
    return async (dispatch) => {
        dispatch({ type: SELECTED_PROPERTY_OFFICE_SET, payload: office })
    }
}