import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Alert, Autocomplete, Box, Button, FormControl, Snackbar, TextField
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import EditEntry from "../components/EditEntryModal";
import { addDevice, editDevice, deleteDevice, fetchDevices, setDeviceOffice } from "../redux/actions/deviceActions";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";
import deviceSchema from "../schema/device";
import useAutoClearMessages from "../hooks/autoClearMessages";
import mainURI from "../constants/apiEndpoint";

/**
 * Devices component for managing device entries.
 * 
 * @returns {JSX.Element}
 */
const Devices = () => {
    /**
     * @type {function}
     * Redux dispatch function.
     */
    const dispatch = useDispatch();

    /**
     * @type {boolean}
     * Loading state from Redux UI slice.
     */
    const loading = useSelector(state => state.ui.loadingState);

    /**
     * @type {Array<Object>}
     * List of office objects from Redux.
     */
    const offices = useSelector(state => state.offices.offices);

    /**
     * @type {Array<Object>}
     * List of device objects from Redux.
     */
    const devices = useSelector(state => state.devices.devices);

    /**
     * @type {Object|null}
     * Currently selected office object or null.
     */
    const selectedOffice = useSelector(state => state.devices.selectedDeviceOffice);

    /**
     * @type {{ errorMessage: string, successMessage: string }}
     * Error and success messages from Redux UI slice.
     */
    const { errorMessage, successMessage } = useSelector(state => state.ui);

    /**
     * @type {[boolean, function]}
     * State for showing the Add Device modal.
     */
    const [showAddDevice, setShowAddDevice] = useState(false);

    /**
     * @type {[boolean, function]}
     * State for showing the Confirm modal.
     */
    const [showConfirm, setShowConfirm] = useState(false);

    /**
     * @type {[boolean, function]}
     * State for showing the Edit Device modal.
     */
    const [showEditDevice, setShowEditDevice] = useState(false);

    /**
     * @type {[Object, function]}
     * State for the currently selected device object.
     */
    const [selectedDevice, setSelectedDevice] = useState({});

    // Custom hook to auto-clear messages.
    useAutoClearMessages(errorMessage, successMessage);

    /**
     * @type {Array<Object>}
     * Devices filtered by selected office.
     */
    const filteredDevices = selectedOffice
        ? devices.filter(d => d.officeId === selectedOffice.id)
        : devices;

    /**
     * Opens the confirm modal for deleting a device.
     * @param {Object} device
     */
    const btnDeleteDevice = (device) => {
        setSelectedDevice(device)
        setShowConfirm(true)
    }

    /**
     * Handles row click in the DataGrid.
     * @param {Object} params
     */
    const handleRowClick = (params) => {
        setSelectedDevice(params.row);
        setShowEditDevice(true);
    };

    /**
     * Closes the Add Device modal and refreshes devices.
     */
    const handleCloseAddDevice = () => {
        setShowAddDevice(false);
        dispatch(fetchDevices());
    };

    /**
     * Closes the Edit Device modal and refreshes devices.
     */
    const handleCloseEditDevice = () => {
        setShowEditDevice(false);
        dispatch(fetchDevices());
    };

    /**
     * @type {Array<Object>}
     * Memoized columns for the DataGrid.
     */
    const columns = React.useMemo(() => dataGridColumns(deviceSchema, btnDeleteDevice), []);

    const addButtonRef = useRef(null);

    const anyModalOpen = showAddDevice || showEditDevice || showConfirm;

    useEffect(() => {
        const bg = document.getElementById("background");
        if (!bg) return;
        if (anyModalOpen) {
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
            <Box sx={{ marginTop: "20px", width: "200px" }}>
                <FormControl>
                    <Autocomplete
                        options={offices}
                        getOptionLabel={(option) => option.name}
                        value={selectedOffice || null}
                        onChange={(_, newValue) => dispatch(setDeviceOffice(newValue))}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} label="Valitse kohde" variant="outlined" />
                        )}
                        sx={{ width: "300px" }}
                    />

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
                onExited={() => addButtonRef.current?.focus()}
                openerRef={addButtonRef}
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
                    autoHideDuration={3000}>
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
                    autoHideDuration={3000}>
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