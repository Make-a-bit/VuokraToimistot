import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, IconButton, Snackbar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dataGridSx from "../utils/dataGridSx";
import { deleteInvoice, fetchInvoices } from "../redux/actions/invoiceActions";
import { fetchReservations } from "../redux/actions/reservationActions";
import DeleteIcon from '@mui/icons-material/Delete';

import ConfirmModal from "../components/ConfirmModal";
import EditInvoice from "../components/EditInvoiceModal";

/**
 * Represents a customer object.
 * @typedef {Object} Customer
 * @property {string} name
 */

/**
 * Represents an invoice object.
 * @typedef {Object} Invoice
 * @property {number|string} id
 * @property {number|string} reservationId
 * @property {Customer} customer
 * @property {string} invoiceDate
 * @property {string} dueDate
 * @property {number} subTotal
 * @property {number} discounts
 * @property {number} vatTotal
 * @property {number} totalSum
 * @property {boolean} paid
 */

/**
 * Represents a mapped invoice object with customerName at the top level.
 * @typedef {Invoice & { customerName: string }} MappedInvoice
 */

/**
 * Redux UI state shape.
 * @typedef {Object} UIState
 * @property {string|null} errorMessage
 * @property {string|null} successMessage
 */

/**
 * The main Invoices component.
 * @returns {JSX.Element}
 */
const Invoices = () => {
    /** @type {import('react-redux').Dispatch} */
    const dispatch = useDispatch();

    /**
     * Invoices array from Redux state.
     * @type {Invoice[]}
     */
    const invoices = useSelector(state => state.invoices.invoices);

    /**
     * UI state from Redux.
     * @type {UIState}
     */
    const { errorMessage, successMessage } = useSelector(
        /**
         * @param {object} state - The Redux state object.
         * @returns {{ errorMessage: string | null, successMessage: string | null }}
         */
        state => state.ui
    );

    /**
     * The currently selected invoice for editing or deletion.
     * @type {[Invoice|null, Function]}
     */
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    /**
     * Controls the visibility of the confirm modal.
     * @type {[boolean, Function]}
     */
    const [showConfirm, setShowConfirm] = useState(false);

    /**
     * Controls the visibility of the edit invoice modal.
     * @type {[boolean, Function]}
     */
    const [showEditInvoice, setShowEditInvoice] = useState(false);

    // Map nested customer name to top-level property
    /**
     * Mapped invoices with customerName at the top level.
     * @type {MappedInvoice[]}
     */
    const mappedInvoices = invoices.map(inv => ({
        ...inv,
        customerName: inv.customer?.name || ""
    }));

    /**
     * DataGrid column definitions.
     * @type {import('@mui/x-data-grid').GridColDef[]}
     */
    const invoiceColumns = [
        { field: "id", headerName: "Lasku #", width: 75 },
        { field: "reservationId", headerName: "Varaus #", width: 75 },
        {
            field: "customerName",
            headerName: "Asiakas",
            flex: 1,
        },
        { field: "invoiceDate", headerName: "Laskutuspäivä", width: 120 },
        { field: "dueDate", headerName: "Eräpäivä", width: 120 },
        {
            field: "subTotal",
            headerName: "Veroton",
            width: 100,
            /**
             * Formats the value as a euro string.
             * @param {number} params
             * @returns {string}
             */
            valueFormatter: (params) => {
                return params != null ? `${params} €` : ""
            }
        },
        {
            field: "discounts",
            headerName: "Alennukset",
            width: 100,
            /**
             * @param {number} params
             * @returns {string}
             */
            valueFormatter: (params) => params != null ? `${params} €` : ""
        },
        {
            field: "vatTotal",
            headerName: "ALV",
            width: 100,
            /**
             * @param {number} params
             * @returns {string}
             */
            valueFormatter: (params) => params != null ? `${params} €` : ""
        },
        {
            field: "totalSum",
            headerName: "Summa",
            width: 100,
            /**
             * @param {number} params
             * @returns {string}
             */
            valueFormatter: (params) => params != null ? `${params} €` : ""
        },
        { field: "paid", headerName: "Maksettu", width: 80, type: "boolean" },
        {
            field: "remove", headerName: "Poista", width: 80, sortable: false,
            filterable: false,
            /**
             * Renders the delete icon button.
             * @param {object} params
             * @param {MappedInvoice} params.row
             * @returns {JSX.Element}
             */
            renderCell: (params) => (
                <IconButton
                    color="error"
                    onClick={e => {
                        e.stopPropagation();
                        setSelectedInvoice(params.row)
                        setShowConfirm(true);
                    }}
                    disabled={params.row.paid}
                >
                    <DeleteIcon />
                </IconButton>
            )
        }
    ];

    /**
     * Handles row click in the DataGrid.
     * @param {object} params
     * @param {MappedInvoice} params.row
     * @returns {void}
     */
    const handleRowClick = (params) => {
        setSelectedInvoice(params.row);
        setShowEditInvoice(true);
    };

    return <>
        <DataGrid
            rows={mappedInvoices}
            columns={invoiceColumns}
            getRowId={row => row.id}
            autoHeight
            disableSelectionOnClick
            onRowClick={handleRowClick}
            sx={{
                ...dataGridSx,
                marginBottom: "20px",
                minHeight: "175px",
            }}
        />

        <ConfirmModal
            onConfirm={async () => {
                await dispatch(deleteInvoice(selectedInvoice))
                await dispatch(fetchReservations())
                await dispatch(fetchInvoices())
            }}
            onHide={() => {
                setShowConfirm(false);
                setSelectedInvoice(null)
            }}
            show={showConfirm}
            cancelText={"Sulje"}
            confirmText={"Poista lasku"}
            message={
                selectedInvoice ? (
                    <>
                        <h5>Haluatko varmasti poistaa tämän laskun?</h5>
                        <span>Laskun numero: </span><strong>{selectedInvoice.id}</strong><br />
                        <span>Varausnumero: </span><strong>{selectedInvoice.reservationId}</strong><br />
                        <span>Asiakas: </span><strong>{selectedInvoice.customer.name}</strong><br />
                        <span>Loppusumma: </span><strong>{selectedInvoice.totalSum} €</strong><br />
                        <span>Eräpäivä: </span><strong>{selectedInvoice.dueDate}</strong><br />
                        <span>Status: </span><strong>{selectedInvoice.paid ? "Maksettu" : "Maksamatta"}</strong>
                    </>
                ) : "Haluatko varmasti poistaa tämän varauksen?"
            }
            title={"Poista varaus"}
        />

        <EditInvoice
            show={showEditInvoice}
            onHide={() => setShowEditInvoice(false)}
            invoice={selectedInvoice}
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
}

export default Invoices;