import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addReservation, fetchReservedDates,
    setOffice, setProperty
} from "../redux/actions/reservationActions";
import { fetchDevices } from "../redux/actions/deviceActions";
import { fetchProperties } from "../redux/actions/propertyActions";
import { fetchServices } from "../redux/actions/serviceActions";
import { Autocomplete, Box, Button, FormControl, TextField } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AddReservation } from "../components/AddReservationModal";
import dayjs from "dayjs";

const Reservation = () => {
    const dispatch = useDispatch();
    const { errorMessage, successMessage } = useSelector(state => state.ui);
    const loading = useSelector(state => state.ui.loadingState);
    const offices = useSelector(state => state.offices.offices);
    const properties = useSelector(state => state.properties.properties);
    const reservedDates = useSelector(state => state.reservations.reservedDates);
    const selectedOffice = useSelector(state => state.reservations.selectedReservationOffice);
    const selectedOfficeProperty = useSelector(state => state.reservations.selectedReservationOfficeProperty);
    const [showAddReservation, setShowAddReservation] = useState(false);

    const handleOfficeChange = (event, newValue) => {
        const simplifiedOffice = newValue
            ? { id: newValue.id, name: newValue.name }
            : null;

        dispatch(setOffice(simplifiedOffice));

        if (simplifiedOffice) {
            dispatch(fetchProperties(simplifiedOffice.id));
            dispatch(setProperty(null));
            dispatch(fetchDevices(simplifiedOffice.id));
            dispatch(fetchServices(simplifiedOffice.id));
        }
    };

    const handlePropertyChange = (event, newValue) => {
        const simplifiedProperty = newValue
            ? { id: newValue.id, name: newValue.name }
            : null;

        dispatch(setProperty(simplifiedProperty));

        if (simplifiedProperty) {
            dispatch(fetchReservedDates(simplifiedProperty.id));
        }
    };

    const disableDates = (date) =>
        reservedDates.some((d) => dayjs(d).isSame(date, "day"));

    return (
        <>
            <Button
                variant="contained"
                onClick={() => setShowAddReservation(true)}
                sx={{ marginTop: "10px" }}
            >
                Tee uusi varaus
            </Button>

            <Button
                variant="outlined"
                color="secondary"
                disabled={!selectedOffice && !selectedOfficeProperty}
                onClick={() => {
                    dispatch(setOffice(null))
                    dispatch(setProperty(null))
                }}
                sx={{ marginLeft: "10px", marginTop: "10px" }}
            >
            Tyhjennä kentät
            </Button>

            <AddReservation
                show={showAddReservation}
                onHide={() => setShowAddReservation(false)}
                action={addReservation}
            />

            <Box sx={{ marginTop: "20px", gap: 2, display: "flex", alignItems: "flex-start" }}>
                <FormControl>
                    <Autocomplete
                        options={Array.isArray(offices) ? offices : []}
                        getOptionLabel={option => option?.name || ""}
                        value={offices.find(o => o.id === selectedOffice?.id) || null}
                        onChange={handleOfficeChange}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        renderInput={params => (
                            <TextField {...params} label="Toimisto" variant="outlined" />
                        )}
                        sx={{ minWidth: "250px" }}
                    />
                </FormControl>

                <FormControl>
                    <Autocomplete
                        options={Array.isArray(properties) ? properties : []}
                        getOptionLabel={option => option?.name || ""}
                        value={properties.find(p => p.id === selectedOfficeProperty?.id) || null}
                        onChange={handlePropertyChange}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        renderInput={params => (
                            <TextField {...params} label="Vuokratila" variant="outlined" />
                        )}
                        disabled={!selectedOffice}
                        sx={{ minWidth: "250px" }}
                    />
                </FormControl>

                {selectedOfficeProperty ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ flex: "none"} }>
                    <DateCalendar
                        disablePast
                        shouldDisableDate={disableDates}
                        sx={{ border: "solid 1px black", minWidth: "250px" }}
                        />
                    </Box>
                    </LocalizationProvider>) : null }
            </Box>

            <br />
            <br />


        </>
    )
}

export default Reservation;