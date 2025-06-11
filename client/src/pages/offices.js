import React, { useState, useEffect } from "react";
import AddOffice from "../components/OfficeAddModal";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

const mainURI = "https://localhost:7017/office";

const Offices = () => {
    const [showAddOffice, setShowAddOffice] = useState(false)
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [offices, setOffices] = useState([]);

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

    const btnEditOffice = () => {

    }

    const btnDeleteOffice = () => {

    }

    useEffect(() => {
        fetchOffices();
    }, []);

    useEffect(() => {
        if (errorMessage) {
            setTimeout(() => {
                setErrorMessage("")
            }, 2500)
        }
    }, [errorMessage]);


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
                    ))}
                </tbody>
            </Table>
        </>
    )
}

export default Offices;