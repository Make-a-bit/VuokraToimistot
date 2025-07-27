import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Autocomplete, Box, Button, FormControl, IconButton, Snackbar, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dataGridSx from "../utils/dataGridSx";

import DeleteIcon from '@mui/icons-material/Delete';

const Invoices = () => {

    const invoices = useSelector(state => state.invoices.invoices);

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const invoiceColumns = [
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
            rows={invoices}
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
    </>
}

export default Invoices;