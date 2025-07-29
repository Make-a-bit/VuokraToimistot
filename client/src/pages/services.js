import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Alert, Box, Button, FormControl, InputLabel, MenuItem,
    Select, Snackbar, Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { addOfficeService, deleteService, editService, fetchServices, setOffice } from "../redux/actions/serviceActions"
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import EditEntry from "../components/EditEntryModal";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";
import inputValidation from "../utils/inputValidation";
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
    const [showEditService, setShowEditService] = useState(false)
    const [selectedService, setSelectedService] = useState({})

    useAutoClearMessages(errorMessage, successMessage);

    const handleOfficeChange = (e) => {
        const office = offices.find(o => o.id === e.target.value);
        dispatch(setOffice(office))
    };

    const handleCloseAddService = () => {
        setShowAddService(false);
        dispatch(fetchServices());
    };

    const handleCloseEditService = () => {
        setShowEditService(false);
        dispatch(fetchServices());
    };

    const handleRowClick = (params) => {
        setSelectedService(params.row);
        setShowEditService(true);
    };

    const filteredServices = selectedOffice
        ? services.filter(s => s.officeId === selectedOffice.id)
        : services;

    const btnDeleteService = (service) => {
        setSelectedService(service)
        setShowConfirm(true)
    }

    const columns = React.useMemo(() => dataGridColumns(serviceSchema, btnDeleteService), []);

    console.log(services)
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
                sx={{
                    marginTop: "10px",
                    marginBottom: "10px"
                }}
                onClick={() => setShowAddService(true)}
            >
                Lisää uusi palvelu
            </Button>

            <AddEntry
                schema={serviceSchema}
                apiEndPoint={`${mainURI}/service`}
                show={showAddService}
                onHide={handleCloseAddService}
                title={`Lisää uusi palvelu kohteeseen ${selectedOffice ? selectedOffice.name : ""}`}
                action={addOfficeService}
                extraData={selectedOffice ? { officeId: selectedOffice.id } : {}}
            />

            <EditEntry
                schema={serviceSchema}
                apiEndPoint={`${mainURI}/service/update`}
                show={showEditService}
                onHide={handleCloseEditService}
                title={`Muokkaa lisäpalvelua ${selectedService ? selectedService.name : ""}`}
                action={editService}
                entry={selectedService}
                onClose={() => setShowEditService(false)}
            />

            <div style={{ height: "auto", width: "100%" }}>
                <DataGrid
                    rows={filteredServices}
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
                title="Poista palvelu"
                message={`Haluatko varmasti poistaa palvelun ${selectedService?.name}?`}
                confirmText="Poista"
                cancelText="Peruuta"
                onConfirm={() => dispatch(deleteService(selectedService))}
            />

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

        </>
    )
}

export default Services;