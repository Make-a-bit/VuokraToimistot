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

/**
 * Reservation page component.
 * @returns {JSX.Element}
 */
const Reservation = () => {
    /** @type {import('react-redux').Dispatch<any>} */
    const dispatch = useDispatch();

    /**
     * errorMessage and successMessage are strings or null, from UI state.
     * @type {{ errorMessage: string|null, successMessage: string|null }}
     */
    const { errorMessage, successMessage } = useSelector(state => state.ui);

    /**
     * offices is an array of office objects.
     * @type {Array<{ id: number, name: string }>}
     */
    const offices = useSelector(state => state.offices.offices);

    /**
     * properties is an array of property objects.
     * @type {Array<{ id: number, name: string, officeId: number }>}
     */
    const properties = useSelector(state => state.properties.properties);

    /**
     * allReservations is an array of reservation objects.
     * @type {Array<Object>}
     */
    const allReservations = useSelector(state => state.reservations.reservations);

    /**
     * reservedDates is an array of date strings.
     * @type {Array<string>}
     */
    const reservedDates = useSelector(state => state.reservations.reservedDates);

    /**
     * showAddReservation controls AddReservation modal visibility.
     * @type {[boolean, Function]}
     */
    const [showAddReservation, setShowAddReservation] = useState(false);

    /**
     * showEditModal controls EditReservationModal visibility.
     * @type {[boolean, Function]}
     */
    const [showEditModal, setShowEditModal] = useState(false);

    /**
     * showConfirm controls ConfirmModal visibility.
     * @type {[boolean, Function]}
     */
    const [showConfirm, setShowConfirm] = useState(false);

    /**
     * selectedOffice is the currently selected office or null.
     * @type {[{ id: number, name: string }|null, Function]}
     */
    const [selectedOffice, setSelectedOffice] = useState(null);

    /**
     * selectedProperty is the currently selected property or null.
     * @type {[{ id: number, name: string, officeId: number }|null, Function]}
     */
    const [selectedProperty, setSelectedProperty] = useState(null);

    /**
     * selectedReservation is the currently selected reservation or null.
     * @type {[Object|null, Function]}
     */
    const [selectedReservation, setSelectedReservation] = useState(null);

    /**
     * modalOffice is the office passed to AddReservation modal.
     * @type {[{ id: number, name: string }|null, Function]}
     */
    const [modalOffice, setModalOffice] = useState(null);

    /**
     * modalProperty is the property passed to AddReservation modal.
     * @type {[{ id: number, name: string, officeId: number }|null, Function]}
     */
    const [modalProperty, setModalProperty] = useState(null);

    /**
     * propertyOptions is a filtered array of properties for the selected office.
     * @type {Array<{ id: number, name: string, officeId: number }>}
     */
    const propertyOptions = useMemo(() =>
        properties.filter(
            p => selectedOffice && p.officeId === selectedOffice.id
        ),
        [properties, selectedOffice]
    );

    /**
     * officePropertyIds is an array of property ids for the selected office.
     * @type {Array<number>}
     */
    const officePropertyIds = selectedOffice
        ? properties.filter(p => p.officeId === selectedOffice.id).map(p => p.id)
        : [];

    /**
     * mappedReservations flattens nested reservation fields for DataGrid.
     * @type {Array<Object>}
     */
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

    /**
     * reservations is a filtered array of reservations based on selection.
     * @type {Array<Object>}
     */
    const reservations = mappedReservations.filter(r => {
        if (selectedProperty) {
            return r.propertyId === selectedProperty.id;
        } else if (selectedOffice) {
            return officePropertyIds.includes(r.propertyId);
        }
        return true;
    });

    /**
     * Handles row click in DataGrid.
     * @param {Object} params - DataGrid row params.
     * @returns {void}
     */
    const handleRowClick = (params) => {
        setSelectedReservation(params.row);
        dispatch(fetchReservedDates(params.row.propertyId));
        setShowEditModal(true);
    };

    /**
     * Checks if a date should be disabled in the calendar.
     * @param {import("dayjs").Dayjs} date
     * @returns {boolean}
     */
    const disableDates = (date) =>
        reservedDates.some((d) => dayjs(d).isSame(date, "day"));

    /**
     * Columns configuration for DataGrid.
     * @type {Array<Object>}
     */
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

            <div
                style={{ height: "auto", width: "100%" }}
                inert={showAddReservation || showEditModal || showConfirm ? "true" : undefined}
            >
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
            </div>

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
                            Haluatko varmasti poistaa varauksen?
                            <br /><br />
                            <span>Asiakas: <strong>{selectedReservation.customerName}</strong></span>
                            <br />
                            <span>Kohde: <strong>{selectedReservation.officeName}</strong></span>
                            <br />
                            <span>Vuokratila: <strong>{selectedReservation.propertyName}</strong></span>
                            <br />
                            Alku: <strong>{dayjs(selectedReservation.startDate).locale('fi').format('DD-MM-YYYY')}</strong><br />
                            Loppu: <strong>{dayjs(selectedReservation.endDate).locale('fi').format('DD-MM-YYYY')}</strong>
                        </>
                    ) : "Haluatko varmasti poistaa tämän varauksen?"
                }
                title={
                    selectedReservation
                        ? `Poista varaus #${selectedReservation.id}`
                        : "Poista varaus"
                }
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

export default Reservation;