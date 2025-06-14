import React, { useState, useEffect, useRef } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";

const AddEntry = ({ schema, show, onHide, onAdded, apiEndPoint, title }) => {
    const initialFormData = schema.reduce((acc, field) => ({ ...acc, [field.field]: "" }), {});
    const [formData, setFormData] = useState({});
    const [errorState, setErrorState] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const firstInputRef = useRef(null);

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
        setLoading(true);

        const isValid = Object.values(formData).every(value => value.trim() !== "");

        if (!isValid) {
            setErrorState(true);
            setErrorMessage("Täytä kaikki kentät!")
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(apiEndPoint, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onAdded();
                onHide();
            } else {
                throw new Error("API error")
            }
        } catch (err) {
            setErrorState(true);
            setErrorMessage("Verkkovirhe. Tarkista internet yhteys.")
            console.log("Network error while adding a new office:", err)
        } finally {
            setLoading(false);
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
