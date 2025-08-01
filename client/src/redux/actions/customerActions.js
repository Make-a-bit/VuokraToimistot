import {
    ADD_CUSTOMER_SUCCESS,
    DELETE_CUSTOMER_SUCCESS,
    EDIT_CUSTOMER_SUCCESS,
    FETCH_CUSTOMERS_SUCCESS,
    HIDE_LOADING, SHOW_ERROR, SHOW_LOADING, SHOW_SUCCESS
} from "./actiontypes"

const mainURI = "https://localhost:7017";

export const addCustomer = (apiEndPoint, customer) => {
    console.log("Customer:", customer)
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
                console.log("Customer created:", createdCustomer)
                dispatch({ type: ADD_CUSTOMER_SUCCESS, payload: createdCustomer })
                dispatch({ type: SHOW_SUCCESS, payload: "Asiakkaan tallennus onnistui!" })
            } else {
                throw new Error("API error")
            }
        } catch (err) {
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
            console.log("Error while deleting customer:", error)
            dispatch({ type: SHOW_ERROR, payload: "Asiakkaan poistaminen epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

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
                console.log("Customer edited:", editedCustomer)
                dispatch({ type: EDIT_CUSTOMER_SUCCESS, payload: editedCustomer })
                dispatch({ type: SHOW_SUCCESS, payload: "Asiakkaan päivitys onnistui!" })
            }
        }
        catch (error) {
            console.log("Error while saving edited customer data:", error)
            dispatch({ type: SHOW_ERROR, payload: "Asiakkaan päivitys epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }
}

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
            console.log("Error while fetching customers:", error)
            dispatch({ type: SHOW_ERROR, payload: "Asiakkaiden nouto epäonnistui!" })
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    };
}
