import {
    ADD_PROPERTY_SUCCESS,
    DELETE_PROPERTY_SUCCESS,
    EDIT_PROPERTY_SUCCESS,
    FETCH_PROPERTIES_SUCCESS,
    HIDE_LOADING, SHOW_LOADING, SHOW_ERROR, SHOW_SUCCESS,
    SELECTED_PROPERTY_OFFICE_SET
} from "./actiontypes";

const mainURI = "https://localhost:7017";

export const addProperty = (apiEndPoint, property) => {
    console.log("Property:", property);
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(apiEndPoint, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(property),
            });

            if (response.ok) {
                const createdProperty = await response.json();
                console.log("Created property:", createdProperty)
                dispatch({ type: ADD_PROPERTY_SUCCESS, payload: createdProperty })
                dispatch({ type: SHOW_SUCCESS, payload: "Vuokratilan tallennus onnistui!" })
            } 
        } catch (err) {
            dispatch({ type: SHOW_ERROR, payload: "Vuokratilan tallennus epäonnistui!" })
            console.log("Error while adding a new property:", err)
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const deleteProperty = (property) => {
    console.log("Property to del:", property)
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            await fetch(`${mainURI}/property/delete/${property.id}`, {
                method: "DELETE"
            });
            dispatch({ type: DELETE_PROPERTY_SUCCESS, payload: property });
            dispatch({ type: SHOW_SUCCESS, payload: "Vuokratilan poisto onnistui!" })
        } catch (error) {
            console.log("Error while deleting property:", error)
            dispatch({ type: SHOW_ERROR, payload: "Vuokratilan poisto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const editProperty = (property) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(`${mainURI}/property/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(property)
            });

            if (response.ok) {
                const editedProperty = await response.json();
                console.log("Property edited:", editedProperty)
                dispatch({ type: EDIT_PROPERTY_SUCCESS, payload: editedProperty })
                dispatch({ type: SHOW_SUCCESS, payload: "Vuokratilan päivitys onnistui!" })
            }
        } catch (error) {
            console.log("Error while saving edited property data:", error)
            dispatch({ type: SHOW_ERROR, payload: "Vuokratilan päivitys epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const fetchProperties = (officeId) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        try {
            const response = await fetch(`${mainURI}/property/?id=${officeId}`, {
                method: "GET",
            });
            const data = await response.json();
            dispatch({ type: FETCH_PROPERTIES_SUCCESS, payload: data });
        } catch (error) {
            console.log("Error while fetching office properties:", error)
            dispatch({ type: SHOW_ERROR, payload: "Vuokratilojen nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const setPropertyOffice = (office) => {
    return async (dispatch) => {
        dispatch({ type: SELECTED_PROPERTY_OFFICE_SET, payload: office })
    }
}