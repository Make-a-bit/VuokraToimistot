import React, { useState, useEffect } from "react";
import {
    Alert, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, MenuItem, Select, TextField
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import inputValidation from "../utils/inputValidation";

const EditEntryModal = ({ schema, onClose, show, onHide, title, action, entry }) => {
    const dispatch = useDispatch();
    const vats = useSelector(state => state.taxes.vats);
    const offices = useSelector(state => state.offices.offices);

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [errorState, setErrorState] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    //console.log(vats)
    //console.log("ENTRY:", entry);
    //console.log("SCHEMA:", schema);

    useEffect(() => {
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

    const handleChange = (field) => (event) => {
        setFormData({ ...formData, [field]: event.target.value });
        setErrors({ ...errors, [field]: undefined });
    };

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

        console.log("FormData", formData)

        if (formData.officeName !== undefined) {
            dataToSend.officeId = formData.officeName;
            delete dataToSend.officeName;
        }

        // Map vat (selected VAT id) to vatId for backend
        if (formData.vat !== undefined) {
            console.log("Vat block")
            const vatObj = vats.find(v => v.id === Number(formData.vat));
            dataToSend.vatId = vatObj ? vatObj.id : null;         // send the id
            dataToSend.vatValue = vatObj ? vatObj.vatValue : null; // send the percentage
            delete dataToSend.vat;
        }

        console.log(dataToSend)

        await dispatch(action(dataToSend));
        onHide();
    };

    //console.log("Entry:", entry)

    return (
        <Dialog open={show} onClose={onHide} maxWidth="sm" fullWidth>
            {errorState &&
                <Alert color="error" severity="error" variant="filled">{errorMessage}</Alert>
            }
            <DialogTitle>{title || "Muokkaa tietoja"}</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    {(schema || []).map(fieldDef => {
                        // Render ALV (VAT) as dropdown
                        if (fieldDef.field === "vat") {
                            return (
                                <FormControl key={fieldDef.field} fullWidth>
                                    <InputLabel id="vat-select-label">ALV</InputLabel>
                                    <Select
                                        labelId="vat-select-label"
                                        value={formData[fieldDef.field] || ""}
                                        label="ALV"
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