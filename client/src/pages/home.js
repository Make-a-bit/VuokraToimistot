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
                <p>VuokraToimistot oli alunperin kouluprojekti vuonna 2024, joka toteutettiin ryhmätyönä viiden hengen ryhmässä. Tehtävässä
                    kuvitteellinen toimistotiloja vuokraava yhtiö oli laajentamassa toimintaansa yhdeltä paikkakunnalta useaan
                    kaupunkiin. Yhtiö tarjoaa asiakkaille eri kokoisia, kalustettuja, paikkakunnittain vaihtelevia toimistotiloja
                    vuokralle 1-8 hengelle. Tilojen vuokra-ajat vaihtelevat yhdestä päivästä useisiin kuukausiin. Tilojen lisäksi vuokralle
                    tarjotaan myös laitteita ja palveluja. Asiakkaita voivat olla yksittäiset työntekijät, yritykset sekä yhteisöt.
                </p>

                <p>
                    Toimintaa varten yritys tarvitsi keskitetyn varaus- ja asiakashallintajärjestelmän, jonka tavoitteena on
                    mahdollistaa reaaliaikainen toimipisteiden varaustilanteen seuranta ja raportointi. Alkuperäinen toteutus tehtiin
                    WPF-sovelluksena käyttäen vesiputousmallia ja MariaDB-tietokantaa. Osana jatkokehitysehdotuksia esille tuotiin ajatus
                    web-sovelluksen rakentamisesta ja pilvipalveluun siirtymisestä. Nykyinen sovellus on tämän kehityssuunnan ensimmäinen toteutus.
                </p>

                <p>
                    Vein projektia itsenäisesti eteenpäin harrastepohjalta kesällä 2026. Sovelluksen kehitys oli paikoin haastavaa, erityisesti
                    käyttöliittymän osalta, ja joidenkin toimintojen kanssa tuli painittua pitkään. Suunnittelun puutteet aiheuttivat lisätyötä
                    kehitysvaiheessa, mikä johti useiden asioiden tekemiseen useampaan kertaan. Projektin aikana opettelin myös Reactin ja Reduxin
                    käyttöä. Lopputuloksena syntyi MVP-versio, jossa API, tietokanta ja käyttöliittymä toimivat yhdessä. Sovellus on julkaistu
                    Microsoft Azuressa seuraavilla resursseilla:
                    <ul>
                        <li>App Service</li>
                        <li>Static Web App</li>
                        <li>SQL database</li>
                    </ul>
                </p>

                <p>
                    Alkuperäisessä vaatimusmäärittelyssä sovellukseen vaadittiin selkeä raportointi sekä laskutusmahdollisuudet
                    (paperi/sähköposti). Kaikkea en kuitenkaan ehtinyt toteuttamaan valmiiksi, sillä
                    elokuun alkaessa muut projektit veivät ajan. Seuraavat kehityskohteet ovat edelleen työn alla:
                    <ul>
                        <li>Raportointi</li>
                        <li>Laskutusmahdollisuus</li>
                        <li>Logitus taustajärjestelmään</li>
                        <li>Kielituki ja muita vähemmän tärkeitä viilauksia</li>
                    </ul>
                </p>

                <p>
                    Ohessa vielä lyhyesti arkkitehtuuri, jonka päälle sovellus on toteutettu.<br /><br />
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

                    <strong>Projektin- ja versionhallinta</strong>
                    <ul>
                        <li><strong>Projektinhallinta:</strong> Azure DevOps</li>
                        <li><strong>Versionhallinta:</strong> Git</li>
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