import React, { useState } from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';

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
    const [error, setError] = useState(null);

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await onConfirm();
            onHide();
        } catch (err) {
            setError("Asiakkaan poistaminen ei onnistunut.")
            console.log("Error while deleting customer")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {message}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={isLoading}>{cancelText}</Button>
                <Button variant="danger" onClick={handleConfirm} disabled={isLoading}>
                    {isLoading ? <Spinner animation="border" size="sm" /> : confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;