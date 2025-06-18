import {
    ADD_OFFICE, ADD_OFFICE_FAILURE, ADD_OFFICE_SUCCESS,
    DELETE_OFFICE, DELETE_OFFICE_FAILURE, DELETE_OFFICE_SUCCESS,
    EDIT_OFFICE, EDIT_OFFICE_FAILURE, EDIT_OFFICE_SUCCESS,
    FETCH_OFFICES, FETCH_OFFICES_FAILURE, FETCH_OFFICES_SUCCESS,
    HIDE_LOADING, SHOW_LOADING, SHOW_ERROR, SHOW_SUCCESS,
    SELECTED_OFFICE_SET
} from "./actiontypes"

const mainURI = "https://localhost:7017";

export const addOffice = (apiEndPoint, office) => {
    console.log("Office:", office);
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        dispatch({ type: ADD_OFFICE })
        try {
            const response = await fetch(apiEndPoint, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(office),
            });

            if (response.ok) {
                const createdOffice = await response.json();
                console.log("Office created:", createdOffice)
                dispatch({ type: ADD_OFFICE_SUCCESS, payload: createdOffice })
                dispatch({ type: SHOW_SUCCESS, payload: "Kohteen tallennus onnistui!" })
            } else {
                throw new Error("API error")
            }
        } catch (err) {
            dispatch({ type: ADD_OFFICE_FAILURE })
            dispatch({ type: SHOW_ERROR, payload: "Kohteen tallennus epäonnistui!" })
            console.log("Error while adding a new office:", err)
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const deleteOffice = (office) => {
    console.log("Office to del:", office);
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        dispatch({ type: DELETE_OFFICE })
        try {
            await fetch(`${mainURI}/office/delete/${office.id}`, {
                method: "DELETE"
            });
            dispatch({ type: DELETE_OFFICE_SUCCESS, payload: office });
            dispatch({ type: SHOW_SUCCESS, payload: "Kohteen poistaminen onnistui!" })
        } catch (error) {
            console.log("Error while deleting office:", error)
            dispatch({ type: DELETE_OFFICE_FAILURE })
            dispatch({ type: SHOW_ERROR, payload: "Kohteen poistaminen epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const editOffice = (office) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        dispatch({ type: EDIT_OFFICE })
        try {
            const response = await fetch(`${mainURI}/office/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(office),
            });

            if (response.ok) {
                const editedOffice = await response.json();
                console.log("Office edited:", editedOffice)
                dispatch({ type: EDIT_OFFICE_SUCCESS, payload: editedOffice })
                dispatch({ type: SHOW_SUCCESS, payload: "Kohteen päivitys onnistui!" })
            }
        } catch (error) {
            console.log("Error while saving edited office data:", error)
            dispatch({ type: EDIT_OFFICE_FAILURE })
            dispatch({ type: SHOW_ERROR, payload: "Kohteen päivitys epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const fetchOffices = () => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        dispatch({ type: FETCH_OFFICES });
        try {
            const response = await fetch(`${mainURI}/office`, {
                method: "GET",
                headers: { "Content-type": "application/json" },
            });
            const data = await response.json();
            dispatch({ type: FETCH_OFFICES_SUCCESS, payload: data });
        } catch (error) {
            console.log("Error while fetching offices:", error)
            dispatch({ type: FETCH_OFFICES_FAILURE })
            dispatch({ type: SHOW_ERROR, payload: "Kohteiden nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const setOffice = (office) => {
    return async (dispatch) => {
        dispatch({ type: SELECTED_OFFICE_SET, payload: office })
    }
}