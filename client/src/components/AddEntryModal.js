import React, { useState, useEffect, useRef } from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
    Alert, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField
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

        const isValid = Object.values(formData).every(value => value.trim() !== "");

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
                        if (firstInputRef.current) {
                            firstInputRef.current.focus();
                        }
                    }
                },
            }}>

            {errorState &&
                <Alert color="error" severity="error" variant="filled">{errorMessage}</Alert>}

            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                {schema.map((input, index) => (
                    <TextField
                        key={input.field}
                        inputRef={index === 0 ? firstInputRef : null}
                        label={input.header}
                        name={input.field}
                        value={formData[input.field] || ""}
                        onChange={handleChange}
                        margin="normal"
                        required={true}
                        fullWidth
                    />
                ))}
            </DialogContent>

            <DialogActions>
                <Button
                    size="small"
                    startIcon={<CloseIcon />}
                    color="secondary"
                    variant="outlined"
                    disabled={loading}
                    onClick={onHide}
                    sx={{ marginBottom: "10px" }}>
                    Peruuta
                </Button>
                <Button
                    size="small"
                    startIcon={<SaveIcon />}
                    color="success"
                    loading={loading}
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ marginBottom: "10px", marginRight: "20px" }}>
                    Tallenna
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddEntry;
