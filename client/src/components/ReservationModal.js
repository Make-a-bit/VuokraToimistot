import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addReservation, fetchReservations, fetchReservedDates,
    setOffice, setProperty
} from "../redux/actions/reservationActions";
import { fetchDevices } from "../redux/actions/deviceActions";
import { fetchProperties } from "../redux/actions/propertyActions";
import { fetchServices } from "../redux/actions/serviceActions";
import {
    Autocomplete, Box, Button, Dialog, DialogTitle, DialogActions,
    DialogContent, Divider, FormControl, InputLabel, MenuItem, Select,
    TextField, Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from "@mui/icons-material/Save";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getReservationDateUtils } from "../utils/reservationDateUtils";
import { getDuration, addItemRow, updateRowsQty, deleteRow, updateRow } from "../utils/reservationUtils";
import { autoCompleteFieldMargins, leftButton, middleButton, rightButton } from "../utils/fieldMarginals"

import dayjs from "../../src/dayjs-setup";

export const AddReservation = ({ show, onHide, office, property }) => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.ui.loadingState);
    const customers = useSelector(state => state.customers.customers);
    const devices = useSelector(state => state.devices.devices);
    const offices = useSelector(state => state.offices.offices);
    const properties = useSelector(state => state.properties.properties);
    const services = useSelector(state => state.services.services);
    const reservedDates = useSelector(state => state.reservations.reservedDates);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [selectedOfficeLocal, setSelectedOfficeLocal] = useState(null);
    const [selectedPropertyLocal, setSelectedPropertyLocal] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [itemRows, setItemRows] = useState([]);
    const reservation = {
        startDate: startDate,
        endDate: endDate
    };

    const {
        shouldDisableStartDate,
        shouldDisableEndDate,
    } = useMemo(() =>
        getReservationDateUtils(reservedDates, { startDate, endDate }, startDate),
        [reservedDates, startDate, endDate]
    );

    useEffect(() => {
        setSelectedOfficeLocal(office || null)
        setSelectedPropertyLocal(property || null)
    }, [office, property])

    // Add device row when selectedDevice changes
    useEffect(() => {
        if (selectedDevice && selectedDevice.id !== undefined) {
            setItemRows(prev => addItemRow(prev, selectedDevice, "device", getDuration(startDate, endDate)));
            setSelectedDevice(null);
        }
    }, [selectedDevice, startDate, endDate]);

    // Add service row when selectedService changes
    useEffect(() => {
        if (selectedService && selectedService.id !== undefined) {
            setItemRows(prev => addItemRow(prev, selectedService, "service", getDuration(startDate, endDate)));
            setSelectedService(null);
        }
    }, [selectedService, startDate, endDate]);

    // Update qty for all rows when dates change
    useEffect(() => {
        if (!startDate || !endDate) return;
        const days = getDuration(startDate, endDate);
        setItemRows(prev => updateRowsQty(prev, days));
    }, [startDate, endDate]);

    useEffect(() => {
        if (show && office && property) {
            dispatch(fetchReservedDates(property.id));
        }
    }, [show, office, property, dispatch]);

    const deviceOptions = useMemo(() =>
        devices.filter(
            d => !itemRows.some(row => row.type === "device" && row.itemId === d.id)
        ), [devices, itemRows]);

    const serviceOptions = useMemo(() =>
        services.filter(
            s => !itemRows.some(row => row.type === "service" && row.itemId === s.id)
        ), [services, itemRows]
    );

    const propertyOptions = useMemo(() =>
        properties.filter(
            p => selectedOfficeLocal && p.officeId === selectedOfficeLocal.id
        ),
        [properties, selectedOfficeLocal]
    );

    const handleRowEdit = (newRow) => {
        setItemRows(prev => updateRow(prev, newRow));
        return newRow;
    };

    const handleRowDelete = (id) => {
        setItemRows(prev => deleteRow(prev, id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Separate devices and services
        const devices = itemRows
            .filter(row => row.type === "device")
            .map(d => ({
                id: d.itemId,
                price: d.price,
                vat: d.vat,
                qty: d.qty,
                discount: d.discount
            }));

        const services = itemRows
            .filter(row => row.type === "service")
            .map(s => ({
                id: s.itemId,
                price: s.price,
                vat: s.vat,
                qty: s.qty,
                discount: s.discount
            }));

        const reservation = {
            propertyId: selectedPropertyLocal.id,
            customerId: selectedCustomer.id,
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            devices,
            services,
            invoiced: false
        };

        dispatch(addReservation(reservation))
            .then(() => {
                setSelectedCustomer(null);
                setStartDate(null);
                setEndDate(null);
                setItemRows([]);
                dispatch(fetchReservedDates(selectedPropertyLocal.id));
                dispatch(fetchReservations());
                onHide();
            })
    }

    console.log("Services:", services);

    return (
        <Dialog
            open={show}
            onClose={onHide}
            PaperProps={{
                sx: { width: "900px", maxWidth: "100%" }
            }}
        >

            <DialogTitle>Tee uusi varaus</DialogTitle>
            <DialogContent dividers>
                <FormControl>
                    <Autocomplete
                        options={offices}
                        getOptionLabel={option => option.name || ""}
                        value={selectedOfficeLocal}
                        onChange={(event, newValue) => {
                            setSelectedOfficeLocal(newValue);
                            setSelectedPropertyLocal(null);
                            console.log("Value:", newValue.id)
                        }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={selectedOfficeLocal ? "Kohde" : "Valitse kohde"}
                                variant="outlined"
                                fullWidth
                            />
                        )}
                        sx={{ ...autoCompleteFieldMargins }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                    />
                </FormControl>

                <FormControl>
                    <Autocomplete
                        options={propertyOptions}
                        getOptionLabel={option => option.name || ""}
                        value={selectedPropertyLocal}
                        onChange={(event, newValue) => {
                            setSelectedPropertyLocal(newValue);
                            if (newValue) {
                                dispatch(fetchReservedDates(newValue.id));
                            }
                        }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={selectedPropertyLocal ? "Vuokratila" : "Valitse vuokratila"}
                                variant="outlined"
                                fullWidth />
                        )}
                        sx={{ ...autoCompleteFieldMargins }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        disabled={!selectedOfficeLocal}
                    />
                </FormControl>
                <br />

                <FormControl>
                    <Autocomplete
                        options={customers}
                        getOptionLabel={option => option.name || ""}
                        value={selectedCustomer}
                        onChange={(event, newValue) => setSelectedCustomer(newValue)}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={selectedCustomer ? "Asiakas" : "Valitse asiakas"}
                                variant="outlined"
                                fullWidth />
                        )}
                        sx={{ ...autoCompleteFieldMargins }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                    />
                </FormControl>
                <br />

                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            key={reservedDates.length}
                            disabled={!selectedCustomer || !selectedOfficeLocal || !selectedPropertyLocal}
                            disablePast={true}
                            label="Varauksen alku"
                            shouldDisableDate={shouldDisableStartDate}
                            onChange={(newValue) => {
                                setStartDate(newValue);
                                if (endDate && newValue && newValue.isAfter(endDate, "day")) {
                                    setEndDate(null); // reset end date if invalid
                                }
                            }}
                            value={startDate}
                            renderInput={(params) => <TextField {...params} />}
                            sx={{ ...autoCompleteFieldMargins, marginRight: "10px" }}
                        />
                    </LocalizationProvider>
                </FormControl>

                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            disabled={!startDate}
                            label="Varauksen loppu"
                            onChange={setEndDate}
                            shouldDisableDate={shouldDisableEndDate}
                            value={endDate}
                            renderInput={(params) => <TextField {...params} />}
                            sx={{ ...autoCompleteFieldMargins }}
                        />
                    </LocalizationProvider>
                </FormControl>
                <br />

                <FormControl>
                    <Autocomplete
                        disabled={!endDate}
                        options={deviceOptions}
                        getOptionLabel={option => option.name}
                        value={selectedDevice}
                        onChange={(event, newValue) => setSelectedDevice(newValue)}
                        renderInput={params => (
                            <TextField {...params} label="Vuokralaitteet" />
                        )}
                        sx={{ ...autoCompleteFieldMargins }}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    />
                </FormControl>

                <FormControl>
                    <Autocomplete
                        disabled={!endDate}
                        options={serviceOptions}
                        getOptionLabel={option => option.name}
                        value={selectedService}
                        onChange={(event, newValue) => setSelectedService(newValue)}
                        renderInput={params => (
                            <TextField {...params} label="Lisäpalvelut" />
                        )}
                        sx={{ ...autoCompleteFieldMargins }}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    />
                </FormControl>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ mb: 1 }}>
                    Vuokrattavat laitteet ja lisäpalvelut
                </Typography>

                <DataGrid
                    rows={itemRows}
                    columns={[
                        {
                            field: "type",
                            headerName: "Tyyppi",
                            width: 80,
                            renderCell: (params) => params.row.type === "device" ? "Laite" : "Palvelu"
                        },
                        { field: "name", headerName: "Nimi", flex: 1 },
                        { field: "price", headerName: "Hinta", width: 80, editable: true },
                        { field: "vat", headerName: "ALV %", width: 80 },
                        { field: "qty", headerName: "Määrä", width: 80, editable: true },
                        { field: "discount", headerName: "Alennus %", width: 100, editable: true },
                        {
                            field: "total",
                            headerName: "Yhteensä",
                            width: 120,
                            renderCell: (params) => {
                                const row = params.row;
                                if (!row) return "";

                                const price = parseFloat(row.price) || 0;
                                const qty = parseFloat(row.qty) || 0;
                                const discount = parseFloat(row.discount) || 0;
                                const vat = parseFloat(row.vat) || 0;

                                let total = (price + (vat / 100 * price)) * qty;

                                if (discount !== 0) {
                                    total = total - (discount / 100 * total);
                                }

                                return (
                                    <span>{total.toFixed(2)} €</span>
                                );
                            }
                        },
                        {
                            field: "actions",
                            headerName: "Poista",
                            width: 80,
                            renderCell: (params) => (
                                <Button
                                    color="error"
                                    size="small"
                                    onClick={() => handleRowDelete(params.id)}
                                >
                                    <DeleteIcon />
                                </Button>
                            )
                        }
                    ]}
                    autoHeight
                    hideFooter
                    disableSelectionOnClick
                    processRowUpdate={handleRowEdit}
                    sx={{
                        marginBottom: "20px",
                        minHeight: "175px",
                    }}
                />
            </DialogContent>

            <DialogActions sx={{ display: "flex" }}>
                <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    disabled={loading}
                    onClick={() => {
                        setSelectedOfficeLocal(null)
                        setSelectedPropertyLocal(null)
                        setSelectedCustomer(null)
                        setStartDate(null)
                        setEndDate(null)
                        setItemRows([])
                    }}
                    sx={{ ...leftButton }}>
                    Tyhjennä kentät
                </Button>

                <Box sx={{ flexGrow: 1 }} />

                <Button
                    size="small"
                    startIcon={<CloseIcon />}
                    color="secondary"
                    variant="outlined"
                    disabled={loading}
                    onClick={() => {

                        onHide();
                    }}
                    sx={{ ...middleButton }}>
                    Peruuta
                </Button>

                <Button
                    size="small"
                    startIcon={<SaveIcon />}
                    color="success"
                    loading={loading}
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !endDate}
                    sx={{ ...rightButton }}>
                    Tallenna
                </Button>
            </DialogActions>
        </Dialog>
    )
}
