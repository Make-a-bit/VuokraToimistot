// ACTION TYPES
export const ADD_CUSTOMER = "ADD_CUSTOMER";
export const ADD_CUSTOMER_FAILURE = "ADD_CUSTOMER_FAILURE";
export const ADD_CUSTOMER_SUCCESS = "ADD_CUSTOMER_SUCCESS";
export const ADD_OFFICE = "ADD_OFFICE";
export const ADD_OFFICE_FAILURE = "ADD_OFFICE_FAILURE";
export const ADD_OFFICE_SUCCESS = "ADD_OFFICE_SUCCESS";
export const ADD_PROPERTY = "ADD_PROPERTY";
export const ADD_PROPERTY_FAILURE = "ADD_PROPERTY_FAILURE"
export const ADD_PROPERTY_SUCCESS = "ADD_PROPERTY_SUCCESS";
export const CLEAR_ERROR = "CLEAR_ERROR";
export const CLEAR_SUCCESS = "CLEAR_SUCCESS";
export const DELETE_CUSTOMER = "DELETE_CUSTOMER";
export const DELETE_CUSTOMER_FAILURE = "DELETE_CUSTOMER_FAILURE";
export const DELETE_CUSTOMER_SUCCESS = "DELETE_CUSTOMER_SUCCESS";
export const DELETE_OFFICE = "DELETE_OFFICE";
export const DELETE_OFFICE_FAILURE = "DELETE_OFFICE_FAILURE";
export const DELETE_OFFICE_SUCCESS = "DELETE_OFFICE_SUCCESS";
export const DELETE_OFFICE_PROPERTY = "DELETE_OFFICE_PROPERTY";
export const DELETE_OFFICE_PROPERTY_FAILURE = "DELETE_OFFICE_PROPERTY_FAILURE";
export const DELETE_OFFICE_PROPERTY_SUCCESS = "DELETE_OFFICE_PROPERTY_SUCCESS";
export const EDIT_CUSTOMER = "EDIT_CUSTOMER";
export const EDIT_CUSTOMER_FAILURE = "EDIT_CUSTOMER_FAILURE";
export const EDIT_CUSTOMER_SUCCESS = "EDIT_CUSTOMER_SUCCESS";
export const EDIT_OFFICE = "EDIT_OFFICE";
export const EDIT_OFFICE_FAILURE = "EDIT_OFFICE_FAILURE";
export const EDIT_OFFICE_SUCCESS = "EDIT_OFFICE_SUCCESS";
export const EDIT_OFFICE_PROPERTY = "EDIT_OFFICE_PROPERTY";
export const EDIT_OFFICE_PROPERTY_FAILURE = "EDIT_OFFICE_PROPERTY_FAILURE";
export const EDIT_OFFICE_PROPERTY_SUCCESS = "EDIT_OFFICE_PROPERTY_SUCCESS";
export const FETCH_CUSTOMERS = "FETCH_CUSTOMERS"
export const FETCH_CUSTOMERS_SUCCESS = "FETCH_CUSTOMERS_SUCCESS";
export const FETCH_CUSTOMERS_FAILURE = "FETCH_CUSTOMERS_FAILURE";
export const FETCH_OFFICES = "FETCH_OFFICES";
export const FETCH_OFFICES_FAILURE = "FETCH_OFFICES_FAILURE";
export const FETCH_OFFICES_SUCCESS = "FETCH_OFFICES_SUCCESS";
export const FETCH_OFFICE_PROPERTIES = "FETCH_OFFICE_PROPERTIES"
export const FETCH_OFFICE_PROPERTIES_FAILURE = "FETCH_OFFICE_PROPERTIES_FAILURE";
export const FETCH_OFFICE_PROPERTIES_SUCCESS = "FETCH_OFFICE_PROPERTIES_SUCCESS";
export const SELECTED_OFFICE_SET = "SELECTED_OFFICE_SET";

const mainURI = "https://localhost:7017";


