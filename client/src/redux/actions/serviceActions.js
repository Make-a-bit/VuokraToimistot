import {
    ADD_OFFICE_SERVICE_SUCCESS,
    DELETE_OFFICE_SERVICE_SUCCESS,
    EDIT_OFFICE_SERVICE_SUCCESS,
    FETCH_OFFICE_SERVICES_SUCCESS,
    HIDE_LOADING, SHOW_LOADING, SHOW_ERROR, SHOW_SUCCESS,
    SELECTED_SERVICE_OFFICE_SET
} from "./actiontypes"

const mainURI = "https://localhost:7017";

export const addOfficeService = (apiEndPoint, service) => {
    console.log("Service:", service);
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(apiEndPoint, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(service),

            });

            if (response.ok) {
                const createdService = await response.json();
                console.log("Created service:", createdService);
                dispatch({ type: ADD_OFFICE_SERVICE_SUCCESS, payload: createdService })
                dispatch({ type: SHOW_SUCCESS, payload: "Palvelun tallennus onnistui" })
            } else {
                throw new Error("API error")
            }
        } catch (err) {
            dispatch({ type: SHOW_ERROR, payload: "Palvelun tallennus epäonnistui!" })
            console.log("Error while adding a new service:", err)
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const deleteService = (service) => {
    console.log("Service to del:", service)
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            await fetch(`${mainURI}/service/delete/${service.id}`, {
                method: "DELETE"
            });
            dispatch({ type: DELETE_OFFICE_SERVICE_SUCCESS, payload: service })
            dispatch({ type: SHOW_SUCCESS, payload: "Palvelun poisto onnistui!" })
        } catch (error) {
            console.log("Error while deleting service:", error);
            dispatch({ type: SHOW_ERROR, payload: "Palvelun poisto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const editService = (service) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(`${mainURI}/service/update`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(service)
            });

            if (response.ok) {
                const editedService = await response.json();
                console.log("Service edited:", editedService)
                dispatch({ type: EDIT_OFFICE_SERVICE_SUCCESS, payload: editedService })
                dispatch({ type: SHOW_SUCCESS, payload: "Palvelun päivitys onnistui!" })
            }
        } catch (error) {
            console.log("Error while saving edited service data:", error)
            dispatch({ type: SHOW_ERROR, payload: "Palvelun päivitys epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const fetchServices = (officeId) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const uri = (officeId != null && officeId > 0)
                ? `${mainURI}/service/by-office?id=${officeId}`
                : `${mainURI}/service/all`;
            const response = await fetch(uri, { method: "GET" });

            const data = await response.json();
            dispatch({ type: FETCH_OFFICE_SERVICES_SUCCESS, payload: data })
        } catch (error) {
            console.log("Error while fetching office services:", error);
            dispatch({ type: SHOW_ERROR, payload: "Palvelujen nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const setOffice = (office) => {
    return async (dispatch) => {
        dispatch({ type: SELECTED_SERVICE_OFFICE_SET, payload: office })
    }
}