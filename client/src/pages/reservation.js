import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addReservation, deleteReservation, fetchReservations, fetchReservedDates
} from "../redux/actions/reservationActions";
import { Alert, Autocomplete, Box, Button, FormControl, IconButton, Snackbar, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dataGridSx from "../utils/dataGridSx";
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AddReservation } from "../components/ReservationModal";
import { EditReservationModal } from "../components/EditReservationModal";
import ConfirmModal from "../components/ConfirmModal";
import dayjs from "../../src/dayjs-setup";
import useAutoClearMessages from "../hooks/autoClearMessages";

const Reservation = () => {
    const dispatch = useDispatch();
    const { errorMessage, successMessage } = useSelector(state => state.ui);
    const loading = useSelector(state => state.ui.loadingState);
    const offices = useSelector(state => state.offices.offices);
    const properties = useSelector(state => state.properties.properties);
    const allReservations = useSelector(state => state.reservations.reservations);
    const reservedDates = useSelector(state => state.reservations.reservedDates);

    const [showAddReservation, setShowAddReservation] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [modalOffice, setModalOffice] = useState(null);
    const [modalProperty, setModalProperty] = useState(null);
    const [isEditable, setIsEditable] = useState(false);

    console.log(allReservations)

    const propertyOptions = useMemo(() =>
        properties.filter(
            p => selectedOffice && p.officeId === selectedOffice.id
        ),
        [properties, selectedOffice]
    );

    const officePropertyIds = selectedOffice
        ? properties.filter(p => p.officeId === selectedOffice.id).map(p => p.id)
        : [];

    // Map nested objects to flat fields for DataGrid
    const mappedReservations = allReservations.map(r => ({
        ...r,
        customerName: r.customer?.name || "",
        officeName: r.office?.name || "",
        propertyName: r.property?.name || "",
        propertyId: r.property?.id || r.propertyId, 
        startDate: r.startDate,
        endDate: r.endDate,
        invoiced: r.invoiced,
        id: r.id 
    }));

    const reservations = mappedReservations.filter(r => {
        if (selectedProperty) {
            return r.propertyId === selectedProperty.id;
        } else if (selectedOffice) {
            return officePropertyIds.includes(r.propertyId);
        }
        return true;
    });

    const handleRowClick = (params) => {
        setSelectedReservation(params.row);
        dispatch(fetchReservedDates(params.row.propertyId));
        setIsEditable(!params.row.invoiced);
        setShowEditModal(true);
    };

    const disableDates = (date) =>
        reservedDates.some((d) => dayjs(d).isSame(date, "day"));

    const reservationColumns = [
        { field: "id", headerName: "Varaus #", width: 75 },
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

    useAutoClearMessages(errorMessage, successMessage);

    return (
        <>
            {errorMessage &&
                <Snackbar
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    open={Boolean(errorMessage)}
                    autoHideDuration={6000}>
                    <Alert
                        color="warning"
                        severity="warning"
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

            <Button
                variant="contained"
                onClick={() => {
                    setModalOffice(selectedOffice)
                    setModalProperty(selectedProperty)
                    setShowAddReservation(true)
                }}
                sx={{ marginTop: "10px" }}
            >
                Tee uusi varaus
            </Button>

            <Button
                variant="outlined"
                color="secondary"
                disabled={!selectedOffice && !selectedProperty}
                onClick={() => {
                    setSelectedOffice(null)
                    setSelectedProperty(null)
                    setModalOffice(null)
                    setModalProperty(null)
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
                office={modalOffice}
                property={modalProperty}
            />

            <EditReservationModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                reservation={selectedReservation}
            />

            <Box sx={{ marginTop: "20px", gap: 2, display: "flex", alignItems: "flex-start" }}>
                <FormControl>
                    <Autocomplete
                        options={Array.isArray(offices) ? offices : []}
                        getOptionLabel={option => option?.name || ""}
                        value={selectedOffice}
                        onChange={(event, newValue) => {
                            setSelectedOffice(newValue)
                            if (newValue) {
                                setSelectedProperty(null);
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
                        options={propertyOptions}
                        getOptionLabel={option => option?.name || ""}
                        value={properties.find(p => p.id === selectedProperty?.id) || null}
                        onChange={(event, newValue) => {
                            setSelectedProperty(newValue);

                            if (newValue) {
                                dispatch(fetchReservedDates(newValue.id));
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

                {selectedProperty ? (
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
                onConfirm={async () => {
                    await dispatch(deleteReservation(selectedReservation))
                    await dispatch(fetchReservations())
                }}
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