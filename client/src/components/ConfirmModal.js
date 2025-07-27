import React from 'react';

import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from "react-redux";
import { SHOW_LOADING, HIDE_LOADING } from "../redux/actions/actiontypes";

const ConfirmModal = ({
    show,
    onHide,
    title = "",
    message = "",
    confirmText = "",
    cancelText = "",
    onConfirm,
}) => {

    const dispatch = useDispatch();
    const loading = useSelector(state => state.ui.loadingState);

    const handleConfirm = async () => {
        dispatch({ type: SHOW_LOADING })
        try {
            await onConfirm();
            onHide();
        } catch (err) {
            console.log("Error saving new data:", err)
        } finally {
            dispatch({ type: HIDE_LOADING })
        }
    };

    return (
        <Dialog open={show} onClose={onHide}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                {message}
            </DialogContent>
            <DialogActions sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: "20px"

            }}>
                <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<DeleteIcon />}
                    onClick={handleConfirm}
                    disabled={loading}>
                    {confirmText}
                </Button>
                <Button
                    size="small"
                    color="error"
                    variant="contained"
                    startIcon={<CloseIcon />}
                    onClick={onHide}
                    disabled={loading}>
                    {cancelText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;