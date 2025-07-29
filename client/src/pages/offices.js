import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Snackbar, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import EditEntry from "../components/EditEntryModal";
import officeSchema from "../schema/office";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";
import { addOffice, deleteOffice, editOffice } from "../redux/actions/officeActions";
import useAutoClearMessages from "../hooks/autoClearMessages";

const mainURI = "https://localhost:7017";

const Offices = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.ui.loadingState);
    const offices = useSelector(state => state.offices.offices);
    const { errorMessage, successMessage } = useSelector(state => state.ui);
    const [showAddOffice, setShowAddOffice] = useState(false)
    const [showEditOffice, setShowEditOffice] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState({});

    // console.log(offices)

    useAutoClearMessages(errorMessage, successMessage);

    const btnDeleteOffice = (office) => {
        setSelectedOffice(office)
        setShowConfirm(true)
    }

    const handleRowClick = (params) => {
        setSelectedOffice(params.row);
        setShowEditOffice(true);
    };

    useAutoClearMessages(errorMessage, successMessage);

    const columns = React.useMemo(() => dataGridColumns(officeSchema, btnDeleteOffice), []);

    return (
        <>
            <Button
                variant="contained"
                sx={{ marginBottom: "10px" }}
                onClick={() => setShowAddOffice(true)}>Lisää uusi kohde</Button>

            <AddEntry
                schema={officeSchema}
                apiEndPoint={`${mainURI}/office`}
                show={showAddOffice}
                onHide={() => setShowAddOffice(false)}
                title="Lisää uusi kohde"
                action={addOffice}
            />

            <EditEntry
                schema={officeSchema}
                apiEndPoint={`${mainURI}/office`}
                show={showEditOffice}
                onHide={() => setShowEditOffice(false)}
                title={`Muokkaa kohdetta ${selectedOffice ? selectedOffice.name : ""}`}
                action={editOffice}
                entry={selectedOffice}
            />

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

            <div style={{ height: "auto", width: "100%" }}>
                <DataGrid
                    rows={offices}
                    columns={columns}
                    disableRowSelectionOnClick
                    onRowClick={handleRowClick}
                    loading={loading}
                    slotProps={{
                        loadingOverlay: {
                            variant: "linear-progress",
                            noRowsVariant: "skeleton"
                        },
                    }}
                    sx={dataGridSx}
                />
            </div>

            <ConfirmModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                title="Poista toimisto"
                message={`Haluatko varmasti poistaa kohteen ${selectedOffice?.name}?`}
                confirmText="Poista"
                cancelText="Peruuta"
                onConfirm={() => dispatch(deleteOffice(selectedOffice))}
            />
        </>
    )
}

export default Offices;