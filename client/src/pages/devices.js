import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Alert, Box, Button, FormControl, InputLabel, MenuItem, Select,
    Snackbar, Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import EditEntry from "../components/EditEntryModal";
import { addDevice, editDevice, deleteDevice, fetchDevices, setDeviceOffice } from "../redux/actions/deviceActions";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";
import deviceSchema from "../schema/device";
import inputValidation from "../utils/inputValidation";
import { SHOW_ERROR } from "../redux/actions/actiontypes";
import useAutoClearMessages from "../hooks/autoClearMessages";

const mainURI = "https://localhost:7017";

const Devices = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.ui.loadingState);
    const offices = useSelector(state => state.offices.offices);
    const devices = useSelector(state => state.devices.devices);
    const selectedOffice = useSelector(state => state.devices.selectedDeviceOffice);
    const { errorMessage, successMessage } = useSelector(state => state.ui);

    const [showAddDevice, setShowAddDevice] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [showEditDevice, setShowEditDevice] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState({})

    useAutoClearMessages(errorMessage, successMessage);

    const handleOfficeChange = (e) => {
        const office = offices.find(o => o.id === e.target.value);
        dispatch(setDeviceOffice(office));
    };

    const filteredDevices = selectedOffice
        ? devices.filter(d => d.officeId === selectedOffice.id)
        : devices;

    const btnDeleteDevice = (device) => {
        setSelectedDevice(device)
        setShowConfirm(true)
    }

    const handleRowClick = (params) => {
        setSelectedDevice(params.row);
        setShowEditDevice(true);
    };

    const handleCloseAddDevice = () => {
        setShowAddDevice(false);
        dispatch(fetchDevices());
    };

    const handleCloseEditDevice = () => {
        setShowEditDevice(false);
        dispatch(fetchDevices());
    };

    const columns = React.useMemo(() => dataGridColumns(deviceSchema, btnDeleteDevice), []);

    //console.log("DEVICES:", devices)

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
                    marginBottom: "10px",
                    marginTop: "10px"
                }}
                onClick={() => setShowAddDevice(true)}
            >
                Lisää uusi laite
            </Button>

            <AddEntry
                schema={deviceSchema}
                apiEndPoint={`${mainURI}/device`}
                show={showAddDevice}
                onHide={handleCloseAddDevice}
                title={`Lisää vuokralaite kohteeseen ${selectedOffice ? selectedOffice.name : ""}`}
                action={addDevice}
                extraData={selectedOffice ? { officeId: selectedOffice.id } : {}}
            />

            <EditEntry
                schema={deviceSchema}
                apiEndPoint={`${mainURI}/device/update`}
                show={showEditDevice}
                onHide={handleCloseEditDevice}
                title={`Muokkaa vuokralaitetta ${selectedDevice ? selectedDevice.name : ""}`}
                action={editDevice}
                entry={selectedDevice}
                onClose={() => setShowEditDevice(false)}
            />

            <div style={{ height: "auto", width: "100%" }}>
                <DataGrid
                    rows={filteredDevices}
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
                title="Poista laite"
                message={`Haluatko varmasti poistaa laitteen ${selectedDevice?.name}?`}
                confirmText="Poista"
                cancelText="Peruuta"
                onConfirm={() => dispatch(deleteDevice(selectedDevice))}
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

export default Devices;