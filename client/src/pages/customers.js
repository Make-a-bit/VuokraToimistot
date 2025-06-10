import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { AddCustomer } from "../components/AddCustomerModal";

const mainURI = "https://localhost:7017";

const CustomerListPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [customers, setCustomers] = useState([]);

    const fetchCustomers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(mainURI + "/customer", {
                method: "GET",
                headers: { "Content-type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(`Error! Status: ${response.status}`);
            }

            const data = await response.json();
            setCustomers(data)
        } catch (error) {
            console.error("Failed to fetch customers:", error);
            setError("Asiakkaiden hakeminen epäonnistui.")
        } finally {
            setLoading(false);
        }
    };

    const editCustomer = () => {

    }

    const deleteCustomer = () => {

    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <>
            <Button onClick={() => setShowAddCustomer(true)}>Lisää uusi asiakas</Button>
            <AddCustomer
                show={showAddCustomer}
                onHide={() => setShowAddCustomer(false)}
                onCustomerAdded={() => fetchCustomers()}
            />

            {loading && <p>Ladataan asiakkaita...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <Table responsive striped bordered hover size="sm">
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
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.phone}</td>
                            <td>{customer.address}</td>
                            <td>{customer.postalCode}</td>
                            <td>{customer.city}</td>
                            <td>{customer.country}</td>
                            <td><Button variant="secondary" onClick={() => editCustomer(customer.id)}>Muokkaa</Button></td>
                            <td><Button variant="danger" onClick={() => deleteCustomer(customer.id)}>Poista</Button></td>
                        </tr>
                    )) }
                </tbody>
            </Table>
        </>
    )
}

export { CustomerListPage }