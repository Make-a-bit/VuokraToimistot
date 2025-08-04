import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Snackbar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import EditEntry from "../components/EditEntryModal";
import officeSchema from "../schema/office";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";
import { addOffice, deleteOffice, editOffice } from "../redux/actions/officeActions";
import useAutoClearMessages from "../hooks/autoClearMessages";
import mainURI from "../constants/apiEndpoint";

/**
 * Offices page component.
 * 
 * @returns {JSX.Element}
 */
const Offices = () => {
    /** @type {import('react-redux').Dispatch} */
    const dispatch = useDispatch();

    /**
     * @type {boolean}
     * Loading state from Redux UI slice.
     */
    const loading = useSelector(state => state.ui.loadingState);

    /**
     * @type {Array<Object>}
     * List of office objects from Redux store.
     */
    const offices = useSelector(state => state.offices.offices);

    /**
     * @type {{ errorMessage: string, successMessage: string }}
     * Error and success messages from Redux UI slice.
     */
    const { errorMessage, successMessage } = useSelector(state => state.ui);

    /**
     * @type {[boolean, Function]}
     * State for showing the Add Office modal.
     */
    const [showAddOffice, setShowAddOffice] = useState(false);

    /**
     * @type {[boolean, Function]}
     * State for showing the Edit Office modal.
     */
    const [showEditOffice, setShowEditOffice] = useState(false);

    /**
     * @type {[boolean, Function]}
     * State for showing the Confirm modal.
     */
    const [showConfirm, setShowConfirm] = useState(false);

    /**
     * @type {[Object, Function]}
     * State for the currently selected office.
     */
    const [selectedOffice, setSelectedOffice] = useState({});

    // useAutoClearMessages expects string messages, so errorMessage and successMessage are strings.
    useAutoClearMessages(errorMessage, successMessage);

    /**
     * Handles the delete button click for an office.
     * 
     * @param {Object} office - The office object to delete.
     * @returns {void}
     */
    const btnDeleteOffice = (office) => {
        setSelectedOffice(office);
        setShowConfirm(true);
    };

    /**
     * Handles row click in the DataGrid.
     * 
     * @param {Object} params - DataGrid row params.
     * @param {Object} params.row - The office object for the clicked row.
     * @returns {void}
     */
    const handleRowClick = (params) => {
        setSelectedOffice(params.row);
        setShowEditOffice(true);
    };

    useAutoClearMessages(errorMessage, successMessage);

    /**
     * @type {Array<Object>}
     * Memoized columns for the DataGrid, generated from officeSchema and btnDeleteOffice.
     */
    const columns = React.useMemo(() => dataGridColumns(officeSchema, btnDeleteOffice), []);

    const addButtonRef = useRef(null);

    const anyModalOpen = showAddOffice || showEditOffice || showConfirm;

    useEffect(() => {
        const bg = document.getElementById("background");
        if (!bg) return;
        if (anyModalOpen) {
            bg.setAttribute("inert", "");
        } else {
            bg.removeAttribute("inert");
        }
        // Cleanup: always remove inert on unmount
        return () => {
            if (bg) bg.removeAttribute("inert");
        };
    }, [anyModalOpen]);

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
                onExited={() => addButtonRef.current?.focus()}
                openerRef={addButtonRef}
            />

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

            {errorMessage &&
                <Snackbar
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    open={Boolean(errorMessage)}
                    autoHideDuration={3000}>
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
                    autoHideDuration={3000}>
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

export default Offices;