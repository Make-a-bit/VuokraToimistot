import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Autocomplete, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, FormControl, FormControlLabel
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { updateReservation, fetchReservations, fetchReservedDates } from "../redux/actions/reservationActions";
import { fetchCustomers } from "../redux/actions/customerActions";
import { fetchDevices } from "../redux/actions/deviceActions";
import { fetchOffices } from "../redux/actions/officeActions";
import { fetchProperties } from "../redux/actions/propertyActions";
import { fetchServices } from "../redux/actions/serviceActions";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from "@mui/icons-material/Save";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getReservationDateUtils } from "../utils/reservationDateUtils";
import { getDuration, addItemRow, updateRowsQty, deleteRow, updateRow } from "../utils/reservationUtils";
import { middleButton, rightButton } from "../utils/fieldMarginals";
import dayjs from "../../src/dayjs-setup";

export const EditReservationModal = ({ show, onHide, reservation }) => {
    const dispatch = useDispatch();
    const customers = useSelector(state => state.customers.customers);
    const devices = useSelector(state => state.devices.devices);
    const offices = useSelector(state => state.offices.offices);
    const properties = useSelector(state => state.properties.properties);
    const reservedDates = useSelector(state => state.reservations.reservedDates);
    const services = useSelector(state => state.services.services);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [selectedOffice, setSelectedOffice] = useState(null)
    const [selectedOfficeProperty, setSelectedOfficeProperty] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [invoiced, setInvoiced] = useState(false);
    const [itemRows, setItemRows] = useState([]);

    const {
        shouldDisableStartDate,
        shouldDisableEndDate,
    } = getReservationDateUtils(reservedDates, reservation, startDate);

    useEffect(() => {
        dispatch(fetchCustomers());
        dispatch(fetchDevices());
        dispatch(fetchOffices());
        dispatch(fetchReservations());
        dispatch(fetchProperties());
        dispatch(fetchServices());
    }, [dispatch]);

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
    }, [startDate, endDate])

    const deviceOptions = useMemo(() =>
        devices.filter(
            d => !itemRows.some(row => row.type === "device" && row.itemId === d.id)
        ), [devices, itemRows]);

    const serviceOptions = useMemo(() =>
        services.filter(
            s => !itemRows.some(row => row.type === "service" && row.itemId === s.id)
        ), [services, itemRows]
    );

    const handleRowEdit = (newRow) => {
        setItemRows(prev => updateRow(prev, newRow));
        return newRow;
    };

    const handleRowDelete = (id) => {
        setItemRows(prev => deleteRow(prev, id));
    };

    useEffect(() => {
        if (reservation) {
            setStartDate(reservation.startDate ? dayjs(reservation.startDate) : null);
            setEndDate(reservation.endDate ? dayjs(reservation.endDate) : null);

            // Set selected property
            const foundProperty = properties.find(p => p.id === reservation.propertyId);
            setSelectedOfficeProperty(foundProperty || null);

            // Set selected office based on the property's officeId
            if (foundProperty) {
                const foundOffice = offices.find(o => o.id === foundProperty.officeId);
                setSelectedOffice(foundOffice || null);
            } else {
                setSelectedOffice(null);
            }

            setInvoiced(!!reservation.invoiced);

            // Set selected customer
            const foundCustomer = customers.find(c => c.id === reservation.customerId);
            setSelectedCustomer(foundCustomer || null);

            // Map devices and services to DataGrid rows
            const deviceRows = (reservation.devices || []).map((d, idx) => ({
                id: `device-${d.id ?? idx}`,
                type: "device",
                itemId: d.id,
                name: d.name,
                price: d.price,
                vat: d.vat,
                qty: d.qty ?? 1,
                discount: d.discount ?? 0,
            }));

            const serviceRows = (reservation.services || []).map((s, idx) => ({
                id: `service-${s.id ?? idx}`,
                type: "service",
                itemId: s.id,
                name: s.name,
                price: s.price,
                vat: s.vat,
                qty: s.qty ?? 1,
                discount: s.discount ?? 0,
            }));

            setItemRows([...deviceRows, ...serviceRows]);
        }
    }, [reservation, offices, properties, customers]);

    const handleSave = (e) => {
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

        const updatedReservation = {
            id: reservation.id,
            propertyId: selectedOfficeProperty.id,
            customerId: selectedCustomer.id,
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            devices,
            services,
            invoiced: invoiced
        };

        dispatch(updateReservation(updatedReservation))
            .then(() => {
                dispatch(fetchReservations());
                dispatch(fetchReservedDates(reservation.propertyId));
                onHide();
            });
    };

    if (!reservation) return null;

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
            <DialogTitle>Muokkaa varausta</DialogTitle>
            <DialogContent dividers>
                <FormControl>
                    <Autocomplete
                        options={offices}
                        value={selectedOffice}
                        onChange={(event, newValue) => {
                            setSelectedOffice(newValue)
                            if (newValue) {
                                setSelectedOfficeProperty(null);
                            }
                        }}
                        getOptionLabel={option => option.name || ""}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={selectedOffice ? "Kohde" : "Valitse kohde"}
                                variant="outlined"
                                fullWidth
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        sx={{ ...fieldMargins }}
                    />
                </FormControl>

                <FormControl>
                    <Autocomplete
                        options={
                            selectedOffice
                                ? properties.filter(p => p.officeId === selectedOffice.id)
                                : []
                        }
                        onChange={(event, newValue) => setSelectedOfficeProperty(newValue)}
                        getOptionLabel={option => option.name || ""}
                        value={selectedOfficeProperty}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={selectedOfficeProperty ? "Vuokratila" : "Valitse vuokratila"}
                                variant="outlined"
                                fullWidth />
                        )}
                        sx={{ ...fieldMargins }}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
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
                            label="Varauksen alku"
                            onChange={(newValue) => {
                                setStartDate(newValue);
                                setEndDate(null); // Always reset end date when start changes
                            }}
                            shouldDisableDate={shouldDisableStartDate}
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
                            label="Varauksen loppu"
                            disabled={!startDate}
                            onChange={setEndDate}
                            shouldDisableDate={shouldDisableEndDate}
                            value={endDate}
                            renderInput={(params) => <TextField {...params} />}
                            sx={{ ...fieldMargins }}
                        />
                    </LocalizationProvider>
                </FormControl>

                <FormControl>
                    <Autocomplete
                        disabled={!endDate}
                        options={
                            selectedOffice ?
                                deviceOptions.filter(d => d.officeId === selectedOffice.id)
                                : []
                        }
                        getOptionLabel={option => option.name}
                        value={selectedDevice}
                        onChange={(event, newValue) => setSelectedDevice(newValue)}
                        renderInput={params => (
                            <TextField {...params} label="Vuokralaitteet" />
                        )}
                        sx={{ ...fieldMargins }}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    />
                </FormControl>

                <FormControl>
                    <Autocomplete
                        disabled={!endDate}
                        options={
                            selectedOffice
                                ? serviceOptions.filter(s => s.officeId === selectedOffice.id)
                                : []
                        }
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
                <br />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={invoiced}
                            onChange={(event) => setInvoiced(event.target.checked)}
                        />
                    }
                    label="Laskutettu"
                />

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
                    onClick={() => {
                        onHide();
                    }}
                    color="secondary"
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    sx={{ ...middleButton }}
                >Peruuta</Button>
                <Button
                    size="small"
                    startIcon={<SaveIcon/> }
                    onClick={handleSave}
                    color="primary"
                    variant="contained"
                    sx={{ ...rightButton }}
                >Tallenna</Button>
            </DialogActions>
        </Dialog>
    );
};
