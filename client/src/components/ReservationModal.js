import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addReservation, fetchReservations, fetchReservedDates,
    setOffice, setProperty
} from "../redux/actions/reservationActions";
import { createInvoice } from "../redux/actions/invoiceActions";
import {
    Autocomplete, Box, Button, Dialog, DialogTitle, DialogActions,
    DialogContent, Divider, FormControl, InputLabel, MenuItem, Select,
    TextField, Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
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
    const [description, setDescription] = useState("");

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

    useEffect(() => {
        if (selectedPropertyLocal) {
            // Find the property details
            const property = properties.find(p => p.id === selectedPropertyLocal.id);
            if (property) {
                // Check if property row already exists
                setItemRows(prev => {
                    const hasPropertyRow = prev.some(row => row.type === "property");
                    if (hasPropertyRow) {
                        // Update the property row if property changes
                        return prev.map(row =>
                            row.type === "property"
                                ? {
                                    ...row,
                                    name: property.name,
                                    price: property.price || 0,
                                    vat: property.vat || 0,
                                    qty: getDuration(startDate, endDate) || 1,
                                    discount: 0
                                }
                                : row
                        );
                    } else {
                        // Add new property row
                        return [
                            {
                                id: `property-${property.id}`,
                                type: "property",
                                itemId: property.id,
                                name: property.name,
                                price: property.price || 0,
                                vat: property.vat || 0,
                                qty: getDuration(startDate, endDate) || 1,
                                discount: 0
                            },
                            ...prev
                        ];
                    }
                });
            }
        } else {
            // Remove property row if property is deselected
            setItemRows(prev => prev.filter(row => row.type !== "property"));
        }
        // eslint-disable-next-line
    }, [selectedPropertyLocal, startDate, endDate, properties]);

    const totalSum = useMemo(() => {
        return itemRows.reduce((acc, row) => {
            const price = parseFloat(row.price) || 0;
            const qty = parseFloat(row.qty) || 0;
            const discount = parseFloat(row.discount) || 0;
            const vat = parseFloat(row.vat) || 0;

            const subtotal = price * qty;
            const discountedSubtotal = subtotal - ((discount / 100) * subtotal);
            const total = discountedSubtotal + ((vat / 100) * discountedSubtotal);

            return acc + total;
        }, 0);
    }, [itemRows]);

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

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

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
            property: { id: selectedPropertyLocal.id },
            customer: { id: selectedCustomer.id },
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            description: description,
            devices,
            services,
            invoiced: false
        };

        const result = await dispatch(addReservation(reservation))
        setSelectedOfficeLocal(null)
        setSelectedPropertyLocal(null)
        setSelectedCustomer(null);
        setStartDate(null);
        setEndDate(null);
        setDescription("");
        setItemRows([]);
        dispatch(fetchReservations());
        onHide();

        return result;
    }

    const handleInvoicing = async (e) => {
        e.preventDefault();

        const result = await handleSubmit();

        console.log("Reservation:", result)

        const services = itemRows
            .filter(row => row.type === "service" || row.type === "property")
            .map(s => ({
                id: s.itemId,
                price: s.price,
                vat: s.vat,
                qty: s.qty,
                discount: s.discount
            }));

        const devices = itemRows
            .filter(row => row.type === "device")
            .map(d => ({
                id: d.itemId,
                price: d.price,
                vat: d.vat,
                qty: d.qty,
                discount: d.discount
            }));

        const dateInvoiced = dayjs();

        const invoiceReservation = {
            id: result.id,
            property: { id: selectedPropertyLocal.id },
            customer: { id: selectedCustomer.id },
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            devices,
            services,
            invoiced: true,
            dateInvoiced: dateInvoiced.format("YYYY-MM-DD"),
            dueDate: dateInvoiced.add(14, "day").format("YYYY-MM-DD")
        };

        dispatch(createInvoice(invoiceReservation))
        setSelectedOfficeLocal(null)
        setSelectedPropertyLocal(null)
        setSelectedCustomer(null);
        setStartDate(null);
        setEndDate(null);
        setDescription("");
        setItemRows([]);
        dispatch(fetchReservations());
        onHide();
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
                        value={selectedOfficeLocal}
                        onChange={(event, newValue) => {
                            setSelectedOfficeLocal(newValue);
                            setSelectedPropertyLocal(null);
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

                <FormControl>
                    <TextField
                        label="Lisätiedot"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ ...autoCompleteFieldMargins, width: "710px" }}
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
                            width: 90,
                            renderCell: (params) => {
                                if (params.row.type === "device") return "Laite";
                                if (params.row.type === "service") return "Palvelu";
                                if (params.row.type === "property") return "Vuokratila";
                                return "";
                            }
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

                <Box sx={{ textAlign: "right", fontWeight: "bold" }}>
                    Laskutettavat yhteensä: {totalSum.toLocaleString("fi-FI", {
                        minimumFractionDigits: 2, maximumFractionDigits: 2
                    })} €
                </Box>

            </DialogContent>

            <DialogActions sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                padding: "20px"
            }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Button
                        size="small"
                        startIcon={<SaveIcon />}
                        color="success"
                        loading={loading}
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading || !endDate}
                        sx={{ marginBottom: "10px" }}
                        >
                        Tallenna
                    </Button>
                    <Button
                        size="small"
                        startIcon={<ReceiptLongIcon />}
                        color="success"
                        loading={loading}
                        variant="contained"
                        onClick={handleInvoicing}
                        disabled={loading || !endDate}
                        sx={{  }}
                    >
                        Tallenna ja laskuta
                    </Button>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Button
                    size="small"
                    startIcon={<ClearAllIcon />}
                    color="warning"
                    variant="contained"
                    disabled={loading}
                    onClick={() => {
                        setSelectedOfficeLocal(null)
                        setSelectedPropertyLocal(null)
                        setSelectedCustomer(null)
                        setStartDate(null)
                        setEndDate(null)
                        setItemRows([])
                        setDescription("")
                        }}
                        sx={{ marginBottom: "10px" }}>
                    Tyhjennä kentät
                </Button>
                <Button
                    size="small"
                    startIcon={<CloseIcon />}
                    color="error"
                    variant="contained"
                    disabled={loading}
                    onClick={() => {
                        onHide();
                    }}
                    sx={{ alignSelf: "flex-end" }}>
                    Sulje
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}
