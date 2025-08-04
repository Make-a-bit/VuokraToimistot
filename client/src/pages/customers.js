import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Alert, Button, Snackbar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { addCustomer, editCustomer, deleteCustomer } from "../redux/actions/customerActions";
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import EditEntry from "../components/EditEntryModal";
import customerSchema from "../schema/customer";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";
import useAutoClearMessages from "../hooks/autoClearMessages";
import mainURI from "../constants/apiEndpoint";

/**
 * Customers component for managing customer data.
 * 
 * @returns {JSX.Element}
 */
const Customers = () => {
    /**
     * Redux dispatch function.
     * @type {function}
     */
    const dispatch = useDispatch();

    /**
     * Array of customer objects from Redux state.
     * @type {Array<Object>}
     */
    const customers = useSelector(state => state.customers.customers, shallowEqual) || [];

    /**
     * Loading state from Redux UI slice.
     * @type {boolean}
     */
    const loading = useSelector(state => state.ui.loadingState);

    /**
     * Error message string from Redux UI slice.
     * @type {string}
     */
    /**
     * Success message string from Redux UI slice.
     * @type {string}
     */
    const { errorMessage, successMessage } = useSelector(
        state => ({ errorMessage: state.ui.errorMessage, successMessage: state.ui.successMessage }),
        shallowEqual
    );

    /**
     * State for showing Add Customer modal.
     * @type {[boolean, function]}
     */
    const [showAddCustomer, setShowAddCustomer] = useState(false);

    /**
     * State for showing Confirm modal.
     * @type {[boolean, function]}
     */
    const [showConfirm, setShowConfirm] = useState(false);

    /**
     * State for showing Edit Customer modal.
     * @type {[boolean, function]}
     */
    const [showEditCustomer, setShowEditCustomer] = useState(false);

    /**
     * State for the currently selected customer.
     * @type {[Object, function]}
     */
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    /**
     * Handles delete button click for a customer.
     * @param {Object} customer - The customer object to delete.
     * @returns {void}
     */
    const btnDeleteCustomer = useCallback((customer) => {
        setSelectedCustomer(customer);
        setShowConfirm(true);
    }, []);

    /**
     * Handles row click in the DataGrid.
     * @param {Object} params - DataGrid row params.
     * @returns {void}
     */
    const handleRowClick = useCallback((params) => {
        setSelectedCustomer(params.row);
        setShowEditCustomer(true);
    }, []);

    // Custom hook to auto-clear messages, no return value.
    useAutoClearMessages(errorMessage, successMessage);

    /**
     * Memoized columns for the DataGrid.
     * @type {Array<Object>}
     */
    const columns = useMemo(
        () => dataGridColumns(customerSchema, btnDeleteCustomer),
        [btnDeleteCustomer]
    );

    const addButtonRef = useRef(null);

    const slotProps = useMemo(() => ({
        loadingOverlay: {
            variant: "linear-progress",
            noRowsVariant: "skeleton",
        },
    }), []);

    const anyModalOpen = showAddCustomer || showEditCustomer || showConfirm;

    useEffect(() => {
        const bg = document.getElementById("background");
        if (!bg) return;
        if (anyModalOpen) {
            if (document.activeElement && bg && bg.contains(document.activeElement)) {
                document.activeElement.blur();
            }
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
                onClick={() => setShowAddCustomer(true)}>Lisää uusi asiakas</Button>

            <AddEntry
                schema={customerSchema}
                apiEndPoint={`${mainURI}/customer`}
                show={showAddCustomer}
                onHide={() => setShowAddCustomer(false)}
                title="Lisää uusi asiakas"
                action={addCustomer}
                onExited={() => addButtonRef.current?.focus()}
                openerRef={addButtonRef}
            />

            <EditEntry
                schema={customerSchema}
                apiEndPoint={`${mainURI}/customer`}
                show={showEditCustomer}
                onHide={() => setShowEditCustomer(false)}
                title={`Muokkaa asiakasta ${selectedCustomer ? selectedCustomer.name : ""}`}
                action={editCustomer}
                entry={selectedCustomer}
                onClose={() => setShowEditCustomer(false)}
            />

            <div style={{ height: "auto", width: "100%" }}>
                <DataGrid
                    rows={customers}
                    columns={columns}
                    disableRowSelectionOnClick
                    getRowId={(row) => row.id}
                    onRowClick={handleRowClick}
                    loading={loading}
                    slotProps={slotProps}
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
                onConfirm={() => {
                    if (selectedCustomer) dispatch(deleteCustomer(selectedCustomer));
                }}
            />

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

export default Customers;