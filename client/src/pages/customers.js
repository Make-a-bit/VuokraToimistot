import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { AddCustomer } from "../components/AddCustomerModal";

const CustomerListPage = () => {
    const [showAddCustomer, setShowAddCustomer] = useState(false);

    const fetchCustomers = () => {

    }

    return (
        <>
            <Button onClick={() => setShowAddCustomer(true)}>Lisää uusi asiakas</Button>
            <AddCustomer
                show={showAddCustomer}
                onHide={() => setShowAddCustomer(false)}
                onCustomerAdded={() => fetchCustomers()}
                />
        </>
    )
}

export { CustomerListPage }