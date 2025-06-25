import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
    const [selectedDevice, setSelectedDevice] = useState({})

    useAutoClearMessages(errorMessage, successMessage);

    const handleOfficeChange = (e) => {
        const office = offices.find(o => o.id === e.target.value);
        dispatch(setDeviceOffice(office));
        dispatch(fetchDevices(office.id));
    };

    const saveEdits = async (updatedRow, originalRow) => {
        console.log("Edit device:", originalRow)
        const requiredFields = ["name", "price"]
        const decimalFields = ["price"]
        const isValid = inputValidation(updatedRow, requiredFields, decimalFields);

        if (!isValid) {
            await dispatch({ type: SHOW_ERROR, payload: "Laitteen päivitys epäonnistui!" })
            return originalRow;
        }

        await dispatch(editDevice(updatedRow));

        return updatedRow;
    }

    const btnDeleteDevice = (device) => {
        setSelectedDevice(device)
        setShowConfirm(true)
    }

    const columns = React.useMemo(() => dataGridColumns(deviceSchema, btnDeleteDevice), []);


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
                onClick={() => setShowAddDevice(true)}
            >
                Lisää uusi laite
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
                schema={deviceSchema}
                apiEndPoint={`${mainURI}/device`}
                show={showAddDevice}
                onHide={() => setShowAddDevice(false)}
                title="Lisää uusi laite"
                action={addDevice}
                extraData={selectedOffice ? { officeId: selectedOffice.id } : {}}
            /><br /><br />

            {devices.length > 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Kaksoisklikkaa solua muokataksesi sitä, poistu solusta tallentaaksesi.
                </Typography>
            )}

            <div style={{ height: "auto", width: "100%" }}>
                <DataGrid
                    rows={devices}
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
                title="Poista laite"
                message={`Haluatko varmasti poistaa laitteen ${selectedDevice?.name}?`}
                confirmText="Poista"
                cancelText="Peruuta"
                onConfirm={() => dispatch(deleteDevice(selectedDevice))}
            />

        </>
    )
}

export default Devices;