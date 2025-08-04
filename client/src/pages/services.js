import React, { useState, useEffect , useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Alert, Autocomplete, Box, Button, FormControl, Snackbar, TextField
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
    addOfficeService, deleteService, editService,
    fetchServices, setOffice
} from "../redux/actions/serviceActions"
import AddEntry from "../components/AddEntryModal";
import ConfirmModal from "../components/ConfirmModal";
import EditEntry from "../components/EditEntryModal";
import dataGridColumns from "../utils/datagridcolumns";
import dataGridSx from "../utils/dataGridSx";
import serviceSchema from "../schema/service";
import useAutoClearMessages from "../hooks/autoClearMessages";
import mainURI from "../constants/apiEndpoint";

/**
 * 
 * @returns
 * Services page component.
 * @returns {JSX.Element}
 */
const Services = () => {
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
     * List of service objects from Redux.
     * @type {Array<Object>}
     */
    const services = useSelector(state => state.services.services);

    /**
     * Currently selected office object from Redux.
     * @type {?Object}
     */
    const selectedOffice = useSelector(state => state.services.selectedServiceOffice);

    /**
     * Error and success messages from Redux UI state.
     * @type {{ errorMessage: ?string, successMessage: ?string }}
     */
    const { errorMessage, successMessage } = useSelector(state => state.ui);

    /**
     * Controls visibility of Add Service modal.
     * @type {[boolean, function]}
     */
    const [showAddService, setShowAddService] = useState(false);

    /**
     * Controls visibility of Confirm modal.
     * @type {[boolean, function]}
     */
    const [showConfirm, setShowConfirm] = useState(false);

    /**
     * Controls visibility of Edit Service modal.
     * @type {[boolean, function]}
     */
    const [showEditService, setShowEditService] = useState(false);

    /**
     * Currently selected service object for editing or deleting.
     * @type {[Object, function]}
     */
    const [selectedService, setSelectedService] = useState({});

    useAutoClearMessages(errorMessage, successMessage);

    /**
     * Handles closing the Add Service modal and refreshes services.
     * @returns {void}
     */
    const handleCloseAddService = () => {
        setShowAddService(false);
        dispatch(fetchServices());
    };

    /**
     * Handles closing the Edit Service modal and refreshes services.
     * @returns {void}
     */
    const handleCloseEditService = () => {
        setShowEditService(false);
        dispatch(fetchServices());
    };

    /**
     * Handles row click in the DataGrid to open Edit Service modal.
     * @param {Object} params - DataGrid row params.
     * @returns {void}
     */
    const handleRowClick = (params) => {
        setSelectedService(params.row);
        setShowEditService(true);
    };

    /**
     * Filters services by selected office.
     * @type {Array<Object>}
     */
    const filteredServices = selectedOffice
        ? services.filter(s => s.officeId === selectedOffice.id)
        : services;

    /**
     * Handles delete button click for a service.
     * @param {Object} service - Service object to delete.
     * @returns {void}
     */
    const btnDeleteService = (service) => {
        setSelectedService(service)
        setShowConfirm(true)
    }

    /**
     * Memoized columns for DataGrid.
     * @type {Array<Object>}
     */
    const columns = React.useMemo(() => dataGridColumns(serviceSchema, btnDeleteService), []);

    const addButtonRef = useRef(null);

    const anyModalOpen = showAddService || showEditService || showConfirm;

    useEffect(() => {
        const bg = document.getElementById("background");
        if (!bg) return;
        if (anyModalOpen) {
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
                        onChange={(_, newValue) => dispatch(setOffice(newValue))}
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
                    marginTop: "10px",
                    marginBottom: "10px"
                }}
                onClick={() => setShowAddService(true)}
            >
                Lisää uusi palvelu
            </Button>

            <AddEntry
                schema={serviceSchema}
                apiEndPoint={`${mainURI}/service`}
                show={showAddService}
                onHide={handleCloseAddService}
                title={`Lisää uusi palvelu kohteeseen ${selectedOffice ? selectedOffice.name : ""}`}
                action={addOfficeService}
                extraData={selectedOffice ? { officeId: selectedOffice.id } : {}}
                onExited={() => addButtonRef.current?.focus()}
                openerRef={addButtonRef}
            />

            <EditEntry
                schema={serviceSchema}
                apiEndPoint={`${mainURI}/service/update`}
                show={showEditService}
                onHide={handleCloseEditService}
                title={`Muokkaa lisäpalvelua ${selectedService ? selectedService.name : ""}`}
                action={editService}
                entry={selectedService}
                onClose={() => setShowEditService(false)}
            />

            <div style={{ height: "auto", width: "100%" }}>
                <DataGrid
                    rows={filteredServices}
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
                title="Poista palvelu"
                message={`Haluatko varmasti poistaa palvelun ${selectedService?.name}?`}
                confirmText="Poista"
                cancelText="Peruuta"
                onConfirm={() => dispatch(deleteService(selectedService))}
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

export default Services;