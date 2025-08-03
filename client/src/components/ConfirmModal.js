import React from 'react';

import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from "react-redux";
import { SHOW_LOADING, HIDE_LOADING } from "../redux/actions/actiontypes";

/**
 * ConfirmModal props type definition.
 * @typedef {Object} ConfirmModalProps
 * @property {boolean} show - Whether the modal is open.
 * @property {() => void} onHide - Function to close the modal.
 * @property {string} [title] - Title of the modal.
 * @property {string} [message] - Message to display in the modal.
 * @property {string} [confirmText] - Text for the confirm button.
 * @property {string} [cancelText] - Text for the cancel button.
 * @property {() => Promise<void>} onConfirm - Function to call on confirm, returns a Promise.
 */

/**
 * ConfirmModal component displays a confirmation dialog.
 * @param {ConfirmModalProps} props
 * @returns {JSX.Element}
 */
const ConfirmModal = ({
    show,
    onHide,
    title = "",
    message = "",
    confirmText = "",
    cancelText = "",
    onConfirm,
}) => {

    /** @type {import('react-redux').Dispatch} */
    // useDispatch returns the Redux dispatch function.
    const dispatch = useDispatch();

    /** @type {boolean} */
    // loading is a boolean indicating if a loading state is active.
    const loading = useSelector(state => state.ui.loadingState);

    /**
     * Handles the confirm action, dispatching loading actions and calling onConfirm.
     * @returns {Promise<void>}
     */
    const handleConfirm = async () => {
        dispatch({ type: SHOW_LOADING })
        try {
            await onConfirm();
            onHide();
        } catch (err) {
            //console.log("Error saving new data:", err)
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