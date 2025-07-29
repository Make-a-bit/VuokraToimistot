import React, { useState, useEffect, useRef } from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
    Alert, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, MenuItem, Select, TextField
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch, useSelector } from "react-redux";
import { SHOW_LOADING, HIDE_LOADING } from "../redux/actions/actiontypes";

const AddEntry = ({ schema, show, onHide, apiEndPoint, title, action, extraData }) => {
    const initialFormData = schema.reduce((acc, field) => ({ ...acc, [field.field]: "" }), {});
    const [formData, setFormData] = useState({});
    const [errorState, setErrorState] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const firstInputRef = useRef(null);
    const dispatch = useDispatch();
    const loading = useSelector(state => state.ui.loadingState);
    const vats = useSelector(state => state.taxes.vats);

    const nameInputRef = useRef(null);

    useEffect(() => {
        if (!show) {
            setFormData(initialFormData);
            setErrorState(false);
            setErrorMessage("");
        }
    }, [show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
                                <InputLabel id="vat-select-label">{input.header}</InputLabel>
                                <Select
                                    labelId="vat-select-label"
                                    id="vat-select"
                                    name="vat"
                                    value={formData["vat"] || ""}
                                    label={input.header}
                                    onChange={handleChange}
                                    inputRef={index === 0 ? firstInputRef : null}
                                >
                                    {vats && vats.length > 0 ? vats.map((vat) => (
                                        <MenuItem key={vat.id || vat.taxValue} value={vat.id}>
                                            {vat.taxValue} %
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
