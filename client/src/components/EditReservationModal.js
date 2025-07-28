import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Autocomplete, Box, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, FormControl, FormControlLabel
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { updateReservation, fetchReservations, fetchReservedDates } from "../redux/actions/reservationActions";
import { createInvoice, fetchInvoices } from "../redux/actions/invoiceActions";
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
    const [description, setDescription] = useState(reservation?.description || "");

    const {
        shouldDisableStartDate,
        shouldDisableEndDate,
    } = getReservationDateUtils(reservedDates, reservation, startDate);

    const isDisabled = reservation?.invoiced ?? false;

    const originalReservationRef = React.useRef();

    useEffect(() => {
        if (reservation) {
            // Store a deep copy of the original reservation and itemRows
            originalReservationRef.current = {
                reservation: { ...reservation },
                itemRows: [
                    ...(reservation.devices || []).map(d => ({
                        type: "device",
                        itemId: d.id,
                        price: d.price,
                        vat: d.vat,
                        qty: d.qty ?? 1,
                        discount: d.discount ?? 0,
                    })),
                    ...(reservation.services || []).map(s => ({
                        type: "service",
                        itemId: s.id,
                        price: s.price,
                        vat: s.vat,
                        qty: s.qty ?? 1,
                        discount: s.discount ?? 0,
                    }))
                ]
            };
        }
    }, [reservation]);

    useEffect(() => {
        if (selectedOfficeProperty) {
            const property = properties.find(p => p.id === selectedOfficeProperty.id);
            if (property) {
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
    }, [selectedOfficeProperty, startDate, endDate, properties]);

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
            const foundCustomer = customers.find(c => c.id === reservation.customer.id);
            setSelectedCustomer(foundCustomer || null);

            // Map property to a row if found
            const propertyRow = foundProperty
                ? [{
                    id: `property-${foundProperty.id}`,
                    type: "property",
                    itemId: foundProperty.id,
                    name: foundProperty.name,
                    price: foundProperty.price || 0,
                    vat: foundProperty.vat || 0,
                    qty: getDuration(reservation.startDate, reservation.endDate) || 1,
                    discount: 0,
                    manuallyModified: false
                }]
                : [];

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

            setItemRows([...propertyRow, ...deviceRows, ...serviceRows]);
        }
    }, [reservation, offices, properties, customers]);

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
        setItemRows(prev =>
            prev.map(row =>
                row.type === "property" && !row.manuallyModified
                    ? { ...row, qty: days }
                    : row
            )
        );
    }, [startDate, endDate]);

    useEffect(() => {
        setDescription(reservation?.description || "");
    }, [reservation]);

    const firstFieldRef = useRef(null);

    useEffect(() => {
        if (show && firstFieldRef.current) {
            firstFieldRef.current.focus();
        }
    }, [show]);

    useEffect(() => {
        const root = document.getElementById('root');
        if (show) {
            root.setAttribute('inert', '');
        } else {
            root.removeAttribute('inert');
        }
        return () => {
            root.removeAttribute('inert');
        };
    }, [show]);



    const deviceOptions = useMemo(() =>
        devices.filter(
            d => !itemRows.some(row => row.type === "device" && row.itemId === d.id)
        ), [devices, itemRows]);

    const serviceOptions = useMemo(() =>
        services.filter(
            s => !itemRows.some(row => row.type === "service" && row.itemId === s.id)
        ), [services, itemRows]
    );

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

    const handleRowEdit = (newRow) => {
        setItemRows(prev =>
            prev.map(row =>
                row.id === newRow.id
                    ? { ...row, ...newRow, manuallyModified: true }
                    : row
            )
        );
        return newRow;
    };

    const handleRowDelete = (id) => {
        setItemRows(prev => deleteRow(prev, id));
    };

    const isModified = () => {
        if (!originalReservationRef.current) return false;

        // Compare simple fields
        if (
            selectedCustomer?.id !== originalReservationRef.current.reservation.customer?.id ||
            selectedOfficeProperty?.id !== originalReservationRef.current.reservation.propertyId ||
            startDate?.format("YYYY-MM-DD") !== dayjs(originalReservationRef.current.reservation.startDate).format("YYYY-MM-DD") ||
            endDate?.format("YYYY-MM-DD") !== dayjs(originalReservationRef.current.reservation.endDate).format("YYYY-MM-DD") ||
            description !== (originalReservationRef.current.reservation.description || "")
        ) {
            return true;
        }

        // Compare itemRows (devices/services)
        const currentRows = itemRows.filter(row => row.type === "device" || row.type === "service");
        const originalRows = originalReservationRef.current.itemRows;

        if (currentRows.length !== originalRows.length) return true;

        for (let i = 0; i < currentRows.length; i++) {
            const cur = currentRows[i];
            const orig = originalRows[i];
            if (
                cur.type !== orig.type ||
                cur.itemId !== orig.itemId ||
                cur.price !== orig.price ||
                cur.vat !== orig.vat ||
                cur.qty !== orig.qty ||
                cur.discount !== orig.discount
            ) {
                return true;
            }
        }

        return false;
    }

    const handleSave = async (e) => {
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

        const updatedReservation = {
            id: reservation.id,
            property: { id: selectedOfficeProperty.id },
            customer: { id: selectedCustomer.id },
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            devices,
            services,
            invoiced: invoiced,
            description: description
        };

        await dispatch(updateReservation(updatedReservation))
        await dispatch(fetchReservations());
        await dispatch(fetchReservedDates(reservation.propertyId));
        onHide();
    };

    const handleInvoicing = async (e) => {
        e.preventDefault();

        if (isModified()) {
            await handleSave();
            actuallyInvoice();
        } else {
            actuallyInvoice();
        }
    };

    const actuallyInvoice = () => {
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
            id: reservation.id,
            property: { id: selectedOfficeProperty.id },
            customer: { id: selectedCustomer.id },
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
            Devices: devices,
            Services: services,
            invoiced: true,
            dateInvoiced: dateInvoiced.format("YYYY-MM-DD"),
            dueDate: dateInvoiced.add(14, "day").format("YYYY-MM-DD")
        };

        dispatch(createInvoice(invoiceReservation))
            .then(() => {
                dispatch(fetchReservations());
                dispatch(fetchReservedDates(reservation.propertyId));
                dispatch(fetchInvoices());
                onHide();
            });
    };

    if (!reservation) return null;

    return (
        <Dialog
            open={show}
            onClose={onHide}
            PaperProps={{
                sx: { width: "900px", maxWidth: "100%" }
            }}
        >
            <DialogTitle>Muokkaa varausta #{reservation.id} / {reservation.customer.name}</DialogTitle>
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
                                disabled={isDisabled}
                                label={selectedOffice ? "Kohde" : "Valitse kohde"}
                                variant="outlined"
                                fullWidth
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        sx={{ ...autoCompleteFieldMargins }}
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
                                disabled={isDisabled}
                                label={selectedOfficeProperty ? "Vuokratila" : "Valitse vuokratila"}
                                variant="outlined"
                                fullWidth />
                        )}
                        sx={{ ...autoCompleteFieldMargins }}
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
                                disabled={isDisabled}
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
                            enableAccessibleFieldDOMStructure={false}
                            disabled={!selectedCustomer || !selectedOffice || !selectedOfficeProperty || isDisabled}
                            format="YYYY-MM-DD"
                            label="Varauksen alku"
                            onChange={(newValue) => {
                                setStartDate(newValue);
                                setEndDate(null);
                            }}
                            shouldDisableDate={shouldDisableStartDate}
                            value={startDate}
                            slots={{ textField: TextField }}
                            slotProps={{
                                textField: {
                                    disabled: !selectedCustomer || !selectedOffice || !selectedOfficeProperty || isDisabled,
                                    label: "Varauksen alku",
                                    variant: "outlined",
                                    fullWidth: true,
                                    sx: { ...autoCompleteFieldMargins, marginRight: "10px" }
                                }
                            }}
                        />
                    </LocalizationProvider>
                </FormControl>

                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            key={reservedDates.length}
                            enableAccessibleFieldDOMStructure={false}
                            defaultValue={startDate}
                            format="YYYY-MM-DD"
                            label="Varauksen loppu"
                            disabled={!startDate || isDisabled}
                            onChange={setEndDate}
                            shouldDisableDate={shouldDisableEndDate}
                            value={endDate}
                            slots={{ textField: TextField }}
                            slotProps={{
                                textField: {
                                    disabled: !startDate || isDisabled,
                                    label: "Varauksen loppu",
                                    variant: "outlined",
                                    fullWidth: true,
                                    sx: { ...autoCompleteFieldMargins }
                                }
                            }}
                        />
                    </LocalizationProvider>
                </FormControl>

                <FormControl>
                    <Autocomplete
                        disabled={!endDate || isDisabled}
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
                        sx={{ ...autoCompleteFieldMargins }}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    />
                </FormControl>

                <FormControl>
                    <Autocomplete
                        disabled={!endDate || isDisabled}
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
                        sx={{ ...autoCompleteFieldMargins }}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    />
                </FormControl>

                <FormControl>
                    <TextField
                        disabled={isDisabled}
                        label="Lisätiedot"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ ...autoCompleteFieldMargins, width: "710px" }}
                    />
                </FormControl>

                <br />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={invoiced}
                            disabled={true}
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
                            width: 90,
                            renderCell: (params) => {
                                if (params.row.type === "device") return "Laite";
                                if (params.row.type === "service") return "Palvelu";
                                if (params.row.type === "property") return "Vuokratila";
                                return "";
                            }
                        },
                        { field: "name", headerName: "Nimi", flex: 1 },
                        { field: "price", headerName: "Hinta", width: 70, editable: !isDisabled },
                        { field: "qty", headerName: "Määrä", width: 70, editable: !isDisabled },
                        { field: "discount", headerName: "Ale %", width: 70, editable: !isDisabled },
                        {
                            field: "subtotal",
                            headerName: "Summa",
                            width: 100,
                            renderCell: (params) => {
                                const row = params.row;
                                if (!row) return "";

                                const price = parseFloat(row.price) || 0;
                                const qty = parseFloat(row.qty) || 0;
                                const discount = parseFloat(row.discount) || 0;

                                let total = (price * qty);

                                if (discount !== 0) {
                                    total = total - (discount / 100 * total);
                                }

                                return (
                                    <span>{total.toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                                );
                            }
                        },
                        { field: "vat", headerName: "ALV %", width: 70 },
                        {
                            field: "total",
                            headerName: "Yhteensä",
                            width: 100,
                            renderCell: (params) => {
                                const row = params.row;
                                if (!row) return "";

                                const price = parseFloat(row.price) || 0;
                                const qty = parseFloat(row.qty) || 0;
                                const discount = parseFloat(row.discount) || 0;
                                const vat = parseFloat(row.vat) || 0;

                                const subtotal = price * qty
                                const discountedSubtotal = subtotal - ((discount / 100) * subtotal)
                                const total = discountedSubtotal + ((vat / 100) * discountedSubtotal)

                                return (
                                    <span>{total.toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                                )
                            }
                        },
                        {
                            field: "actions",
                            headerName: "Poista",
                            width: 60,
                            renderCell: (params) => (
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    width: "100%"
                                }}>
                                    <Button
                                        color="error"
                                        disabled={isDisabled}
                                        size="small"
                                        onClick={() => handleRowDelete(params.id)}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </Box>
                            )
                        }
                    ]}
                    autoHeight
                    hideFooter
                    disableSelectionOnClick
                    processRowUpdate={handleRowEdit}
                    experimentalFeatures={{ newEditingApi: true }}
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
                alignItems: "flex-end",
                justifyContent: "space-between",
                padding: "20px"
            }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Button
                        size="small"
                        disabled={isDisabled}
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        color="success"
                        variant="contained"
                        sx={{ marginBottom: "10px" }}
                    >Tallenna muutokset</Button>
                    <Button
                        color="success"
                        disabled={isDisabled}
                        onClick={handleInvoicing}
                        variant="contained"
                        size="small"
                        startIcon={<ReceiptLongIcon />}
                    >
                        Laskuta varaus
                    </Button>
                </Box>

                <Box sx={{ alignItems: "flex-end" }}>

                    <Button
                        size="small"
                        onClick={() => {
                            onHide();
                        }}
                        color="error"
                        variant="contained"
                        startIcon={<CloseIcon />}
                        sx={{  }}
                    >Sulje</Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};
