import React, { useState, useEffect } from "react";
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import inputValidation from "../utils/inputValidation";
import officeSchema from "../schema/office";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";
import { useDispatch, useSelector } from "react-redux";
import { addOffice, deleteOffice, editOffice, fetchOffices, clearError, clearSuccess } from "../redux/actions";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

const mainURI = "https://localhost:7017";

const Offices = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loadingState);
    const offices = useSelector(state => state.offices);
    const errorMessage = useSelector(state => state.errorMessage);
    const successMessage = useSelector(state => state.successMessage)
    const [showAddOffice, setShowAddOffice] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState({});

    const btnDeleteOffice = (office) => {
        setSelectedOffice(office)
        setShowConfirm(true)
    }

    const columns = React.useMemo(() => dataGridColumns(officeSchema, btnDeleteOffice), []);

    const saveEdits = async (updatedRow, originalRow) => {
        console.log("Edit office:", originalRow)
        const requiredFields = ['name', 'address', 'postalCode', 'city', 'country', 'phone', 'email']
        const isValid = inputValidation(updatedRow, requiredFields);

        if (!isValid) {
            return originalRow;
        }

        await dispatch(editOffice(updatedRow));
        return updatedRow;
    }

    // JATKA SIITÄ ETTÄ CONTROLLERI PALAUTTAA MUOKATUN OFFICEN 

    const modalClosed = () => {
        setShowAddOffice(false)
    }

    useEffect(() => {
        dispatch(fetchOffices());
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
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch]);

    return (
        <>
            <Button
                variant="contained"
                sx={{ marginBottom: "-10px" }}
                onClick={() => setShowAddOffice(true)}>Lisää uusi kohde</Button>

            <AddEntry
                schema={officeSchema}
                apiEndPoint={`${mainURI}/office`}
                show={showAddOffice}
                onHide={modalClosed}
                title="Lisää uusi kohde"
                action={addOffice}
            /><br /><br />

            {errorMessage &&
                <Snackbar
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    open={Boolean(errorMessage)}
                    autoHideDuration={6000}>
                    <Alert
                        color="warning"
                        severity="warning"
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
                    autoHideDuration={6000}>
                    <Alert
                        color="success"
                        severity="success"
                        variant="filled"
                        sx={{ border: "1px solid #000", width: "100%" }}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            }

            {offices.length > 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Kaksoisklikkaa solua muokataksesi sitä, poistu solusta tallentaaksesi.
                </Typography>
            )}

            <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                    rows={offices}
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
                title="Poista toimisto"
                message={`Haluatko varmasti poistaa toimiston ${selectedOffice?.name}?`}
                confirmText="Poista"
                cancelText="Peruuta"
                onConfirm={() => dispatch(deleteOffice(selectedOffice))}
            />
        </>
    )
}

export default Offices;