import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Snackbar } from "@mui/material";
import { fetchCustomers } from "../redux/actions/customerActions";
import { fetchDevices } from "../redux/actions/deviceActions";
import { fetchInvoices } from "../redux/actions/invoiceActions";
import { fetchOffices } from "../redux/actions/officeActions";
import { fetchProperties } from "../redux/actions/propertyActions";
import { fetchReservations } from "../redux/actions/reservationActions";
import { fetchServices } from "../redux/actions/serviceActions";
import { fetchTaxes } from "../redux/actions/taxActions";

import useAutoClearMessages from "../hooks/autoClearMessages";

/**
 * Home component for the main page.
 * @function
 * @returns {JSX.Element} The rendered Home component.
 */
const Home = () => {
    /**
     * Redux dispatch function.
     * @type {function}
     */
    const dispatch = useDispatch();

    /**
     * Extracts errorMessage and successMessage from the Redux UI state.
     * @type {{ errorMessage: string | null, successMessage: string | null }}
     * Reasoning: Based on usage, these are either strings or null.
     */
    const { errorMessage, successMessage } = useSelector(
        /**
         * @param {object} state - The Redux state object.
         * @returns {{ errorMessage: string | null, successMessage: string | null }}
         */
        state => state.ui
    );

    /**
     * Custom hook to auto-clear messages.
     * @param {string | null} errorMessage
     * @param {string | null} successMessage
     * Reasoning: Both arguments are string or null, as per state shape.
     */
    useAutoClearMessages(errorMessage, successMessage);

    useEffect(() => {
        dispatch(fetchCustomers());
        dispatch(fetchDevices());
        dispatch(fetchInvoices());
        dispatch(fetchOffices());
        dispatch(fetchProperties());
        dispatch(fetchReservations());
        dispatch(fetchServices());
        dispatch(fetchTaxes());
    }, [dispatch]);

    return (
        <>
            <p>This is homepage</p>
            {errorMessage &&
                <Snackbar
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    open={Boolean(errorMessage)}
                    autoHideDuration={3000}
                >
                    <Alert
                        color="error"
                        severity="error"
                        variant="filled"
                        sx={{ border: "1px solid #000", width: "100%" }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
            }

            {successMessage &&
                <Snackbar
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    open={Boolean(successMessage)}
                    autoHideDuration={3000}
                >
                    <Alert
                        color="success"
                        severity="success"
                        variant="filled"
                        sx={{ border: "1px solid #000", width: "100%" }}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            }

        </>
    )
}

export default Home;