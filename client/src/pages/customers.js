import React, { useState, useEffect } from "react";
import AddCustomer from "../components/CustomerAddModal";
import ConfirmModal from "../components/ConfirmModal";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

const mainURI = "https://localhost:7017/customer";

const Customers = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const errorState = error !== "";

    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [customers, setCustomers] = useState([]);

    const [selectedCustomer, setSelectedCustomer] = useState({});
    const [editCustomerId, setEditCustomerId] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const fetchCustomers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(mainURI, {
                method: "GET",
                headers: { "Content-type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(`Error! Status: ${response.status}`);
            }

            const data = await response.json();
            setCustomers(data)
        } catch (error) {
            console.log("Failed to fetch customers:", error);
            setError("Asiakkaiden hakeminen epäonnistui.")
        } finally {
            setLoading(false);
        }
    };

    const btnEditCustomer = (customer) => {
        setSelectedCustomer(customer);
        setEditCustomerId(customer.id);
    }

    const btnDeleteCustomer = (customer) => {
        setSelectedCustomer(customer);
        setShowConfirm(true);
    }

    const handleDeletion = async () => {
        try {
            await fetch(`${mainURI}/delete/${selectedCustomer.id}`, {
                method: "DELETE"
            })
            setSuccess(true)
            setSuccessMessage("Asiakkaan poistaminen onnistui!");
            fetchCustomers();
        } catch {
            console.log("Error while deleting customer")
            setError("Asiakkaan poistaminen ei onnistunut")
        }
    }

    const btnSaveEdits = async () => {
        const requiredFields = ['name', 'email', 'phone', 'address', 'postalCode', 'city', 'country'];
        const isValid = requiredFields.every(
            key => String(selectedCustomer[key] || "").trim() !== ""
        );

        if (!isValid) {
            setError("Täytä kaikki kentät!")
            return;
        }

        const response = await fetch(`${mainURI}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedCustomer),
        });

        if (response.ok) {
            await fetchCustomers();
            setSelectedCustomer(null);
            setEditCustomerId(null);
            setSuccess(true);
            setSuccessMessage("Asiakastietojen päivitys onnistui!")
        } else {
            console.log("Error while saving edited customer data")
            setError("Virhe tallennettaessa asiakastietoja.")
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                setSuccess(false)
            }, 2500)
        }
    }, [success])

    return (
        <>
            <Button onClick={() => setShowAddCustomer(true)}>Lisää uusi asiakas</Button>
            <AddCustomer
                show={showAddCustomer}
                onHide={() => setShowAddCustomer(false)}
                onCustomerAdded={() => fetchCustomers()}
            /><br /><br />

            {loading && <Alert variant={"info"}>Ladataan asiakkaita...</Alert>}
            {errorState && <Alert variant={"danger"}>{error}</Alert>}
            {success && <Alert variant={"success"}>{successMessage}</Alert>}

            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nimi</th>
                        <th>Sähköposti</th>
                        <th>Puhelin</th>
                        <th>Katuosoite</th>
                        <th>Postinumero</th>
                        <th>Postitoimipaikka</th>
                        <th>Maa</th>
                        <th>Muokkaa</th>
                        <th>Poista</th>
                    </tr>
                </thead>

                <tbody>
                    {customers.map((customer) => (
                        editCustomerId === customer.id ? (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedCustomer.name}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })}
                                    />
                                </td>

                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedCustomer.email}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })}
                                    />
                                </td>

                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedCustomer.phone}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
                                    />
                                </td>

                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedCustomer.address}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, address: e.target.value })}
                                    />
                                </td>

                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedCustomer.postalCode}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, postalCode: e.target.value })}
                                    />
                                </td>

                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedCustomer.city}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, city: e.target.value })}
                                    />
                                </td>

                                <td>
                                    <Form.Control
                                        type="text"
                                        value={selectedCustomer.country}
                                        onChange={(e) => setSelectedCustomer({ ...selectedCustomer, country: e.target.value })}
                                    />
                                </td>

                                <td><Button variant="primary" onClick={() => btnSaveEdits()}>Tallenna</Button></td>
                                <td><Button variant="danger" disabled>Poista</Button></td>
                            </tr>
                        ) : (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.address}</td>
                                <td>{customer.postalCode}</td>
                                <td>{customer.city}</td>
                                <td>{customer.country}</td>
                                <td><Button variant="secondary" onClick={() => btnEditCustomer(customer)}>Muokkaa</Button></td>
                                <td><Button variant="danger" onClick={() => btnDeleteCustomer(customer)}>Poista</Button></td>
                            </tr>
                        )
                    ))}
                </tbody>
            </Table>

            <ConfirmModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                title="Poista asiakas"
                message={`Haluatko varmasti poistaa asiakkaan ${selectedCustomer?.name}?`}
                confirmText="Poista"
                cancelText="Peruuta"
                onConfirm={handleDeletion}
            />
        </>
    )
}

export default Customers;