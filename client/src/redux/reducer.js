import {
    ADD_CUSTOMER, ADD_CUSTOMER_FAILURE, ADD_CUSTOMER_SUCCESS,
    ADD_OFFICE, ADD_OFFICE_FAILURE, ADD_OFFICE_SUCCESS,
    ADD_PROPERTY, ADD_PROPERTY_FAILURE, ADD_PROPERTY_SUCCESS,
    CLEAR_ERROR, CLEAR_SUCCESS,
    DELETE_CUSTOMER, DELETE_CUSTOMER_FAILURE, DELETE_CUSTOMER_SUCCESS,
    DELETE_OFFICE, DELETE_OFFICE_FAILURE, DELETE_OFFICE_SUCCESS,
    DELETE_OFFICE_PROPERTY, DELETE_OFFICE_PROPERTY_FAILURE, DELETE_OFFICE_PROPERTY_SUCCESS,
    EDIT_CUSTOMER, EDIT_CUSTOMER_FAILURE, EDIT_CUSTOMER_SUCCESS,
    EDIT_OFFICE, EDIT_OFFICE_FAILURE, EDIT_OFFICE_SUCCESS,
    EDIT_OFFICE_PROPERTY, EDIT_OFFICE_PROPERTY_FAILURE, EDIT_OFFICE_PROPERTY_SUCCESS,
    FETCH_CUSTOMERS, FETCH_CUSTOMERS_FAILURE, FETCH_CUSTOMERS_SUCCESS,
    FETCH_OFFICES, FETCH_OFFICES_FAILURE, FETCH_OFFICES_SUCCESS,
    FETCH_OFFICE_PROPERTIES, FETCH_OFFICE_PROPERTIES_FAILURE, FETCH_OFFICE_PROPERTIES_SUCCESS,
    SELECTED_OFFICE_CLEAR, SELECTED_OFFICE_SET
} from "./actions";


