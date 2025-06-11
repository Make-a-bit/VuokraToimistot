import React, { useState, useEffect, useRef } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const mainURI = "https://localhost:7017/office";

const AddOffice = ({ show, onHide, onOfficeAdded }) => {
    const firstInputRef = useRef(null);
    const initialFormData = { name: "", address: "", postalCode: "", city: "", country: "", phone: "", email: "" };

    const [formData, setFormData] = useState({ name: "", address: "", postalCode: "", city: "", country: "", phone: "", email: "" });
    const [errorState, setErrorState] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = Object.values(formData).every(value => value.trim() !== "");

        if (!isValid) {
            setErrorState(true);
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
                onOfficeAdded();
                onHide();
            } else {
                setErrorState(true);
                setErrorMessage("Virhe toimiston lisäämisessä");
                console.log("Error while adding a new office");
            }
        } catch (err) {
            setErrorState(true);
            setErrorMessage("Verkkovirhe. Tarkista internet yhteys.")
            console.log("Network error while adding a new office:", err)
        }
    }

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                firstInputRef.current?.focus();
            }, 1);
        }
    }, [show]);

    useEffect(() => {
        if (!show) {
            setFormData(initialFormData);
        }
    }, [show]);

    useEffect(() => {
        if (errorState) {
            setTimeout(() => {
                setErrorState(false);
            }, 2500);
        }
    }, [errorState]);


    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Lisää uusi toimisto</Modal.Title>
            </Modal.Header>

            { errorState && <Alert variant={"danger"}>{errorMessage}</Alert> }

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Nimi</Form.Label>
                        <Form.Control
                            type="text"
                            ref={firstInputRef}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Osoite</Form.Label>
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
                            value={formData.postal}
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
                        <Form.Label>Sähköposti</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

export default AddOffice;
