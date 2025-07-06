import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Snackbar } from "@mui/material";
import { fetchCustomers } from "../redux/actions/customerActions";
import { fetchOffices } from "../redux/actions/officeActions";
import { fetchProperties } from "../redux/actions/propertyActions";
import { fetchReservations } from "../redux/actions/reservationActions";
import useAutoClearMessages from "../hooks/autoClearMessages";
import { fetchServices } from "../redux/actions/serviceActions";

const Home = () => {
    const dispatch = useDispatch();
    const { errorMessage, successMessage } = useSelector(state => state.ui);

    useAutoClearMessages(errorMessage, successMessage);

    useEffect(() => {
        dispatch(fetchCustomers());
        dispatch(fetchOffices());
        dispatch(fetchReservations());
        dispatch(fetchProperties());
        dispatch(fetchServices());
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