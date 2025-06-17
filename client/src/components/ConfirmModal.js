import React, { useState } from 'react';

import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useSelector } from "react-redux";

const ConfirmModal = ({
    show,
    onHide,
    title = "",
    message = "",
    confirmText = "",
    cancelText = "",
    onConfirm,
}) => {

    const loading = useSelector(state => state.loadingState);

    const handleConfirm = async () => {
        try {
            await onConfirm();
            onHide();
        } catch (err) {
            console.log("Error while deleting customer:", err)
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
                    disabled={loading}>
                    {cancelText}
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleConfirm}
                    disabled={loading}>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;