// ACTION CREATORS
export function addCustomer(apiEndPoint, customer) {
    console.log("Customer:", customer)
    return async (dispatch) => {
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
            } else {
                throw new Error("API error")
            }
        } catch (err) {
            dispatch({ type: ADD_CUSTOMER_FAILURE })
            console.log("Error while adding a new customer:", err)
        }
    }
}

export function addOffice(apiEndPoint, office) {
    console.log("Office:", office);
    return async (dispatch) => {
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
            } else {
                throw new Error("API error")
            }
        } catch (err) {
            dispatch({ type: ADD_OFFICE_FAILURE })
            console.log("Error while adding a new office:", err)
        }
    }
}

export function addProperty(apiEndPoint, property) {
    console.log("Property:", property);
    return async (dispatch) => {
        dispatch({ type: ADD_PROPERTY })
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
            } else {
                throw new Error("API error")
            }
        } catch (err) {
            dispatch({ type: ADD_PROPERTY_FAILURE })
            console.log("Error while adding a new property:", err)
        }
    }
}

export function clearError() {
    return { type: CLEAR_ERROR };
}

export function clearSuccess() {
    return { type: CLEAR_SUCCESS };
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

export function deleteOffice(office) {
    console.log("Office to del:", office);
    return async (dispatch) => {
        dispatch({ type: DELETE_OFFICE })
        try {
            await fetch(`${mainURI}/office/delete/${office.id}`, {
                method: "DELETE"
            });
            dispatch({ type: DELETE_OFFICE_SUCCESS, payload: office });
        } catch (error) {
            console.log("Error while deleting office:", error)
            dispatch({ type: DELETE_OFFICE_FAILURE })
        }
    }
}

export function deleteOfficeProperty(property) {
    console.log("Property to del:", property)
    return async (dispatch) => {
        dispatch({ type: DELETE_OFFICE_PROPERTY })
        try {
            await fetch(`${mainURI}/property/delete/${property.id}`, {
                method: "DELETE"
            });
            dispatch({ type: DELETE_OFFICE_PROPERTY_SUCCESS, payload: property });
        } catch (error) {
            console.log("Error while deleting property:", error)
            dispatch({ type: DELETE_OFFICE_PROPERTY_FAILURE })
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

export function editOffice(office) {
    return async (dispatch) => {
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
            }
        } catch (error) {
            console.log("Error while saving edited office data:", error)
            dispatch({ type: EDIT_OFFICE_FAILURE })
        }
    }
}

export function editOfficeProperty(property) {
    return async (dispatch) => {
        dispatch({ type: EDIT_OFFICE_PROPERTY })
        try {
            const response = await fetch(`${mainURI}/property/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(property)
            });

            if (response.ok) {
                const editedProperty = await response.json();
                console.log("Property edited:", editedProperty)
                dispatch({ type: EDIT_OFFICE_PROPERTY_SUCCESS, payload: editedProperty })
            }
        } catch (error) {
            console.log("Error while saving edited property data:", error)
            dispatch({ type: EDIT_OFFICE_PROPERTY_FAILURE })
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

export function fetchOffices() {
    return async (dispatch) => {
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
        }
    }
}

export function fetchOfficeProperties(id) {
    return async (dispatch) => {
        dispatch({ type: FETCH_OFFICE_PROPERTIES });
        try {
            const response = await fetch(`${mainURI}/property/${id}`, {
                method: "GET",
                headers: { "Content-type": "application/json" },
            });
            const data = await response.json();
            dispatch({ type: FETCH_OFFICE_PROPERTIES_SUCCESS, payload: data });
        } catch (error) {
            console.log("Error while fetching office properties:", error)
            dispatch({ type: FETCH_OFFICE_PROPERTIES_FAILURE })
        }
    }
}

export function setOffice(office) {
    return async (dispatch) => {
        dispatch({ type: SELECTED_OFFICE_SET, payload: office })
    }
}