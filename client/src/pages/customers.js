import React, { useState, useEffect, useMemo } from "react";
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import inputValidation from "../utils/inputValidation";
import customerSchema from "../schema/customer";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer, editCustomer, fetchCustomers, clearError, deleteCustomer, clearSuccess } from "../redux/actions";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

const mainURI = "https://localhost:7017";

const Customers = () => {
    const dispatch = useDispatch();
    const customers = useSelector(state => state.customers);
    const loading = useSelector(state => state.loadingState);
    const errorMessage = useSelector(state => state.errorMessage);
    const successMessage = useSelector(state => state.successMessage)
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState({});

    const btnDeleteCustomer = (customer) => {
        setSelectedCustomer(customer);
        setShowConfirm(true);
    }

    const columns = React.useMemo(() => dataGridColumns(customerSchema, btnDeleteCustomer), []);

    const saveEdits = async (updatedRow, originalRow) => {
        console.log("Edit customer:", originalRow)
        const requiredFields = ["name", "email", "phone", "address", "postalCode", "city", "country"];
        const isValid = inputValidation(updatedRow, requiredFields);

        if (!isValid) {
            return originalRow;
        }

        await dispatch(editCustomer(updatedRow));
        return updatedRow;
    }

    const modalClosed = () => {
        setShowAddCustomer(false)
    }

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage, dispatch]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                dispatch(clearSuccess());
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch]);

    return (
        <>
            <Button
                variant="contained"
                sx={{ marginBottom: "-10px" }}
                onClick={() => setShowAddCustomer(true)}>Lisää uusi asiakas</Button>

            <AddEntry
                schema={customerSchema}
                apiEndPoint={`${mainURI}/customer`}
                show={showAddCustomer}
                onHide={modalClosed}
                title="Lisää uusi asiakas"
                action={addCustomer}
            /><br /><br />

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

            { customers.length > 0 && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                 Kaksoisklikkaa solua muokataksesi sitä, poistu solusta tallentaaksesi.
                </Typography>
            )}

            <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                    rows={customers}
                    getRowId={(row => row.id) }
                    columns={columns}
                    disableRowSelectionOnClick
                    processRowUpdate={saveEdits}
                    loading={loading}
                    slotProps={{
                        loadingOverlay: {
                            variant: "linear-progress",
                            noRowsVariant: "skeleton"
                        },
                    }}
                    onProcessRowUpdateError={(error) => {
                        console.log("Row update error:", error);
                    }}
                    experimentalFeatures={{ newEditingApi: true }}
                    sx={dataGridSx}
                />
            </div>

            <ConfirmModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                title="Poista asiakas"
                message={`Haluatko varmasti poistaa asiakkaan ${selectedCustomer?.name}?`}
                confirmText="Poista"
                cancelText="Peruuta"
                onConfirm={() => dispatch(deleteCustomer(selectedCustomer))}
            />
        </>
    )
}

export default Customers;