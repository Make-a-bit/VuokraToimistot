import React, { useState, useEffect } from "react";
import {
    Alert, Autocomplete, Box, Button, FormControl, Snackbar, TextField
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import EditEntry from "../components/EditEntryModal";
import propertySchema from "../schema/property";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";
import { useDispatch, useSelector } from "react-redux";
import {
    addProperty, deleteProperty, editProperty,
    fetchProperties, setPropertyOffice
} from "../redux/actions/propertyActions";
import useAutoClearMessages from "../hooks/autoClearMessages";
import mainURI from "../constants/apiEndpoint";

/**
 * Properties page component.
 * @returns {JSX.Element}
 */
const Properties = () => {
    /**
     * Redux dispatch function.
     * @type {function}
     */
    const dispatch = useDispatch();

    /**
     * Loading state from Redux.
     * @type {boolean}
     */
    const loading = useSelector(state => state.ui.loadingState);

    /**
     * List of office objects from Redux.
     * @type {Array<Object>}
     */
    const offices = useSelector(state => state.offices.offices);

    /**
     * List of property objects from Redux.
     * @type {Array<Object>}
     */
    const properties = useSelector(state => state.properties.properties);

    /**
     * Currently selected office object from Redux.
     * @type {?Object}
     */
    const selectedOffice = useSelector(state => state.properties.selectedPropertyOffice);

    /**
     * Error and success messages from Redux UI state.
     * @type {{ errorMessage: ?string, successMessage: ?string }}
     */
    const { errorMessage, successMessage } = useSelector(state => state.ui);

    /**
     * Controls visibility of AddEntry modal.
     * @type {[boolean, function]}
     */
    const [showAddProperty, setShowAddProperty] = useState(false);

    /**
     * Controls visibility of ConfirmModal.
     * @type {[boolean, function]}
     */
    const [showConfirm, setShowConfirm] = useState(false);

    /**
     * Controls visibility of EditEntry modal.
     * @type {[boolean, function]}
     */
    const [showEditProperty, setShowEditProperty] = useState(false);

    /**
     * Currently selected property object for editing or deleting.
     * @type {[Object, function]}
     */
    const [selectedProperty, setSelectedProperty] = useState({});

    useAutoClearMessages(errorMessage, successMessage);

    useEffect(() => {
        if (selectedOffice && !offices.find(o => o.id === selectedOffice.id)) {
            dispatch(setPropertyOffice(null));
        }
    }, [selectedOffice, offices, dispatch]);

    /**
     * Filtered properties based on selected office.
     * @type {Array<Object>}
     */
    const filteredProperties = selectedOffice
        ? properties.filter(s => s.officeId === selectedOffice.id)
        : properties;

    /**
     * Handles delete button click for a property.
     * @param {Object} property
     */
    const btnDeleteProperty = (property) => {
        setSelectedProperty(property)
        setShowConfirm(true)
    }

    /**
     * Handles row click in DataGrid for editing.
     * @param {Object} params
     */
    const handleRowClick = (params) => {
        setSelectedProperty(params.row);
        setShowEditProperty(true);
    };

    /**
     * Handles closing of AddEntry modal.
     */
    const handleCloseAddProperty = () => {
        setShowAddProperty(false);
        dispatch(fetchProperties());
    };

    /**
     * Handles closing of EditEntry modal.
     */
    const handleCloseEditProperty = () => {
        setShowEditProperty(false);
        dispatch(fetchProperties());
    };

    useAutoClearMessages(errorMessage, successMessage);

    /**
     * Memoized columns for DataGrid.
     * @type {Array<Object>}
     */
    const columns = React.useMemo(() => dataGridColumns(propertySchema, btnDeleteProperty), []);
    return (
        <>
            <Box sx={{ marginTop: "20px", width: "200px" }}>
                <FormControl>
                    <Autocomplete
                        options={offices}
                        getOptionLabel={(option) => option.name}
                        value={selectedOffice || null}
                        onChange={(_, newValue) => dispatch(setPropertyOffice(newValue))}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} label="Valitse kohde" variant="outlined" />
                        )}
                        sx={{ width: "300px" }}
                    />
                </FormControl>
            </Box>

            <Button
                variant="contained"
                disabled={!selectedOffice}
                sx={{
                    marginBottom: "10px",
                    marginTop: "10px"
                }}
                onClick={() => setShowAddProperty(true)}
            >
                Lisää uusi vuokratila
            </Button>

            <AddEntry
                schema={propertySchema}
                apiEndPoint={`${mainURI}/property`}
                show={showAddProperty}
                onHide={handleCloseAddProperty}
                title="Lisää uusi vuokratila"
                action={addProperty}
                extraData={selectedOffice ? { officeId: selectedOffice.id } : {}}
            />

            <EditEntry
                schema={propertySchema}
                apiEndPoint={`${mainURI}/property/update`}
                show={showEditProperty}
                onHide={handleCloseEditProperty}
                title={`Muokkaa vuokratilaa ${selectedProperty ? selectedProperty.name : ""}`}
                action={editProperty}
                entry={selectedProperty}
                onClose={() => setShowEditProperty(false)}
            />

            <div style={{ height: "auto", width: "100%" }}>
                <DataGrid
                    rows={filteredProperties}
                    columns={columns}
                    disableRowSelectionOnClick
                    onRowClick={handleRowClick}
                    loading={loading}
                    slotProps={{
                        loadingOverlay: {
                            variant: "linear-progress",
                            noRowsVariant: "skeleton"
                        },
                    }}
                    sx={dataGridSx}
                />
            </div>

            <ConfirmModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                title="Poista vuokrakohde"
                message={`Haluatko varmasti poistaa vuokrakohteen ${selectedProperty?.name}?`}
                confirmText="Poista"
                cancelText="Peruuta"
                onConfirm={() => dispatch(deleteProperty(selectedProperty))}
            />

            {errorMessage &&
                <Snackbar
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    open={Boolean(errorMessage)}
                    autoHideDuration={3000}>
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
        </>
    )
}

export default Properties;