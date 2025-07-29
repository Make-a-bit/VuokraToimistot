import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Alert, Box, Button, FormControl, InputLabel, MenuItem,
    Select, Snackbar, Typography
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

const Taxes = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.ui.loadingState);
    const vats = useSelector(state => state.taxes.vats);
    const { errorMessage, successMessage } = useSelector(state => state.ui);

    const [selectedVat, setSelectedVat] = useState(null)
    const [showAddTax, setShowAddTax] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [showEditTax, setShowEditTax] = useState(false)

    useAutoClearMessages(errorMessage, successMessage);

    const mainURI = "https://localhost:7017";

    const btnDeleteVat = (vat) => {
        setSelectedVat(vat)
        setShowConfirm(true)
    }

    const handleRowClick = (params) => {
        setSelectedVat(params.row);
        setShowEditTax(true);
    };

    console.log(vats)

    const columns = React.useMemo(() => dataGridColumns(vatSchema, btnDeleteVat), []);

    return (
        <>
            <Button
                variant="contained"
                sx={{ marginBottom: "10px" }}
                onClick={() => setShowAddTax(true)}
            >
                Lisää uusi verokanta
            </Button>

            <div style={{ height: "auto", width: "100%" }}>
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
                        setShowAddTax(false)
                        dispatch(fetchTaxes())
                    }}
                    title={`Lisää uusi verokanta`}
                    action={addTax}
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
                        dispatch(deleteTax(selectedVat))
                        //dispatch(fetchTaxes())
                    }}
                />

            </div>
        </>
    )
}

export default Taxes;