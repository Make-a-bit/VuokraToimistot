import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { fetchCustomers } from "../redux/actions/customerActions"
import { fetchOffices } from "../redux/actions/officeActions"
import useAutoClearMessages from "../hooks/autoClearMessages";

const Home = () => {
    const dispatch = useDispatch();
    const { errorMessage, successMessage } = useSelector(state => state.ui);

    useAutoClearMessages(errorMessage, successMessage);

    useEffect(() => {
        dispatch(fetchOffices());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCustomers());
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