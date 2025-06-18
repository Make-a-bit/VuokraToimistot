import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import inputValidation from "../utils/inputValidation";
import propertySchema from "../schema/property";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";
import { useDispatch, useSelector } from "react-redux";
import {
    addProperty, deleteOfficeProperty, editOfficeProperty, fetchOfficeProperties,
    clearError, clearSuccess, setOffice
} from "../redux/actions";

const mainURI = "https://localhost:7017";

const Properties = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loadingState);
    const offices = useSelector(state => state.offices);
    const properties = useSelector(state => state.properties);
    const errorMessage = useSelector(state => state.errorMessage);
    const selectedOffice = useSelector(state => state.selectedOffice);
    const successMessage = useSelector(state => state.successMessage)
    const [showAddProperty, setShowAddProperty] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState({});

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

    useEffect(() => {
        if (selectedOffice && !offices.find(o => o.id === selectedOffice.id)) {
            dispatch(setOffice(null));
        }
    }, [selectedOffice, offices, dispatch]);

    const handleOfficeChange = (e) => {
        const office = offices.find(o => o.id === e.target.value);
        dispatch(setOffice(office));
        dispatch(fetchOfficeProperties(office.id));
    };

    const btnDeleteProperty = (property) => {
        setSelectedProperty(property)
        setShowConfirm(true)
    }

    const columns = React.useMemo(() => dataGridColumns(propertySchema, btnDeleteProperty), []);

    const saveEdits = async (updatedRow, originalRow) => {
        console.log("Edit property:", originalRow)
        const requiredFields = ["name", "area", "price"]
        const isValid = inputValidation(updatedRow, requiredFields);

        if (!isValid) {
            return originalRow;
        }

        await dispatch(editOfficeProperty(updatedRow));

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

            <div style={{ height: 600, width: "100%" }}>
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
                onConfirm={() => dispatch(deleteOfficeProperty(selectedProperty))}
            />

        </>
    )
}

export default Properties;