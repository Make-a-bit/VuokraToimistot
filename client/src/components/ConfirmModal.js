import React, { useState } from 'react';

import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const ConfirmModal = ({
    show,
    onHide,
    title = "",
    message = "",
    confirmText = "",
    cancelText = "",
    onConfirm,
}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            setError("");
            await onConfirm();
            onHide();
        } catch (err) {
            setError("Poistaminen ei onnistunut!")
            console.log("Error while deleting data:", err)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={show} onClose={onHide}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                {message}
            </DialogContent>
            <DialogActions>
                <Button
                    size="small"
                    color="secondary"
                    variant="outlined"
                    startIcon={<CloseIcon /> }
                    onClick={onHide}
                    disabled={isLoading}>
                    {cancelText}
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleConfirm}
                    disabled={isLoading}>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;