import React, { useState, useEffect, useRef } from "react";
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
import { autoCompleteFieldMargins } from "../utils/fieldMarginals"
import useAutoClearMessages from "../hooks/autoClearMessages";

/**
 * EditInvoice component for editing invoice details in a modal dialog.
 * 
 * @param {Object} props
 * @param {boolean} props.show - Whether the dialog is open.
 * @param {Function} props.onHide - Function to close the dialog.
 * @param {Object} [props.invoice] - Invoice object to edit.
 * @returns {JSX.Element}
 */
const EditInvoice = ({ show, onHide, invoice }) => {
    /** @type {import('react-redux').Dispatch} */
    const dispatch = useDispatch();

    /**
     * errorMessage and successMessage are strings or null from Redux UI state.
     * @type {{ errorMessage: string|null, successMessage: string|null }}
     */
    const { errorMessage, successMessage } = useSelector(state => state.ui);

    /**
     * invoiceDate and dueDate are dayjs objects or null.
     * @type {[import('dayjs').Dayjs|null, Function]}
     */
    const [invoiceDate, setInvoiceDate] = useState(null);
    /** @type {[import('dayjs').Dayjs|null, Function]} */
    const [dueDate, setDueDate] = useState(null);

    /**
     * subTotal, discounts, vat, totalSum are strings (may be empty or numeric as string).
     * @type {[string, Function]}
     */
    const [subTotal, setSubTotal] = useState("");
    /** @type {[string, Function]} */
    const [discounts, setDiscounts] = useState("");
    /** @type {[string, Function]} */
    const [vat, setVat] = useState("");
    /** @type {[string, Function]} */
    const [totalSum, setTotalSum] = useState("");
    /** @type {[boolean, Function]} */
    const [paid, setPaid] = useState(false);

    /**
     * isDisabled is a boolean indicating if invoice is paid.
     * @type {boolean}
     */
    const isDisabled = invoice ? invoice.paid : false;

    useAutoClearMessages(errorMessage, successMessage);

    /**
     * firstFieldRef is a ref to the first input field.
     * @type {import('react').RefObject<HTMLInputElement>}
     */
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

    /**
     * Formats a value as a currency string in EUR.
     * 
     * @param {string|number|null|undefined} value
     * @returns {string}
     */
    const formatCurrency = (value) => {
        if (value === "" || value === null || value === undefined) return "";
        return new Intl.NumberFormat("fi-FI", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Number(value));
    };

    /**
     * Handles saving the invoice changes.
     * 
     * @param {import('react').SyntheticEvent} [e]
     * @returns {Promise<void>}
     */
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
                                format="DD-MM-YYYY"
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
                                format="DD-MM-YYYY"
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

export default EditInvoice;