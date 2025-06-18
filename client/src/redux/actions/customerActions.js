import {
    ADD_CUSTOMER, ADD_CUSTOMER_FAILURE, ADD_CUSTOMER_SUCCESS,
    DELETE_CUSTOMER, DELETE_CUSTOMER_FAILURE, DELETE_CUSTOMER_SUCCESS,
    EDIT_CUSTOMER, EDIT_CUSTOMER_FAILURE, EDIT_CUSTOMER_SUCCESS,
    FETCH_CUSTOMERS, FETCH_CUSTOMERS_FAILURE, FETCH_CUSTOMERS_SUCCESS,
    HIDE_LOADING, SHOW_LOADING, SHOW_ERROR, SHOW_SUCCESS
} from "./actiontypes"

import { hideLoading, showLoading, showError, showSuccess } from "./uiActions"

const mainURI = "https://localhost:7017";

export function addCustomer(apiEndPoint, customer) {
    console.log("Customer:", customer)
    return async (dispatch) => {
        dispatch(showLoading())
        dispatch({ type: ADD_CUSTOMER })
        try {
            const response = await fetch(apiEndPoint, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(customer),
            });

            if (response.ok) {
                const createdCustomer = await response.json();
                console.log("Customer created:", createdCustomer)
                dispatch({ type: ADD_CUSTOMER_SUCCESS, payload: createdCustomer })
                dispatch(showSuccess("Asiakkaan lisäys onnistui!"))
            } else {
                throw new Error("API error")
            }
        } catch (err) {
            dispatch({ type: ADD_CUSTOMER_FAILURE })
            dispatch(showError("Asiakkaan tallennus epäonnistui!"))
            console.log("Error while adding a new customer:", err)
        } finally {
            dispatch(hideLoading())
        }
    }
}

export function deleteCustomer(customer) {
    console.log("Customer to del:", customer);
    return async (dispatch) => {
        dispatch({ type: DELETE_CUSTOMER });
        try {
            await fetch(`${mainURI}/customer/delete/${customer.id}`, {
                method: "DELETE"
            });
            dispatch({ type: DELETE_CUSTOMER_SUCCESS, payload: customer });
        } catch (error) {
            console.log("Error while deleting customer:", error)
            dispatch({ type: DELETE_CUSTOMER_FAILURE })
        }
    }
}

export function editCustomer(customer) {
    return async (dispatch) => {
        dispatch({ type: EDIT_CUSTOMER })
        try {
            const response = await fetch(`${mainURI}/customer/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customer),
            });

            if (response.ok) {
                const editedCustomer = await response.json();
                console.log("Customer edited:", editedCustomer)
                dispatch({ type: EDIT_CUSTOMER_SUCCESS, payload: editedCustomer })
            }
        }
        catch (error) {
            console.log("Error while saving edited customer data:", error)
            dispatch({ type: EDIT_CUSTOMER_FAILURE })
        }
    }
}

export function fetchCustomers() {
    return async (dispatch) => {
        dispatch({ type: FETCH_CUSTOMERS });
        try {
            const response = await fetch(`${mainURI}/customer`, {
                method: "GET",
                headers: { "Content-type": "application/json" },
            });
            const data = await response.json();
            dispatch({ type: FETCH_CUSTOMERS_SUCCESS, payload: data });
        } catch (error) {
            console.log("Error while fetching customers:", error)
            dispatch({ type: FETCH_CUSTOMERS_FAILURE });
        }
    };
}
