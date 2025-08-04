import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Alert, Button, Snackbar
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";

import vatSchema from "../schema/vat";
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import EditEntry from "../components/EditEntryModal";
import { addTax, fetchTaxes, deleteTax, editTax } from "../redux/actions/taxActions";
import useAutoClearMessages from "../hooks/autoClearMessages";

/**
 * Taxes component for managing VAT entries.
 * @function
 * @returns {JSX.Element}
 */
const Taxes = () => {
    /**
     * Redux dispatch function.
     * @type {function}
     */
    const dispatch = useDispatch();

    /**
     * Loading state from Redux.
     * @type {boolean}
     */
    const loading = useSelector(state => state.ui.loadingState);

    /**
     * List of VAT entries from Redux.
     * @type {Array<Object>}
     */
    const vats = useSelector(state => state.taxes.vats);

    /**
     * Error and success messages from Redux.
     * @type {{ errorMessage: string, successMessage: string }}
     */
    const { errorMessage, successMessage } = useSelector(state => state.ui);

    /**
     * Currently selected VAT entry for edit/delete.
     * @type {Object|null}
     */
    const [selectedVat, setSelectedVat] = useState(null);

    /**
     * Controls visibility of AddEntry modal.
     * @type {boolean}
     */
    const [showAddTax, setShowAddTax] = useState(false);

    /**
     * Controls visibility of ConfirmModal.
     * @type {boolean}
     */
    const [showConfirm, setShowConfirm] = useState(false);

    /**
     * Controls visibility of EditEntry modal.
     * @type {boolean}
     */
    const [showEditTax, setShowEditTax] = useState(false);

    // Custom hook to auto-clear messages. No return value.
    useAutoClearMessages(errorMessage, successMessage);

    /**
     * API base URI.
     * @type {string}
     */
    const mainURI = "https://localhost:7017";

    /**
     * Handles delete button click for a VAT entry.
     * @param {Object} vat - VAT entry object to delete.
     * @returns {void}
     */
    const btnDeleteVat = (vat) => {
        setSelectedVat(vat);
        setShowConfirm(true);
    };

    /**
     * Handles row click in the DataGrid.
     * @param {Object} params - DataGrid row params.
     * @returns {void}
     */
    const handleRowClick = (params) => {
        setSelectedVat(params.row);
        setShowEditTax(true);
    };

    /**
     * Memoized columns for DataGrid.
     * @type {Array<Object>}
     */
    const columns = React.useMemo(() => dataGridColumns(vatSchema, btnDeleteVat), []);

    const addButtonRef = useRef(null);

    return (
        <>
            <Button
                variant="contained"
                sx={{ marginBottom: "10px" }}
                onClick={() => setShowAddTax(true)}
                ref={addButtonRef}
            >
                Lisää uusi verokanta
            </Button>

            <div
                style={{ height: "auto", width: "100%" }}
            >
                <DataGrid
                    rows={vats}
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

                <AddEntry
                    schema={vatSchema}
                    apiEndPoint={`${mainURI}/tax`}
                    show={showAddTax}
                    onHide={() => {
                        setShowAddTax(false);
                        dispatch(fetchTaxes());
                    }}
                    onExited={() => addButtonRef.current?.focus()}
                    title={`Lisää uusi verokanta`}
                    action={addTax}
                    openerRef={addButtonRef}
                />

                <EditEntry
                    schema={vatSchema}
                    apiEndPoint={`${mainURI}/tax`}
                    show={showEditTax}
                    onHide={() => setShowEditTax(false)}
                    title={`Muokkaa verokantaa ${selectedVat ? selectedVat.vatValue : ""}`}
                    action={editTax}
                    entry={selectedVat}
                    onClose={() => setShowEditTax(false)}
                />

                <ConfirmModal
                    show={showConfirm}
                    onHide={() => setShowConfirm(false)}
                    title="Poista verokanta"
                    message={`Haluatko varmasti poistaa verokannan ${selectedVat?.vatValue}?`}
                    confirmText="Poista"
                    cancelText="Sulje"
                    onConfirm={() => {
                        dispatch(deleteTax(selectedVat));
                        //dispatch(fetchTaxes())
                    }}
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
            </div>
        </>
    );
};

export default Taxes;