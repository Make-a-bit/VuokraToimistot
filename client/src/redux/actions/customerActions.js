import {
    ADD_CUSTOMER, ADD_CUSTOMER_FAILURE, ADD_CUSTOMER_SUCCESS,
    DELETE_CUSTOMER, DELETE_CUSTOMER_FAILURE, DELETE_CUSTOMER_SUCCESS,
    EDIT_CUSTOMER, EDIT_CUSTOMER_FAILURE, EDIT_CUSTOMER_SUCCESS,
    FETCH_CUSTOMERS, FETCH_CUSTOMERS_FAILURE, FETCH_CUSTOMERS_SUCCESS,
    HIDE_LOADING, SHOW_ERROR, SHOW_LOADING, SHOW_SUCCESS
} from "./actiontypes"

const mainURI = "https://localhost:7017";

export const addCustomer = (apiEndPoint, customer) => {
    console.log("Customer:", customer)
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
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
                dispatch({ type: SHOW_SUCCESS, payload: "Asiakkaan tallennus onnistui!" })
            } else {
                throw new Error("API error")
            }
        } catch (err) {
            dispatch({ type: ADD_CUSTOMER_FAILURE })
            dispatch({ type: SHOW_ERROR, payload: "Asiakkaan tallennus epäonnistui!" })
            console.log("Error while adding a new customer:", err)
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const deleteCustomer = (customer) => {
    console.log("Customer to del:", customer);
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
        dispatch({ type: DELETE_CUSTOMER });
        try {
            await fetch(`${mainURI}/customer/delete/${customer.id}`, {
                method: "DELETE"
            });
            dispatch({ type: DELETE_CUSTOMER_SUCCESS, payload: customer });
            dispatch({ type: SHOW_SUCCESS, payload: "Asiakkaan poistaminen onnistui!" })
        } catch (error) {
            console.log("Error while deleting customer:", error)
            dispatch({ type: DELETE_CUSTOMER_FAILURE })
            dispatch({ type: SHOW_ERROR, payload: "Asiakkaan poistaminen epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const editCustomer = (customer) => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
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
                dispatch({ type: SHOW_SUCCESS, payload: "Asiakkaan päivitys onnistui!" })
            }
        }
        catch (error) {
            console.log("Error while saving edited customer data:", error)
            dispatch({ type: EDIT_CUSTOMER_FAILURE })
            dispatch({ type: SHOW_ERROR, payload: "Asiakkaan päivitys epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

export const fetchCustomers = () => {
    return async (dispatch) => {
        dispatch({ type: SHOW_LOADING })
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
            dispatch({ type: SHOW_ERROR, payload: "Asiakkaiden nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    };
}
