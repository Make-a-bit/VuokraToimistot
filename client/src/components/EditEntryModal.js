import React, { useState, useEffect, useRef } from "react";
import {
    Alert, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, MenuItem, Select, TextField
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

/**
 * @typedef {Object} FieldDef
 * @property {string} field - The field name
 * @property {string} [header] - The display header for the field
 * @property {string} [type] - The type of the field (e.g., "decimal", "text")
 * @property {boolean} [required] - Whether the field is required
 */

/**
 * @typedef {Object} Office
 * @property {number|string} id - The office id
 * @property {string} name - The office name
 */

/**
 * @typedef {Object} Vat
 * @property {number|string} id - The VAT id
 * @property {number|string} vatValue - The VAT value (percentage)
 */

/**
 * @typedef {Object.<string, any>} FormData
 */

/**
 * @typedef {Object.<string, string>} Errors
 */

/**
 * EditEntryModal component for editing an entry with dynamic schema.
 * 
 * @param {Object} props
 * @param {FieldDef[]} props.schema - Array of field definitions for the form
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {boolean} props.show - Whether the modal is visible
 * @param {Function} props.onHide - Function to call to hide the modal
 * @param {string} [props.title] - Optional title for the modal
 * @param {Function} props.action - Redux action to dispatch on submit
 * @param {Object} [props.entry] - The entry object being edited
 * @returns {JSX.Element}
 */
const EditEntryModal = ({ schema, onClose, show, onHide, title, action, entry }) => {
    const dispatch = useDispatch();

    /**
     * @type {Vat[]}
     * vats: Array of VAT objects from Redux store.
     */
    const vats = useSelector(state => state.taxes.vats);

    /**
     * @type {Office[]}
     * offices: Array of office objects from Redux store.
     */
    const offices = useSelector(state => state.offices.offices);

    /**
     * @type {[FormData, Function]}
     * formData: State for form field values.
     */
    const [formData, setFormData] = useState({});

    /**
     * @type {[Errors, Function]}
     * errors: State for field-level error messages.
     */
    const [errors, setErrors] = useState({});

    /**
     * @type {[boolean, Function]}
     * errorState: State for showing a general error alert.
     */
    const [errorState, setErrorState] = useState(false);

    /**
     * @type {[string, Function]}
     * errorMessage: State for the general error message.
     */
    const [errorMessage, setErrorMessage] = useState("");

    const firstFieldRef = useRef(null);

    useEffect(() => {
        if (show) {
            const dialog = document.querySelector('[role="dialog"]');
            if (
                document.activeElement &&
                dialog &&
                !dialog.contains(document.activeElement)
            ) {
                document.activeElement.blur();
            }
        }
    }, [show]);

    useEffect(() => {
        if (show && firstFieldRef.current) {
            firstFieldRef.current.focus();
        }
    }, [show]);

    useEffect(() => {
        /** @type {FormData} */
        const initialData = {};
        (schema || []).forEach(fieldDef => {
            const key = fieldDef.field;
            if ((key === "officeName" || key === "kohde") && entry && entry.officeName && Array.isArray(offices)) {
                const office = offices.find(o => o.name === entry.officeName);
                initialData[key] = office ? office.id : "";
            }
            else if (key === "vat" && entry && Array.isArray(vats)) {
                let vatObj = null;
                if (entry.vatId !== undefined) {
                    vatObj = vats.find(v => Number(v.id) === Number(entry.vatId));
                }
                if (!vatObj && entry.vat !== undefined) {
                    vatObj = vats.find(v => Number(v.vatValue) === Number(entry.vat));
                }
                if (!vatObj && entry.vatValue !== undefined) {
                    vatObj = vats.find(v => Number(v.vatValue) === Number(entry.vatValue));
                }
                initialData[key] = vatObj ? vatObj.id : "";
            }
            else {
                initialData[key] = entry && entry[key] !== undefined ? entry[key] : "";
            }
        });
        if (entry && entry.id !== undefined) {
            initialData.id = entry.id;
        }
        setFormData(initialData);
        setErrors({});
        setErrorState(false);
        setErrorMessage("");
    }, [entry, show, schema, offices, vats]);

    /**
     * Returns a change handler for a given field.
     * @param {string} field - The field name to handle changes for.
     * @returns {(event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => void}
     */
    const handleChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
        setErrors({ ...errors, [field]: undefined });
    };

    /**
     * Handles form submission, validates fields, and dispatches the action.
     * @param {React.FormEvent<HTMLFormElement> | React.MouseEvent} e
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields (except officeName/kohde)
        const isValid = (schema || [])
            .filter(input => input.field !== "officeName" && input.field !== "kohde")
            .every(input => {
                const value = formData[input.field];
                return value !== undefined && value !== null && !(typeof value === "string" && value.trim() === "");
            });

        if (!isValid) {
            setErrorState(true);
            setErrorMessage("Täytä kaikki kentät!");
            return;
        }

        // Validate decimal fields
        for (const input of schema || []) {
            if (input.type === "decimal") {
                const value = formData[input.field];
                if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    setErrorState(true);
                    setErrorMessage(`Käytä ${input.header} kentän erottimena pistettä (esim. 12.34).`);
                    return;
                }
            }
        }

        // Map officeName to office_id for backend
        let dataToSend = { ...formData };

        if (formData.officeName !== undefined) {
            dataToSend.officeId = formData.officeName;
            delete dataToSend.officeName;
        }

        // Map vat (selected VAT id) to vatId for backend
        if (formData.vat !== undefined) {
            const vatObj = vats.find(v => v.id === Number(formData.vat));
            dataToSend.vatId = vatObj ? vatObj.id : null;         
            dataToSend.vatValue = vatObj ? vatObj.vatValue : null;
            delete dataToSend.vat;
        }

        await dispatch(action(dataToSend));
        onHide();
    };

    return (
        <Dialog open={show} onClose={onHide} maxWidth="sm" fullWidth>
            {errorState &&
                <Alert color="error" severity="error" variant="filled">{errorMessage}</Alert>
            }
            <DialogTitle>{title || "Muokkaa tietoja"}</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    {(schema || []).map((fieldDef, index) => {
                        // Render ALV (VAT) as dropdown
                        if (fieldDef.field === "vat") {
                            return (
                                <FormControl key={fieldDef.field} fullWidth>
                                    <InputLabel id="vat-select-label">Veroluokka</InputLabel>
                                    <Select
                                        labelId="vat-select-label"
                                        value={formData[fieldDef.field] || ""}
                                        label="Veroluokka"
                                        onChange={handleChange(fieldDef.field)}
                                    >
                                        {Array.isArray(vats) && vats.length > 0 ? (
                                            vats.map(tax => (
                                                <MenuItem key={tax.id} value={tax.id}>
                                                    {tax.vatValue} %
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="">Ei ALV-arvoja</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            );
                        }
                        // Render Kohde (Office) as dropdown
                        if (fieldDef.field === "kohde" || fieldDef.field === "officeName") {
                            return (
                                <FormControl key={fieldDef.field} fullWidth>
                                    <InputLabel id="office-select-label">Kohde</InputLabel>
                                    <Select
                                        labelId="office-select-label"
                                        value={formData[fieldDef.field] || ""}
                                        label="Kohde"
                                        onChange={handleChange(fieldDef.field)}
                                    >
                                        {Array.isArray(offices) && offices.length > 0 ? (
                                            offices.map(office => (
                                                <MenuItem key={office.id} value={office.id}>
                                                    {office.name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="">Ei kohteita</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            );
                        }
                        // Render other fields as text
                        return (
                            <TextField
                                key={fieldDef.field}
                                inputRef={index === 0 ? firstFieldRef : null}
                                autoFocus={index === 0}
                                label={fieldDef.header || fieldDef.field}
                                value={formData[fieldDef.field] || ""}
                                onChange={handleChange(fieldDef.field)}
                                required={fieldDef.required}
                                type={fieldDef.type || "text"}
                                error={!!errors[fieldDef.field]}
                                helperText={errors[fieldDef.field]}
                                fullWidth
                            />
                        );
                    })}
                    {errors.form && (
                        <Box color="error.main">{errors.form}</Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                padding: "20px"
            }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="success"
                    >Tallenna
                    </Button>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        color="error">Sulje</Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default EditEntryModal;