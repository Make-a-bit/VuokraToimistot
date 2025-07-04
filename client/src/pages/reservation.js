import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addReservation, fetchReservedDates,
    setOffice, setProperty
} from "../redux/actions/reservationActions";
import { Autocomplete, Box, Button, FormControl, IconButton, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dataGridSx from "../utils/dataGridSx";
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchDevices } from "../redux/actions/deviceActions";
import { fetchProperties } from "../redux/actions/propertyActions";
import { fetchServices } from "../redux/actions/serviceActions";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AddReservation } from "../components/AddReservationModal";
import ConfirmModal from "../components/ConfirmModal";
import dayjs from "dayjs";

const Reservation = () => {
    const dispatch = useDispatch();
    const { errorMessage, successMessage } = useSelector(state => state.ui);
    const loading = useSelector(state => state.ui.loadingState);
    const offices = useSelector(state => state.offices.offices);
    const properties = useSelector(state => state.properties.properties);
    const allReservations = useSelector(state => state.reservations.reservations);
    const reservedDates = useSelector(state => state.reservations.reservedDates);
    const selectedOffice = useSelector(state => state.reservations.selectedReservationOffice);
    const selectedOfficeProperty = useSelector(state => state.reservations.selectedReservationOfficeProperty);
    const [showAddReservation, setShowAddReservation] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isEditable, setIsEditable] = useState(false);

    const officePropertyIds = selectedOffice
        ? properties.filter(p => p.officeId === selectedOffice.id).map(p => p.id)
        : [];

    const reservations = allReservations.filter(r => {
        if (selectedOfficeProperty) {
            return r.propertyId === selectedOfficeProperty.id;
        } else if (selectedOffice) {
            return officePropertyIds.includes(r.propertyId);
        }
        return true;
    });

    const handleRowClick = (params) => {
        setSelectedReservation(params.row);
        setIsEditable(!params.row.invoiced); // editable if invoiced is false
        setShowEditModal(true);
    };

    const handleDelete = (id) => {
        console.log("CLICK")

    };

    console.log(selectedReservation)


    const disableDates = (date) =>
        reservedDates.some((d) => dayjs(d).isSame(date, "day"));

    const reservationColumns = [
        { field: "customerName", headerName: "Asiakas", flex: 1 },
        { field: "officeName", headerName: "Kohde", flex: 1 },
        { field: "propertyName", headerName: "Vuokratila", flex: 1 },
        { field: "startDate", headerName: "Alku", flex: 0.75 },
        { field: "endDate", headerName: "Loppu", flex: 0.75 },
        { field: "invoiced", headerName: "Laskutettu", width: 100, type: "boolean" },
        {
            field: "remove", headerName: "Poista", width: 100, sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    color="error"
                    onClick={e => {
                        e.stopPropagation();
                        setSelectedReservation(params.row)
                        setShowConfirm(true);
                    }}
                    disabled={params.row.invoiced}
                >
                    <DeleteIcon />
                </IconButton>
            )
        }
    ];

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
                onHide={() =>
                    setShowAddReservation(false)
                }
                action={addReservation}
            />

            <Box sx={{ marginTop: "20px", gap: 2, display: "flex", alignItems: "flex-start" }}>
                <FormControl>
                    <Autocomplete
                        options={Array.isArray(offices) ? offices : []}
                        getOptionLabel={option => option?.name || ""}
                        value={offices.find(o => o.id === selectedOffice?.id) || null}
                        onChange={(event, newValue) => {
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
                        }}
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
                        onChange={(event, newValue) => {
                            const simplifiedProperty = newValue
                                ? { id: newValue.id, name: newValue.name }
                                : null;

                            dispatch(setProperty(simplifiedProperty));

                            if (simplifiedProperty) {
                                dispatch(fetchReservedDates(simplifiedProperty.id));
                            }
                        }}
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
                        <Box sx={{ flex: "none" }}>
                            <DateCalendar
                                disablePast
                                shouldDisableDate={disableDates}
                                sx={{ border: "solid 1px black", minWidth: "250px" }}
                            />
                        </Box>
                    </LocalizationProvider>) : null}
            </Box>
            <br />

            <DataGrid
                rows={reservations}
                columns={reservationColumns}
                autoHeight
                disableSelectionOnClick
                onRowClick={handleRowClick}
                sx={{
                    ...dataGridSx,
                    marginBottom: "20px",
                    minHeight: "175px",
                }}
            />

            <ConfirmModal
                onConfirm={handleDelete}
                onHide={() => {
                    setShowConfirm(false);
                    setSelectedReservation(null)
                }}
                show={showConfirm}
                cancelText={"Peruuta"}
                confirmText={"Poista"}
                message={
                    selectedReservation ? (
                        <>
                            Haluatko varmasti poistaa tämän varauksen?
                            <br />
                            <strong>{selectedReservation.customerName}</strong>
                            <br />
                            {selectedReservation.officeName}
                            <br />
                            {selectedReservation.propertyName}
                            <br />
                            Alku: {selectedReservation.startDate}<br />
                            Loppu: {selectedReservation.endDate}
                        </>
                    ) : "Haluatko varmasti poistaa tämän varauksen?"
                }
                title={"Poista varaus"}
            />
        </>
    )
}

export default Reservation;