import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Autocomplete, Box, Button, FormControl, IconButton, Snackbar, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dataGridSx from "../utils/dataGridSx";
import ConfirmModal from "../components/ConfirmModal";
import { deleteInvoice, fetchInvoices } from "../redux/actions/invoiceActions";
import { fetchReservations } from "../redux/actions/reservationActions";
import DeleteIcon from '@mui/icons-material/Delete';

const Invoices = () => {
    const dispatch = useDispatch();
    const invoices = useSelector(state => state.invoices.invoices);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

        console.log(invoices)

    // Map nested customer name to top-level property
    const mappedInvoices = invoices.map(inv => ({
        ...inv,
        customerName: inv.customer?.name || ""
    }));

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
            valueFormatter: (params) => {
                return params != null ? `${params} €` : ""
            }
        },
        {
            field: "discounts",
            headerName: "Alennukset",
            width: 100,
            valueFormatter: (params) => params != null ? `${params} €` : ""
        },
        {
            field: "vatTotal",
            headerName: "ALV",
            width: 100,
            valueFormatter: (params) => params != null ? `${params} €` : ""
        },
        {
            field: "totalSum",
            headerName: "Summa",
            width: 100,
            valueFormatter: (params) => params != null ? `${params} €` : ""
        },
        { field: "paid", headerName: "Maksettu", width: 80, type: "boolean" },
        {
            field: "remove", headerName: "Poista", width: 80, sortable: false,
            filterable: false,
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

    return <>
        <DataGrid
            rows={mappedInvoices}
            columns={invoiceColumns}
            getRowId={row => row.id}
            autoHeight
            disableSelectionOnClick
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

    </>
}

export default Invoices;