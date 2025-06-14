import React, { useState, useEffect, useMemo } from "react";
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import inputValidation from "../utils/inputValidation";
import customerSchema from "../schema/customer";
import dataGridColumns from "../utils/datagridcolumns";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

const mainURI = "https://localhost:7017/customer";

const Customers = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState({});

    const fetchCustomers = async () => {
        setLoading(true);
        setErrorMessage("");

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
            setErrorMessage("Asiakkaiden hakeminen epäonnistui!")
        } finally {
            setLoading(false);
        }
    };

    const customerAdded = () => {
        setSuccessMessage("Asiakkaan tallennus onnistui!");
        fetchCustomers();
    }

    const btnDeleteCustomer = (customer) => {
        setSelectedCustomer(customer);
        setShowConfirm(true);
    }

    const columns = React.useMemo(() => dataGridColumns(customerSchema, btnDeleteCustomer), []);

    const handleDeletion = async () => {
        try {
            await fetch(`${mainURI}/delete/${selectedCustomer.id}`, {
                method: "DELETE"
            })
            setSuccessMessage("Asiakkaan poistaminen onnistui!");
            fetchCustomers();
        } catch {
            console.log("Error while deleting customer")
            setErrorMessage("Asiakkaan poistaminen ei onnistunut!")
        }
    }

    const btnSaveEdits = async (updatedRow, originalRow) => {
        const requiredFields = ["name", "email", "phone", "address", "postalCode", "city", "country"];
        const isValid = inputValidation(updatedRow, requiredFields);

        if (!isValid) {
            setErrorMessage("Täytä kaikki kentät!")
            return originalRow;
        }

        try {
            const response = await fetch(`${mainURI}/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedRow),
            });

            if (response.ok) {
                setSuccessMessage("Asiakastietojen päivitys onnistui!")
                return updatedRow;
            }
        }
        catch (error) {
            console.log("Error while saving edited customer data:", error)
            setErrorMessage("Virhe tietojen päivityksessä!")
            return originalRow;
        }
    }

    const modalClosed = () => {
        setShowAddCustomer(false)
        setErrorMessage("");
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <>
            <Button
                variant="contained"
                sx={{ marginBottom: "-10px" }}
                onClick={() => setShowAddCustomer(true)}>Lisää uusi asiakas</Button>

            <AddEntry
                schema={customerSchema}
                apiEndPoint={mainURI}
                show={showAddCustomer}
                onHide={modalClosed}
                title="Lisää uusi asiakas"
                onAdded={() => customerAdded()}
            /><br /><br />

            {errorMessage &&
                <Snackbar
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    open={Boolean(errorMessage)}
                    autoHideDuration={3000}
                    onClose={() => setErrorMessage("")}>
                    <Alert
                        color="error"
                        severity="error"
                        variant="filled"
                        sx={{ border: "1px solid #000", width: "100%" }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
            }

            {successMessage &&
                <Snackbar
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    open={Boolean(successMessage)}
                    autoHideDuration={3000}
                    onClose={() => setSuccessMessage("")}>
                    <Alert
                        color="success"
                        severity="success"
                        variant="filled"
                        sx={{ border: "1px solid #000", width: "100%" }}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            }

            { loading && <Alert variant="outlined" severity="info">Ladataan asiakkaita...</Alert> }
            { customers.length > 0 && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                 Kaksoisklikkaa solua muokataksesi sitä. Poistu solusta tallentaaksesi.
                </Typography>
            )}

            <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                    rows={customers}
                    columns={columns}
                    disableRowSelectionOnClick
                    processRowUpdate={btnSaveEdits}
                    onProcessRowUpdateError={(error) => {
                        console.log("Row update error:", error);
                        setErrorMessage("Tietojen tallennus epäonnistui!");
                    }}
                    experimentalFeatures={{ newEditingApi: true }}
                />
            </div>

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