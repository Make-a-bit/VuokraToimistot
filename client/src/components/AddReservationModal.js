import React, { useState, useRef } from "react";
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
    DialogContent, FormControl, InputLabel, MenuItem, Select, TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);
    const [selectedDeviceIds, setSelectedDeviceIds] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const firstInputRef = useRef(null);

    const handlePropertyChange = (e) => {
        const property = properties.find(p => p.id === e.target.value);
        dispatch(setProperty(property));
        if (property) {
            dispatch(fetchReservedDates(property.id));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const reservation = {
            propertyId: selectedOfficeProperty.id,
            customerId: selectedCustomer.id,
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            devices: selectedDeviceIds.map(d => ({
                id: d.id,
                price: d.price,
                vat: d.vat,
                qty: endDate.diff(startDate, "day") + 1,
                discount: d.discount
            })),
            services: selectedServiceIds.map(s => ({
                id: s.id,
                price: s.price,
                vat: s.vat,
                qty: endDate.diff(startDate, "day") + 1,
                discount: s.discount
            })),
            invoiced: false
        };

        dispatch(addReservation(reservation))
            .then(() => {
                setSelectedCustomer(null);
                setStartDate(null);
                setEndDate(null);
                setSelectedDeviceIds([]);
                setSelectedServiceIds([]);
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
        minWidth: "350px",
        }
    
    return (
        <Dialog
            open={show}
            onClose={onHide}
            slotProps={{
                transition: {
                    onEntered: () => {
                        if (firstInputRef.current) {
                            firstInputRef.current.focus();
                        }
                    }
                },
            }}>

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
                <br />

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

                <Autocomplete
                    multiple
                    disabled={!endDate}
                    disableCloseOnSelect
                    options={devices}
                    getOptionLabel={(option) => option.name}
                    value={selectedDeviceIds}
                    onChange={(event, newValue) => setSelectedDeviceIds(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Laitteet" />
                    )}
                    sx={{ ...fieldMargins }}
                />

                <Autocomplete
                    multiple
                    disabled={!endDate}
                    disableCloseOnSelect
                    options={services}
                    getOptionLabel={(option) => option.name}
                    value={selectedServiceIds}
                    onChange={(event, newValue) => setSelectedServiceIds(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Lisäpalvelut" />
                    )}
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
