import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addReservation, fetchReservedDates,
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
import dayjs from "dayjs";

export const AddReservation = ({ show, onHide }) => {
    const dispatch = useDispatch();
    const { errorMessage, successMessage } = useSelector(state => state.ui);
    const loading = useSelector(state => state.ui.loadingState);
    const customers = useSelector(state => state.customers.customers);
    const offices = useSelector(state => state.offices.offices);
    const properties = useSelector(state => state.properties.properties);
    const devices = useSelector(state => state.devices.devices);
    const services = useSelector(state => state.services.services);
    const reservedDates = useSelector(state => state.reservations.reservedDates);
    const selectedOffice = useSelector(state => state.reservations.selectedReservationOffice);
    const selectedOfficeProperty = useSelector(state => state.reservations.selectedReservationOfficeProperty);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [itemRows, setItemRows] = useState([]);

    useEffect(() => {
        if (selectedDevice && selectedDevice.id !== undefined) {
            if (!itemRows.some(row => row.type === "device" && row.itemId === selectedDevice.id)) {
                setItemRows(prev => [
                    ...prev,
                    {
                        id: `device-${selectedDevice.id}`,
                        itemId: selectedDevice.id,
                        name: selectedDevice.name,
                        price: selectedDevice.price,
                        vat: selectedDevice.vat,
                        qty: getDuration(),
                        discount: 0,
                        type: "device"
                    }
                ]);
            }
            setSelectedDevice(null); // Clear the field after adding
        }
    }, [selectedDevice]);

    useEffect(() => {
        if (selectedService && selectedService.id !== undefined) {
            if (!itemRows.some(row => row.type === "service" && row.itemId === selectedService.id)) {
                setItemRows(prev => [
                    ...prev,
                    {
                        id: `service-${selectedService.id}`,
                        itemId: selectedService.id,
                        name: selectedService.name,
                        price: selectedService.price,
                        vat: selectedService.vat,
                        qty: getDuration(),
                        discount: 0,
                        type: "service"
                    }
                ]);
            }
            setSelectedService(null); // Clear the field after adding
        }
    }, [selectedService]);

    useEffect(() => {
        if (!startDate || !endDate) return;

        const days = getDuration(startDate, endDate);
        setItemRows((prev) =>
            prev.map((row) => ({
                ...row,
                qty: days,
            }))
        );
    }, [startDate, endDate]);

    const deviceOptions = useMemo(() =>
        devices.filter(
            d => !itemRows.some(row => row.type === "device" && row.itemId === d.id)
        ), [devices, itemRows]);

    const serviceOptions = useMemo(() =>
        services.filter(
            s => !itemRows.some(row => row.type === "service" && row.itemId === s.id)
        ), [services, itemRows]
    );

    const getDuration = () => {
        if (!startDate || !endDate) return 1;
        return endDate.diff(startDate, 'day') + 1; // +1 for inclusive range
    };

    // Handle datagrid cell edit
    const handleRowEdit = (newRow) => {
        setItemRows(itemRows.map(row =>
            row.id === newRow.id ? { ...row, ...newRow } : row
        ));
        return newRow;
    };

    // Remove item from datagrid
    const handleRowDelete = (id) => {
        setItemRows(itemRows.filter(row => row.id !== id));
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
            propertyId: selectedOfficeProperty.id,
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
                dispatch(fetchReservedDates(selectedOfficeProperty.id));
                onHide();
            })
    }

    // convert reserved date values to dayjs
    const reservedDayjsDates = reservedDates
        .map((d) => dayjs(d))
        .filter((d) => d.isValid());

    // Disable all reservedDates globally for start picker
    const shouldDisableStartDate = (date) =>
        reservedDayjsDates.some((d) => d.isSame(date, "day"));

    const nextReservedAfterStart = startDate
        ? reservedDayjsDates.find((d) => d.isAfter(startDate, "day"))
        : null;

    const shouldDisableEndDate = (date) => {
        if (reservedDayjsDates.some((d) => d.isSame(date, "day"))) return true;
        if (
            nextReservedAfterStart &&
            (date.isSame(nextReservedAfterStart, "day") || date.isAfter(nextReservedAfterStart, "day"))
        )
            return true;
        if (startDate && date.isBefore(startDate, "day")) return true;
        return false;
    };

    const fieldMargins =
    {
        marginBottom: "10px",
        marginRight: "10px",
        minWidth: "350px",
    }

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
                        value={selectedOffice}
                        onChange={(event, newValue) => {
                            dispatch(setOffice(newValue));
                            if (newValue) {
                                dispatch(fetchProperties(newValue.id));
                                dispatch(setProperty(null));
                                dispatch(fetchDevices(newValue.id));
                                dispatch(fetchServices(newValue.id));
                            }
                        }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={selectedOffice ? "Kohde" : "Valitse kohde"}
                                variant="outlined"
                                fullWidth
                            />
                        )}
                        sx={{ ...fieldMargins }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                    />
                </FormControl>

                <FormControl>
                    <Autocomplete
                        options={properties}
                        getOptionLabel={option => option.name || ""}
                        value={selectedOfficeProperty}
                        onChange={(event, newValue) => {
                            dispatch(setProperty(newValue));
                            if (newValue) {
                                dispatch(fetchReservedDates(newValue.id));
                            }
                        }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={selectedOfficeProperty ? "Vuokratila" : "Valitse vuokratila"}
                                variant="outlined"
                                fullWidth />
                        )}
                        sx={{ ...fieldMargins }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        disabled={!selectedOffice}
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
                        sx={{ ...fieldMargins }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                    />
                </FormControl>
                <br />

                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            key={reservedDates.length}
                            disabled={!selectedCustomer || !selectedOffice || !selectedOfficeProperty}
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
                            sx={{ ...fieldMargins, marginRight: "10px" }}
                        />
                    </LocalizationProvider>
                </FormControl>

                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            key={reservedDates.length}
                            defaultValue={startDate}
                            disabled={!startDate}
                            label="Varauksen loppu"
                            onChange={setEndDate}
                            shouldDisableDate={shouldDisableEndDate}
                            value={endDate}
                            renderInput={(params) => <TextField {...params} />}
                            sx={{ ...fieldMargins }}
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
                            <TextField {...params} label="Lisää laite" />
                        )}
                        sx={{ ...fieldMargins }}
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
                        sx={{ ...fieldMargins }}
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

            <DialogActions>
                <Button
                    size="small"
                    startIcon={<CloseIcon />}
                    color="secondary"
                    variant="outlined"
                    disabled={loading}
                    onClick={onHide}
                    sx={{ marginBottom: "10px" }}>
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
                    sx={{ marginBottom: "10px", marginRight: "20px" }}>
                    Tallenna
                </Button>
            </DialogActions>
        </Dialog>
    )
}
