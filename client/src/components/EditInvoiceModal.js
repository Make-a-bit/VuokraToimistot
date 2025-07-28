import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Alert, Box, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, FormControl, FormControlLabel, Snackbar
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "../../src/dayjs-setup";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

import { fetchInvoices, updateInvoice } from "../redux/actions/invoiceActions";
import { autoCompleteFieldMargins, leftButton, middleButton, rightButton } from "../utils/fieldMarginals"
import useAutoClearMessages from "../hooks/autoClearMessages";

dayjs.locale("fi");

const EditInvoice = ({ show, onHide, invoice }) => {
    const dispatch = useDispatch();
    const { errorMessage, successMessage } = useSelector(state => state.ui);

    const [invoiceDate, setInvoiceDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [subTotal, setSubTotal] = useState("");
    const [discounts, setDiscounts] = useState("");
    const [vat, setVat] = useState("");
    const [totalSum, setTotalSum] = useState("");
    const [paid, setPaid] = useState(false);

    const isDisabled = invoice ? invoice.paid : false;

    useAutoClearMessages(errorMessage, successMessage);

    // Assign values into formcontrol fields when opening the modal
    useEffect(() => {
        if (show && invoice) {
            setInvoiceDate(invoice.invoiceDate ? dayjs(invoice.invoiceDate) : null);
            setDueDate(invoice.dueDate ? dayjs(invoice.dueDate) : null);
            setSubTotal(invoice.subTotal ?? "");
            setDiscounts(invoice.discounts ?? "");
            setVat(invoice.vatTotal ?? "");
            setTotalSum(invoice.totalSum ?? "");
            setPaid(invoice.paid ?? false);
        }
    }, [show, invoice]);

    const formatCurrency = (value) => {
        if (value === "" || value === null || value === undefined) return "";
        return new Intl.NumberFormat("fi-FI", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Number(value));
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();

        const updatedInvoice = {
            id: invoice.id,
            reservationId: invoice.reservationId,
            customer: { id: invoice.customer.id },
            invoiceDate: invoiceDate.format("YYYY-MM-DD"),
            dueDate: dueDate.format("YYYY-MM-DD"),
            subTotal: invoice.subTotal,
            discounts: invoice.discounts,
            vatTotal: invoice.vat,
            totalSum: invoice.totalSum,
            paid: paid
        };

        await dispatch(updateInvoice(updatedInvoice))
        await dispatch(fetchInvoices())
        onHide();
    };

    return (
        <>
            <Dialog
                open={show}
                onClose={onHide}
                PaperProps={{
                    sx: { width: "450px", maxWidth: "100%" }
                }}
            >
                <DialogTitle>
                    {invoice
                        ? <>Muokkaa laskua #{invoice.id} / {invoice.customer.name}</>
                        : "Muokkaa laskua"}
                </DialogTitle>
                <DialogContent dividers>
                    <FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                key={1}
                                disabled={isDisabled}
                                format="YYYY-MM-DD"
                                label="Laskutuspäivä"
                                onChange={(newValue) => {
                                    setInvoiceDate(newValue);
                                }}
                                value={invoiceDate}
                                sx={{ ...autoCompleteFieldMargins }}
                            />
                        </LocalizationProvider>
                    </FormControl>

                    <FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                key={2}
                                disabled={isDisabled}
                                format="YYYY-MM-DD"
                                label="Eräpäivä"
                                onChange={(newValue) => {
                                    setDueDate(newValue);
                                }}
                                value={dueDate}
                                sx={{ ...autoCompleteFieldMargins }}
                            />
                        </LocalizationProvider>
                    </FormControl>

                    <FormControl>
                        <TextField
                            disabled={true}
                            label="Välisumma"
                            value={formatCurrency(subTotal)}
                            sx={{ ...autoCompleteFieldMargins }}
                        />
                    </FormControl>

                    <FormControl>
                        <TextField
                            disabled={true}
                            label="Alennukset"
                            value={formatCurrency(discounts)}
                            sx={{ ...autoCompleteFieldMargins }}
                        />
                    </FormControl>

                    <FormControl>
                        <TextField
                            disabled={true}
                            label="ALV"
                            value={formatCurrency(vat)}
                            sx={{ ...autoCompleteFieldMargins }}
                        />
                    </FormControl>

                    <FormControl>
                        <TextField
                            disabled={true}
                            label="Loppusumma"
                            value={formatCurrency(totalSum)}
                            sx={{ ...autoCompleteFieldMargins }}
                        />
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={paid}
                                disabled={isDisabled}
                                onChange={(event) => setPaid(event.target.checked)}
                            />
                        }
                        label="Maksettu"
                    />
                </DialogContent>

                <DialogActions sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    padding: "20px"
                }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <Button
                            disabled={isDisabled}
                            onClick={handleSave}
                            size="small"
                            startIcon={<SaveIcon />}
                            color="success"
                            variant="contained"
                        >
                            Tallenna muutokset
                        </Button>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                        <Button
                            color="error"
                            onClick={() => {
                                onHide();
                            }}
                            variant="contained"
                            size="small"
                            startIcon={<CloseIcon />}
                        >
                            Sulje
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

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

        </>
    )
}

export default EditInvoice;