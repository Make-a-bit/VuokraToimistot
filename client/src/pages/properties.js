import React, { useState, useEffect } from "react";
import {
    Alert, Box, Button, FormControl, InputLabel,
    MenuItem, Select, Snackbar, Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import inputValidation from "../utils/inputValidation";
import propertySchema from "../schema/property";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";
import { useDispatch, useSelector } from "react-redux";
import { addProperty, deleteProperty, editProperty, fetchProperties, setPropertyOffice } from "../redux/actions/propertyActions";
import useAutoClearMessages from "../hooks/autoClearMessages";
import { SHOW_ERROR } from "../redux/actions/actiontypes";

const mainURI = "https://localhost:7017";

const Properties = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.ui.loadingState);
    const offices = useSelector(state => state.offices.offices);
    const selectedOffice = useSelector(state => state.properties.selectedPropertyOffice);
    const properties = useSelector(state => state.properties.properties);
    const { errorMessage, successMessage } = useSelector(state => state.ui);
    const [showAddProperty, setShowAddProperty] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState({});

    useAutoClearMessages(errorMessage, successMessage);

    useEffect(() => {
        if (selectedOffice && !offices.find(o => o.id === selectedOffice.id)) {
            dispatch(setPropertyOffice(null));
        }
    }, [selectedOffice, offices, dispatch]);

    const handleOfficeChange = (e) => {
        const office = offices.find(o => o.id === e.target.value);
        dispatch(setPropertyOffice(office));
        dispatch(fetchProperties(office.id));
    };

    const btnDeleteProperty = (property) => {
        setSelectedProperty(property)
        setShowConfirm(true)
    }

    const columns = React.useMemo(() => dataGridColumns(propertySchema, btnDeleteProperty), []);

    const saveEdits = async (updatedRow, originalRow) => {
        console.log("Edit property:", originalRow)
        const requiredFields = ["name", "area", "price"]
        const decimalFields = ["price"]
        const isValid = inputValidation(updatedRow, requiredFields, decimalFields);

        if (!isValid) {
            await dispatch({ type: SHOW_ERROR, payload: "Vuokratilan päivitys epäonnistui!" })
            return originalRow;
        }

        await dispatch(editProperty(updatedRow));

        return updatedRow;
    }

    return (
        <>
            <Box sx={{ marginTop: "20px", width: "200px" }}>
                <FormControl>
                    <InputLabel>
                        {selectedOffice ? "Kohde" : "Valitse kohde"}
                    </InputLabel>
                    <Select
                        label="Toimisto"
                        value={selectedOffice?.id || ""}
                        onChange={handleOfficeChange}
                        sx={{ minWidth: "200px" }}
                    >
                        {offices.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Button
                variant="contained"
                disabled={!selectedOffice}
                sx={{ marginBottom: "-10px" }}
                onClick={() => setShowAddProperty(true)}
            >
                Lisää uusi vuokratila
            </Button>

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

            <AddEntry
                schema={propertySchema}
                apiEndPoint={`${mainURI}/property`}
                show={showAddProperty}
                onHide={() => setShowAddProperty(false)}
                title="Lisää uusi vuokratila"
                action={addProperty}
                extraData={selectedOffice ? { officeId: selectedOffice.id } : {}}
            /><br /><br />

            {properties.length > 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Kaksoisklikkaa solua muokataksesi sitä, poistu solusta tallentaaksesi.
                </Typography>
            )}

            <div style={{ height: "auto", width: "100%" }}>
                <DataGrid
                    rows={properties}
                    columns={columns}
                    disableRowSelectionOnClick
                    loading={loading}
                    processRowUpdate={saveEdits}
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
                title="Poista vuokrakohde"
                message={`Haluatko varmasti poistaa vuokrakohteen ${selectedProperty?.name}?`}
                confirmText="Poista"
                cancelText="Peruuta"
                onConfirm={() => dispatch(deleteProperty(selectedProperty))}
            />

        </>
    )
}

export default Properties;