const initialState = {
    customers: [],
    offices: [],
    properties: [],
    selectedOffice: null,
    loadingState: false,
    errorMessage: null,
    successMessage: null,
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_CUSTOMER:
            return { ...state, loadingState: true };

        case ADD_CUSTOMER_FAILURE:
            return {
                ...state,
                errorMessage: "Asiakkaan lisäys ei onnistunut!",
                loadingState: false
            }

        case ADD_CUSTOMER_SUCCESS:
            return {
                ...state,
                customers: [...state.customers, action.payload],
                loadingState: false,
                successMessage: "Asiakkaan lisäys onnistui!"
            }

        case ADD_OFFICE:
            return { ...state, loadingState: true };

        case ADD_OFFICE_FAILURE:
            return {
                ...state,
                errorMessage: "Toimiston lisäys ei onnistunut!",
                loadingState: false,
            }

        case ADD_OFFICE_SUCCESS:
            return {
                ...state,
                offices: [...state.offices, action.payload],
                loadingState: false,
                successMessage: "Toimiston lisäys onnistui!"
            }

        case ADD_PROPERTY:
            return { ...state, loadingState: true };

        case ADD_PROPERTY_FAILURE:
            return {
                ...state,
                errorMessage: "Vuokrakohteen lisäys ei onnistunut!",
                loadingState: false,
            }

        case ADD_PROPERTY_SUCCESS:
            return {
                ...state,
                properties: [...state.properties, action.payload],
                loadingState: false,
                successMessage: "Vuokrakohteen lisäys onnistui!"
            }

        case CLEAR_ERROR:
            return { ...state, errorMessage: null };

        case CLEAR_SUCCESS:
            return { ...state, successMessage: null };

        case DELETE_CUSTOMER:
            return { ...state, loadingState: true };

        case DELETE_CUSTOMER_FAILURE:
            return {
                ...state,
                errorMessage: "Asiakkaan poistaminen ei onnistunut!",
                loadingState: false,
            }

        case DELETE_CUSTOMER_SUCCESS:
            return {
                ...state,
                customers: state.customers.filter((a) => a.id !== action.payload.id),
                loadingState: false,
                successMessage: "Asiakkaan poistaminen onnistui!"
            };

        case DELETE_OFFICE:
            return { ...state, loadingState: true };

        case DELETE_OFFICE_FAILURE:
            return {
                ...state,
                errorMessage: "Toimiston poistaminen ei onnistunut!",
                loadingState: false
            };

        case DELETE_OFFICE_SUCCESS:
            return {
                ...state,
                offices: state.offices.filter((a) => a.id !== action.payload.id),
                loadingState: false,
                successMessage: "Toimiston poistaminen onnistui!"
            }

        case DELETE_OFFICE_PROPERTY:
            return { ...state, loadingState: true };

        case DELETE_OFFICE_PROPERTY_FAILURE:
            return {
                ...state,
                errorMessage: "Vuokrakohteen poistaminen ei onnistunut!",
                loadingState: false
            }

        case DELETE_OFFICE_PROPERTY_SUCCESS:
            return {
                ...state,
                properties: state.properties.filter((a) => a.id !== action.payload.id),
                loadingState: false,
                successMessage: "Vuokrakohteen poistaminen onnistui!"
            }

        case EDIT_CUSTOMER:
            return { ...state, loadingState: true };

        case EDIT_CUSTOMER_FAILURE:
            return {
                ...state,
                errorMessage: "Asiakastietojen päivitys ei onnistunut!",
                loadingState: false
            }

        case EDIT_CUSTOMER_SUCCESS:
            return {
                ...state,
                customers: state.customers.map(c =>
                    c.id === action.payload.id ? action.payload : c
                ),
                loadingState: false,
                successMessage: "Asiakastietojen päivitys onnistui!"
            }

        case EDIT_OFFICE:
            return { ...state, loadingState: true }

        case EDIT_OFFICE_FAILURE:
            return {
                ...state,
                errorMessage: "Toimiston päivitys ei onnistunut!",
                loadingState: false
            }

        case EDIT_OFFICE_SUCCESS:
            return {
                ...state,
                offices: state.offices.map(o => 
                    o.id === action.payload.id ? action.payload : o
                ),
                loadingState: false,
                successMessage: "Toimiston tietojen päivitys onnistui!"
            }

        case EDIT_OFFICE_PROPERTY:
            return { ...state, loadingState: true }

        case EDIT_OFFICE_PROPERTY_FAILURE:
            return {
                ...state,
                errorMessage: "Vuokrakohteen päivitys ei onnistunut!",
                loadingState: false
            }

        case EDIT_OFFICE_PROPERTY_SUCCESS:
            return {
                ...state,
                properties: state.properties.map(p =>
                    p.id === action.payload.id ? action.payload : p
                ),
                loadingState: false,
                successMessage: "Vuokrakohteen tietojen päivitys onnistui!"
            }
                

        case FETCH_CUSTOMERS:
            return { ...state, loadingState: true };

        case FETCH_CUSTOMERS_FAILURE:
            return {
                ...state,
                errorMessage: "Asiakkaiden nouto ei onnistunut!",
                loadingState: false
            };

        case FETCH_CUSTOMERS_SUCCESS:
            return {
                ...state,
                customers: action.payload,
                loadingState: false
            };

        case FETCH_OFFICES:
            return { ...state, loadingState: true };

        case FETCH_OFFICES_FAILURE:
            return {
                ...state,
                errorMessage: "Toimistojen nouto ei onnistunut!",
                loadingState: false
            };

        case FETCH_OFFICES_SUCCESS:
            return {
                ...state,
                loadingState: false,
                offices: action.payload
            };

        case FETCH_OFFICE_PROPERTIES:
            return { ...state, loadingState: true };

        case FETCH_OFFICE_PROPERTIES_FAILURE:
            return {
                ...state,
                errorMessage: "Vuokrakohteiden nouto ei onnistunut!",
                loadingState: false
            }

        case FETCH_OFFICE_PROPERTIES_SUCCESS:
            return {
                ...state,
                loadingState: false,
                properties: action.payload
            }

        case SELECTED_OFFICE_SET:
            return {
                ...state,
                selectedOffice: action.payload
            }

        default:
            return state;
    }
}

export { rootReducer }
