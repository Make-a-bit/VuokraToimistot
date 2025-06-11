import React, { useState, useEffect } from "react";
import AddOffice from "../components/OfficeAddModal";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ConfirmModal from "../components/ConfirmModal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import inputValidation from "../utils/inputValidation";

const mainURI = "https://localhost:7017/office";

const Offices = () => {
    const [showAddOffice, setShowAddOffice] = useState(false)
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState({});
    const [editOfficeId, setEditOfficeId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const fetchOffices = async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch(mainURI, {
                method: "GET",
                headers: { "Content-type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setOffices(data)
        } catch (error) {
            console.log("Failed to fetch offices:", error);
            setErrorMessage("Toimistojen hakeminen epäonnistui.")
        } finally {
            setLoading(false);
        }
    }

    const btnEditOffice = (office) => {
        setSelectedOffice(office);
        setEditOfficeId(office.id);
    }

    const btnDeleteOffice = (office) => {
        setSelectedOffice(office)
        setShowConfirm(true)
    }

    const btnSaveEdits = async () => {
        setLoading(true)
        const requiredFields = ['name', 'address', 'postalCode', 'city', 'country', 'phone', 'email']
        const isValid = inputValidation(selectedOffice, requiredFields);

        if (!isValid) {
            setErrorMessage("Täytä kaikki kentät!");
            setLoading(false)
            return;
        }

        const response = await fetch(`${mainURI}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedOffice),
        });

        if (response.ok) {
            await fetchOffices();
            setSelectedOffice(null)
            setEditOfficeId(null)
            setSuccessMessage("Toimiston tietojen päivitys onnistui!")
        } else {
            console.log("Error while updating office data")
            setErrorMessage("Virhe tietojen päivityksessä.")
        }
        setLoading(false)
    }

    const handleDeletion = async () => {
        setLoading(true)
        try {
            await fetch(`${mainURI}/delete/${selectedOffice.id}`, {
                method: "DELETE"
            })
            setSuccessMessage("Toimiston poistaminen onnistui");
            fetchOffices();
        } catch {
            console.log("Error while deleting office");
            setErrorMessage("Toimiston poistaminen ei onnistunut");
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOffices();
    }, []);

    useEffect(() => {
        if (errorMessage) {
            setTimeout(() => {
                setErrorMessage("")
            }, 3000)
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            setTimeout(() => {
                setSuccessMessage("")
            }, 3000)
        }
    }, [successMessage])

    return (
        <>
        <Button variant="primary" onClick={() => setShowAddOffice(true)}>Lisää uusi toimisto</Button>
        <AddOffice
            show={showAddOffice}
            onHide={() => setShowAddOffice(false)}
            onOfficeAdded={() => fetchOffices()}
            /><br /><br />

            {loading && <Alert variant={"info"}>Ladataan toimistot...</Alert>}
            {errorMessage && <Alert variant={"danger"}>{errorMessage}</Alert>}
            {successMessage && <Alert variant={"success"}>{successMessage}</Alert>}

            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nimi</th>
                        <th>Katuosoite</th>
                        <th>Postinumero</th>
                        <th>Postitoimipaikka</th>
                        <th>Maa</th>
                        <th>Puhelin</th>
                        <th>Sähköposti</th>
                        <th>Muokkaa</th>
                        <th>Poista</th>
                    </tr>
                </thead>

                <tbody>
                    {offices.map((office) => (
                        editOfficeId === office.id ? (
                            <tr key={office.id}>
                                <td>{office.id}</td>
                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedOffice.name}
                                        onChange={(e) => setSelectedOffice({ ...selectedOffice, name: e.target.value })}
                                        />
                                </td>

                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedOffice.address}
                                        onChange={(e) => setSelectedOffice({ ...selectedOffice, address: e.target.value })}
                                        />
                                </td>

                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedOffice.postalCode}
                                        onChange={(e) => setSelectedOffice({ ...selectedOffice, postalCode: e.target.value })}
                                        />
                                </td>

                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedOffice.city}
                                        onChange={(e) => setSelectedOffice({ ...selectedOffice, city: e.target.value })}
                                        />
                                </td>

                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedOffice.country}
                                        onChange={(e) => setSelectedOffice({ ...selectedOffice, country: e.target.value })}
                                        />
                                </td>

                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedOffice.phone}
                                        onChange={(e) => setSelectedOffice({ ...selectedOffice, phone: e.target.value })}
                                        />
                                </td>

                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedOffice.email}
                                        onChange={(e) => setSelectedOffice({ ...selectedOffice, email: e.target.value })}
                                        />
                                </td>

                                <td><Button variant="primary" onClick={() => btnSaveEdits()}>
                                    {loading ? (
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                        ) : (
                                        "Tallenna"
                                    )}
                                    </Button></td>
                                <td><Button variant="danger" disabled>Poista</Button></td>

                            </tr>
                        ) : (
                        <tr key={office.id}>
                            <td>{office.id}</td>
                            <td>{office.name}</td>
                            <td>{office.address}</td>
                            <td>{office.postalCode}</td>
                            <td>{office.city}</td>
                            <td>{office.country}</td>
                            <td>{office.phone}</td>
                            <td>{office.email}</td>
                            <td><Button variant="secondary" onClick={() => btnEditOffice(office)}>Muokkaa</Button></td>
                            <td><Button variant="danger" onClick={() => btnDeleteOffice(office)}>Poista</Button></td>
                        </tr>
                        )
                    ))}
                </tbody>
            </Table>

            <ConfirmModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                title="Poista toimisto"
                message={`Haluatko varmasti poistaa toimiston ${selectedOffice?.name}?`}
                confirmText="Poista"
                cancelText="Peruuta"
                onConfirm={handleDeletion}
            />
        </>
    )
}

export default Offices;