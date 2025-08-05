import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Paper, Snackbar } from "@mui/material";
import { fetchCustomers } from "../redux/actions/customerActions";
import { fetchDevices } from "../redux/actions/deviceActions";
import { fetchInvoices } from "../redux/actions/invoiceActions";
import { fetchOffices } from "../redux/actions/officeActions";
import { fetchProperties } from "../redux/actions/propertyActions";
import { fetchReservations } from "../redux/actions/reservationActions";
import { fetchServices } from "../redux/actions/serviceActions";
import { fetchTaxes } from "../redux/actions/taxActions";

import useAutoClearMessages from "../hooks/autoClearMessages";

/**
 * Home component for the main page.
 * @function
 * @returns {JSX.Element} The rendered Home component.
 */
const Home = () => {
    /**
     * Redux dispatch function.
     * @type {function}
     */
    const dispatch = useDispatch();

    /**
     * Extracts errorMessage and successMessage from the Redux UI state.
     * @type {{ errorMessage: string | null, successMessage: string | null }}
     * Reasoning: Based on usage, these are either strings or null.
     */
    const { errorMessage, successMessage } = useSelector(
        /**
         * @param {object} state - The Redux state object.
         * @returns {{ errorMessage: string | null, successMessage: string | null }}
         */
        state => state.ui
    );

    /**
     * Custom hook to auto-clear messages.
     * @param {string | null} errorMessage
     * @param {string | null} successMessage
     * Reasoning: Both arguments are string or null, as per state shape.
     */
    useAutoClearMessages(errorMessage, successMessage);

    useEffect(() => {
        dispatch(fetchCustomers());
        dispatch(fetchDevices());
        dispatch(fetchInvoices());
        dispatch(fetchOffices());
        dispatch(fetchProperties());
        dispatch(fetchReservations());
        dispatch(fetchServices());
        dispatch(fetchTaxes());
    }, [dispatch]);

    return (
        <>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: "32px auto" }}>
                <h1>VuokraToimistot APP</h1>
                <h2>Kuvaus</h2>
                <p>VuokraToimistot oli alunperin kouluprojekti vuonna 2024, joka toteutettiin ryhm�ty�n� viiden hengen ryhm�ss�. Teht�v�ss�
                    kuvitteellinen toimistotiloja vuokraava yhti� oli laajentamassa toimintaansa yhdelt� paikkakunnalta useampaan
                    kaupunkiin. Yhti� tarjoaa asiakkaille eri kokoisia, kalustettuja, paikkakunnittain vaihtelevia toimistotiloja
                    vuokralle 1-8 hengelle. Tilojen vuokra-ajat vaihtelevat yhdest� p�iv�st� kuukausiin. Tilojen lis�ksi vuokralle
                    tarjotaan my�s laitteita ja palveluja. Asiakkaita voivat olla yksitt�iset ty�ntekij�t, yritykset sek� yhteis�t.
                </p>

                <p>
                    Toimintaa varten yritys tarvitsi keskitetyn varaus- ja asiakashallintaj�rjestelm�n, jonka tavoitteena on
                    mahdollistaa reaaliaikainen toimipisteiden varaustilanteen seuranta ja raportointi. Teht�v� toteutettiin
                    vesiputousmallilla WPF-sovelluksena MariaDb tietokantaan. Jatkokehitysideana esittelimme web-sovelluksen
                    kehitt�mist� ja sovelluksen siirt�mist� pilvipalveluun. T�m� sovellus toteuttaa t�t� ideaa.
                </p>

                <p>
                    Alkuper�isess� vaatimusm��rittelyss� sovellukseen vaadittiin selke� raportointi sek� laskutusmahdollisuudet 
                    (paperi/s�hk�posti). T�st� versiosta vaatimukset viel� puuttuvat, sill� aika loppui kesken. Edelleen jatkokehitykseen
                    menev�t siis:
                    <ul>
                        <li>Raportointi</li>
                        <li>Laskutusmahdollisuus</li>
                        <li>Logitus taustaj�rjestelm��n</li>
                        <li>Kielituki ja muita v�hemm�n t�rkeit� viilauksia</li>
                    </ul>
                </p>

                <p>
                    Projektin toteuttaminen oli harraste kes�lle 2026. Valitettavasti aivan kaikkea en saanut valmiiksi, sill� muut
                    projektit puskivat p��lle elokuun alkaessa. Sovelluksesta on kuitenkin k�ytett�viss� MVP versio, jossa 
                    API ja k�ytt�liittym� ovat toiminnassa. Sovellus on julkaistu Azuressa seuraavilla resursseilla:
                    <ul>
                        <li>App Service</li>
                        <li>Static Web App</li>
                        <li>SQL database</li>
                    </ul>
                </p>

                <p>
                    Ohessa viel� lyhyesti arkkitehtuuri, jonka p��lle sovellus on toteutettu.<br /><br />
                    <strong>Backend:</strong>
                    <ul>
                        <li>.NET 9 (ASP.NET CORE)</li>
                        <li>RESTful API</li>
                        <li>JWT-pohjainen autentikointi</li>
                        <li>SQL Server tietokantayhteys</li>
                    </ul>

                    <strong>Frontend:</strong>
                    <ul>
                        <li>React (Single page application)</li>
                        <li>Redux & React-Redux</li>
                        <li>MUI (Material UI)</li>
                        <li>Dayjs</li>
                    </ul>
                </p>
            </Paper>

            {errorMessage &&
                <Snackbar
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    open={Boolean(errorMessage)}
                    autoHideDuration={3000}
                >
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
                >
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

export default Home;