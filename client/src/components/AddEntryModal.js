import React, { useState, useEffect, useRef } from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
    Alert, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, MenuItem, Select, TextField
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch, useSelector } from "react-redux";
import { SHOW_LOADING, HIDE_LOADING } from "../redux/actions/actiontypes";

/**
 * @typedef {Object} SchemaField
 * @property {string} field - The field name in the form data
 * @property {string} header - The label/header for the field
 * @property {string} [type] - The type of the field (e.g., "decimal")
 */

/**
 * @typedef {Object} Vat
 * @property {string|number} id - The unique identifier for the VAT
 * @property {string|number} taxValue - The VAT value
 */

/**
 * @typedef {Object.<string, any>} FormData
 */

/**
 * AddEntry component for adding a new entry using a dynamic schema.
 * @param {{
 *   schema: SchemaField[],
 *   show: boolean,
 *   onHide: () => void,
 *   apiEndPoint: string,
 *   title: string,
 *   action: (endpoint: string, payload: object) => Promise<any>,
 *   extraData?: object
 * }} props
 * @returns {JSX.Element}
 */
const AddEntry = ({ schema, show, onHide, apiEndPoint, title, action, extraData }) => {
    // initialFormData is an object with keys from schema fields, all initialized to empty string
    /** @type {FormData} */
    const initialFormData = schema.reduce((acc, field) => ({ ...acc, [field.field]: "" }), {});
    /** @type {[FormData, Function]} */
    const [formData, setFormData] = useState({});
    /** @type {[boolean, Function]} */
    const [errorState, setErrorState] = useState(false);
    /** @type {[string, Function]} */
    const [errorMessage, setErrorMessage] = useState("");
    /** @type {React.MutableRefObject<HTMLInputElement|null>} */
    const firstInputRef = useRef(null);
    const dispatch = useDispatch();
    /** @type {boolean} */
    const loading = useSelector(state => state.ui.loadingState);
    /** @type {Vat[]} */
    const vats = useSelector(state => state.taxes.vats);

    /** @type {React.MutableRefObject<HTMLInputElement|null>} */
    const nameInputRef = useRef(null);

    useEffect(() => {
        if (!show) {
            setFormData(initialFormData);
            setErrorState(false);
            setErrorMessage("");
        }
    }, [show]);

    /**
     * Handles input changes in the form.
     * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|{ name: string, value: any }>} e
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Handles form submission, validates input, and dispatches the action.
     * @param {React.FormEvent<HTMLFormElement>|React.MouseEvent<HTMLButtonElement>} e
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: SHOW_LOADING })

        const isValid = schema
            .filter(input => input.field !== "officeName" && input.field !== "kohde")
            .every(input => {
                const value = formData[input.field];
                // Accept 0 and non-empty strings
                return value !== undefined && value !== null && !(typeof value === "string" && value.trim() === "");
            });

        if (!isValid) {
            setErrorState(true);
            setErrorMessage("Täytä kaikki kentät!")
            dispatch({ type: HIDE_LOADING })
            return;
        }

        // Check for decimal fields
        for (const input of schema) {
            if (input.type === "decimal") {
                const value = formData[input.field];
                if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    setErrorState(true);
                    setErrorMessage(`Käytä ${input.header} kentän erottimena pistettä (esim. 12.34).`);
                    dispatch({ type: HIDE_LOADING })
                    return;
                }
            }
        }

        const payload = { ...formData, ...extraData };

        try {
            await dispatch(action(apiEndPoint, payload));
            onHide();
        } catch (error) {
            setErrorState(true)
            setErrorMessage("Tallennus epäonnistui!");
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    }

    return (
        <Dialog
            open={show}
            onClose={onHide}
            slotProps={{
                transition: {
                    onEntered: () => {
                        if (nameInputRef.current) {
                            nameInputRef.current.focus();
                        }
                    }
                },
            }}>

            {errorState &&
                <Alert color="error" severity="error" variant="filled">{errorMessage}</Alert>}

            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                {schema.map((input, index) => {
                    if (input.field === "vat") {
                        return (
                            <FormControl fullWidth margin="normal" required key={input.field} sx={{ minWidth: 100 }}>
                                <InputLabel id="vat-select-label">Veroluokka</InputLabel>
                                <Select
                                    labelId="vat-select-label"
                                    id="vat-select"
                                    name="vat"
                                    value={formData["vat"] || ""}
                                    label={`Veroluokka`}
                                    onChange={handleChange}
                                    inputRef={index === 0 ? firstInputRef : null}
                                >
                                    {vats && vats.length > 0 ? vats.map((vat) => (
                                        <MenuItem key={vat.id || vat.vatValue} value={vat.id}>
                                            {vat.vatValue} %
                                        </MenuItem>
                                    )) : (
                                        <MenuItem value="">Ei ALV-vaihtoehtoja</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        );
                    }

                    // Hide officeName/kohde field from formData
                    if (input.field === "officeName" || input.field === "kohde") {
                        return null;
                    }
                    return (
                        <TextField
                            key={input.field}
                            inputRef={input.field === "name" ? nameInputRef : null} label={input.header}
                            name={input.field}
                            value={formData[input.field] || ""}
                            onChange={handleChange}
                            margin="normal"
                            required={true}
                            fullWidth
                        />
                    );
                })}
            </DialogContent>
            <DialogActions sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                padding: "20px"
            }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Button
                        size="small"
                        startIcon={<SaveIcon />}
                        color="success"
                        loading={loading}
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={
                            loading ||
                            !schema
                                .filter(input => input.field !== "officeName" && input.field !== "kohde")
                                .every(input => {
                                    const value = formData[input.field];
                                    return value !== undefined && value !== null && !(typeof value === "string" && value.trim() === "");
                                })
                        }
                    >
                        Tallenna
                    </Button>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <Button
                        size="small"
                        startIcon={<CloseIcon />}
                        color="error"
                        variant="contained"
                        disabled={loading}
                        onClick={onHide}
                    >
                        Sulje
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
}

export default AddEntry;