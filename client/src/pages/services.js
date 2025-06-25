import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import { addOfficeService, deleteService, editService, fetchServices, setOffice } from "../redux/actions/serviceActions"
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import inputValidation from "../utils/inputValidation";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";
import { SHOW_ERROR } from "../redux/actions/actiontypes";
import serviceSchema from "../schema/service";
import useAutoClearMessages from "../hooks/autoClearMessages";

const mainURI = "https://localhost:7017";

const Services = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.ui.loadingState);
    const offices = useSelector(state => state.offices.offices);
    const services = useSelector(state => state.services.services);
    const selectedOffice = useSelector(state => state.services.selectedServiceOffice);
    const { errorMessage, successMessage } = useSelector(state => state.ui);
    const [showAddService, setShowAddService] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [selectedService, setSelectedService] = useState({})

    useAutoClearMessages(errorMessage, successMessage);

    const handleOfficeChange = (e) => {
        const office = offices.find(o => o.id === e.target.value);
        dispatch(setOffice(office));
        dispatch(fetchServices(office.id));
    };

    const saveEdits = async (updatedRow, originalRow) => {
        console.log("Edit property:", originalRow)
        const requiredFields = ["name", "unit", "price"]
        const decimalFields = ["price"]
        const isValid = inputValidation(updatedRow, requiredFields, decimalFields);

        if (!isValid) {
            await dispatch({ type: SHOW_ERROR, payload: "Palvelun päivitys epäonnistui!" })
            return originalRow;
        }

        await dispatch(editService(updatedRow));

        return updatedRow;
    }

    const btnDeleteService = (service) => {
        setSelectedService(service)
        setShowConfirm(true)
    }

    const columns = React.useMemo(() => dataGridColumns(serviceSchema, btnDeleteService), []);

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
                onClick={() => setShowAddService(true)}
            >
                Lisää uusi palvelu
            </Button>

            {errorMessage &&
                <Snackbar
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    open={Boolean(errorMessage)}
                    autoHideDuration={6000}>
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
                schema={serviceSchema}
                apiEndPoint={`${mainURI}/service`}
                show={showAddService}
                onHide={() => setShowAddService(false)}
                title="Lisää uusi palvelu"
                action={addOfficeService}
                extraData={selectedOffice ? { officeId: selectedOffice.id } : {}}
            /><br /><br />

            {services.length > 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Kaksoisklikkaa solua muokataksesi sitä, poistu solusta tallentaaksesi.
                </Typography>
            )}

            <div style={{ height: "auto", width: "100%" }}>
                <DataGrid
                    rows={services}
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
                title="Poista palvelu"
                message={`Haluatko varmasti poistaa palvelun ${selectedService?.name}?`}
                confirmText="Poista"
                cancelText="Peruuta"
                onConfirm={() => dispatch(deleteService(selectedService))}
            />
        </>
    )
}

export default Services;