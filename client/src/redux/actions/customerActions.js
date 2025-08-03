import {
    ADD_CUSTOMER_SUCCESS,
    DELETE_CUSTOMER_SUCCESS,
    EDIT_CUSTOMER_SUCCESS,
    FETCH_CUSTOMERS_SUCCESS,
    HIDE_LOADING, SHOW_ERROR, SHOW_LOADING, SHOW_SUCCESS
} from "./actiontypes"

import mainURI from "../../constants/apiEndpoint";

/**
 * Adds a new customer via API call.
 * @param {string} apiEndPoint - The API endpoint URL to send the request to.
 * @param {Object} customer - The customer object to add.
 * @returns {function(Function): Promise<void>} - Redux thunk action.
 */
export const addCustomer = (apiEndPoint, customer) => {
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
                body: JSON.stringify(customer),
            });

            if (response.ok) {
                const createdCustomer = await response.json();
                dispatch({ type: ADD_CUSTOMER_SUCCESS, payload: createdCustomer })
                dispatch({ type: SHOW_SUCCESS, payload: "Asiakkaan tallennus onnistui!" })
            } else {
                throw new Error("API error")
            }
        } catch (err) {
            dispatch({ type: SHOW_ERROR, payload: "Asiakkaan tallennus epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Deletes a customer via API call.
 * @param {{id: number|string, [key: string]: any}} customer - The customer object to delete, must have an id.
 * @returns {function(Function): Promise<void>} - Redux thunk action.
 */
export const deleteCustomer = (customer) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            await fetch(`${mainURI}/customer/delete/${customer.id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            dispatch({ type: DELETE_CUSTOMER_SUCCESS, payload: customer });
            dispatch({ type: SHOW_SUCCESS, payload: "Asiakkaan poistaminen onnistui!" })
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Asiakkaan poistaminen epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Edits an existing customer via API call.
 * @param {Object} customer - The customer object to edit.
 * @returns {function(Function): Promise<void>} - Redux thunk action.
 */
export const editCustomer = (customer) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/customer/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(customer),
            });

            if (response.ok) {
                const editedCustomer = await response.json();
                dispatch({ type: EDIT_CUSTOMER_SUCCESS, payload: editedCustomer })
                dispatch({ type: SHOW_SUCCESS, payload: "Asiakkaan päivitys onnistui!" })
            }
        }
        catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Asiakkaan päivitys epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

/**
 * Fetches all customers via API call.
 * @returns {function(Function): Promise<void>} - Redux thunk action.
 */
export const fetchCustomers = () => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${mainURI}/customer`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            dispatch({ type: FETCH_CUSTOMERS_SUCCESS, payload: data });
        } catch (error) {
            dispatch({ type: SHOW_ERROR, payload: "Asiakkaiden nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    };
}
