import React, { useState, useEffect, useRef } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const mainURI = "https://localhost:7017/customer";

const AddCustomer = ({ show, onHide, onCustomerAdded }) => {
    const nameInputRef = useRef(null);
    const initialFormData = { name: "", email: "", phone: "", address: "", postalCode: "", city: "", country: "" };

    const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", postalCode: "", city: "", country: "" })
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    useEffect(() => {
        if (show) {
            setTimeout(() => {
                nameInputRef.current?.focus();
            }, 1);
        }
    }, [show]);

    useEffect(() => {
        if (!show) {
            setFormData(initialFormData);
        }
    }, [show]);

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(false);
            }, 2000);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for empty fields
        const isValid = Object.values(formData).every(value => value.trim() !== "");

        if (!isValid) {
            setError(true);
            setErrorMessage("Täytä kaikki kentät!")
            return;
        }

        // Proceed for sending data to server
        try {
            const response = await fetch(mainURI, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onCustomerAdded();
                onHide();
            } else {
                setError(true);
                setErrorMessage("Virhe asiakkaan lisäämisessä");
                console.log("Error while adding a new customer");
            }
        } catch (err) {
            setError(true);
            setErrorMessage("Verkkovirhe. Tarkista internet yhteys.")
            console.log("Network error while adding a customer:", err)
        }
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Lisää uusi asiakas</Modal.Title>
            </Modal.Header>

            {error && <Alert variant={"danger"}>{errorMessage}</Alert>}

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Nimi</Form.Label>
                        <Form.Control
                            type="text"
                            ref={nameInputRef}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Sähköposti</Form.Label>
                        <Form.Control
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Puhelin</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                            />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Katuosoite</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                            />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Postinumero</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            required
                            />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Postitoimipaikka</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                            />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Maa</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            required
                            />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Peruuta</Button>
                <Button variant="primary" onClick={handleSubmit}>Tallenna</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddCustomer;