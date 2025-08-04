import React, { useState, useEffect, useRef } from "react";
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
     * Reasoning: useDispatch returns a dispatch function.
     */
    const dispatch = useDispatch();

    /**
     * Loading state from Redux.
     * @type {boolean}
     * Reasoning: Used as a boolean prop for DataGrid's loading.
     */
    const loading = useSelector(state => state.ui.loadingState);

    /**
     * List of office objects from Redux.
     * @type {Array<Object>}
     * Reasoning: Used as options for Autocomplete, so must be an array of objects.
     */
    const offices = useSelector(state => state.offices.offices);

    /**
     * List of property objects from Redux.
     * @type {Array<Object>}
     * Reasoning: Used as rows for DataGrid, so must be an array of objects.
     */
    const properties = useSelector(state => state.properties.properties);

    /**
     * Currently selected office object from Redux.
     * @type {?Object}
     * Reasoning: Used as value for Autocomplete, can be null or an object.
     */
    const selectedOffice = useSelector(state => state.properties.selectedPropertyOffice);

    /**
     * Error and success messages from Redux UI state.
     * @type {{ errorMessage: ?string, successMessage: ?string }}
     * Reasoning: Destructured from state.ui, both can be string or null/undefined.
     */
    const { errorMessage, successMessage } = useSelector(state => state.ui);

    /**
     * Controls visibility of AddEntry modal.
     * @type {[boolean, function]}
     * Reasoning: useState returns [state, setState] tuple, state is boolean.
     */
    const [showAddProperty, setShowAddProperty] = useState(false);

    /**
     * Controls visibility of ConfirmModal.
     * @type {[boolean, function]}
     * Reasoning: useState returns [state, setState] tuple, state is boolean.
     */
    const [showConfirm, setShowConfirm] = useState(false);

    /**
     * Controls visibility of EditEntry modal.
     * @type {[boolean, function]}
     * Reasoning: useState returns [state, setState] tuple, state is boolean.
     */
    const [showEditProperty, setShowEditProperty] = useState(false);

    /**
     * Currently selected property object for editing or deleting.
     * @type {[Object, function]}
     * Reasoning: useState returns [state, setState] tuple, state is an object.
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
     * Reasoning: Result of filtering an array of objects.
     */
    const filteredProperties = selectedOffice
        ? properties.filter(s => s.officeId === selectedOffice.id)
        : properties;

    /**
     * Handles delete button click for a property.
     * @param {Object} property - The property object to delete.
     * @returns {void}
     * Reasoning: Sets state, does not return a value.
     */
    const btnDeleteProperty = (property) => {
        setSelectedProperty(property)
        setShowConfirm(true)
    }

    /**
     * Handles row click in DataGrid for editing.
     * @param {Object} params - DataGrid row params.
     * @returns {void}
     * Reasoning: Sets state, does not return a value.
     */
    const handleRowClick = (params) => {
        setSelectedProperty(params.row);
        setShowEditProperty(true);
    };

    /**
     * Handles closing of AddEntry modal.
     * @returns {void}
     * Reasoning: Sets state and dispatches, does not return a value.
     */
    const handleCloseAddProperty = () => {
        setShowAddProperty(false);
        dispatch(fetchProperties());
    };

    /**
     * Handles closing of EditEntry modal.
     * @returns {void}
     * Reasoning: Sets state and dispatches, does not return a value.
     */
    const handleCloseEditProperty = () => {
        setShowEditProperty(false);
        dispatch(fetchProperties());
    };

    /**
     * Memoized columns for DataGrid.
     * @type {Array<Object>}
     * Reasoning: Result of dataGridColumns, which returns an array of column objects.
     */
    const columns = React.useMemo(() => dataGridColumns(propertySchema, btnDeleteProperty), []);

    /**
     * Ref for the add button.
     * @type {React.MutableRefObject<?HTMLButtonElement>}
     * Reasoning: useRef returns a mutable ref object, initially null.
     */
    const addButtonRef = useRef(null);

    /**
     * Whether any modal is open.
     * @type {boolean}
     * Reasoning: Result of logical OR of booleans.
     */
    const anyModalOpen = showAddProperty || showEditProperty || showConfirm;

    useEffect(() => {
        const bg = document.getElementById("background");
        if (!bg) return;
        if (anyModalOpen) {
            if (document.activeElement && bg && bg.contains(document.activeElement)) {
                document.activeElement.blur();
            }
            bg.setAttribute("inert", "");
        } else {
            bg.removeAttribute("inert");
        }
        // Cleanup: always remove inert on unmount
        return () => {
            if (bg) bg.removeAttribute("inert");
        };
    }, [anyModalOpen]);

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
                extraData={selectedOffice ? { officeId: selectedOffice.id, officeName: selectedOffice.name } : {}}
                onExited={() => addButtonRef.current?.focus()}
                openerRef={addButtonRef}
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