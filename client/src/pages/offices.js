import React, { useState, useEffect } from "react";
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import inputValidation from "../utils/inputValidation";
import officeSchema from "../schema/office";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

const mainURI = "https://localhost:7017/office";

const Offices = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [showAddOffice, setShowAddOffice] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false);

    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState({});

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
            setErrorMessage("Kohteiden hakeminen epäonnistui.")
        } finally {
            setLoading(false);
        }
    }

    const officeAdded = () => {
        setSuccessMessage("Kohteen tallennus onnistui!");
        fetchOffices();
    }

    const btnDeleteOffice = (office) => {
        setSelectedOffice(office)
        setShowConfirm(true)
    }

    const columns = React.useMemo(() => dataGridColumns(officeSchema, btnDeleteOffice), []);

    const handleDeletion = async () => {
        setLoading(true)
        try {
            await fetch(`${mainURI}/delete/${selectedOffice.id}`, {
                method: "DELETE"
            })
            setSuccessMessage("Kohteen poistaminen onnistui");
            fetchOffices();
        } catch {
            console.log("Error while deleting office");
            setErrorMessage("Kohteen poistaminen ei onnistunut");
        } finally {
            setLoading(false)
        }
    }

    const btnSaveEdits = async (updatedRow, originalRow) => {
        const requiredFields = ['name', 'address', 'postalCode', 'city', 'country', 'phone', 'email']
        const isValid = inputValidation(updatedRow, requiredFields);

        if (!isValid) {
            setErrorMessage("Täytä kaikki kentät!");
            return originalRow;
        }

        try {
            const response = await fetch(`${mainURI}/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedOffice),
            });

            if (response.ok) {
                await fetchOffices();
                setSelectedOffice(null)
                setSuccessMessage("Toimiston tietojen päivitys onnistui!")
            }
        } catch (error) {
            console.log("Error while saving edited office data:", error)
            setErrorMessage("Virhe tietojen päivityksessä!")
            return originalRow;
        }
    }

    const modalClosed = () => {
        setShowAddOffice(false)
        setErrorMessage("");
    }

    useEffect(() => {
        fetchOffices();
    }, []);

    return (
        <>
            <Button
                variant="contained"
                sx={{ marginBottom: "-10px" }}
                onClick={() => setShowAddOffice(true)}>Lisää uusi kohde</Button>

            <AddEntry
                schema={officeSchema}
                apiEndPoint={mainURI}
                show={showAddOffice}
                onHide={modalClosed}
                title="Lisää uusi kohde"
                onAdded={() => officeAdded()}
            /><br /><br />

            {errorMessage &&
                <Snackbar
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    open={Boolean(errorMessage)}
                    onClose={() => setErrorMessage("")}
                    autoHideDuration={3000}>
                    <Alert
                        color="warning"
                        severity="warning"
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
                    onClose={() => setSuccessMessage("")}
                    autoHideDuration={3000}>
                    <Alert
                        color="success"
                        severity="success"
                        variant="filled"
                        sx={{ border: "1px solid #000", width: "100%" }}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            }
            {loading && <Alert variant="outlined" severity="info">Ladataan kohteita...</Alert>}
            {offices.length > 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Kaksoisklikkaa solua muokataksesi sisältöä. Poistu solusta tallentaaksesi.
                </Typography>
            )}

            <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                    rows={offices}
                    columns={columns}
                    disableRowSelectionOnClick
                    processRowUpdate={btnSaveEdits}
                    onProcessRowUpdateError={(error) => {
                        console.log("Row update error:", error);
                        setErrorMessage("Tietojen tallennus epäonnistui");
                    }}
                    experimentalFeatures={{ newEditingApi: true }}
                    sx={dataGridSx}
                />
            </div>

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