import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Content from './components/layout/content';
import Home from './pages/home'
import ErrorPage from './pages/errorpage';
import Customers from "../src/pages/customers";
import Devices from "../src/pages/devices";
import Invoices from "../src/pages/Invoices";
import Offices from "../src/pages/offices";
import Properties from "../src/pages/properties";
import Reservation from "../src/pages/reservation";
import Services from "../src/pages/services";
import Taxes from "../src/pages/taxes";

const App = () => {
    return (
        <BrowserRouter
            future={{
                v7_relativeSplatPath: true,
                v7_startTransition: true
            }}>
            <Routes>
                <Route path="/" element={<Content />}>
                    <Route index element={<Home />} />
                    <Route path="/asiakkaat/" element={<Customers />} />
                    <Route path="/tilahallinta/" element={<ErrorPage />} />
                    <Route path="/tilahallinta/kohteet/" element={<Offices />} />
                    <Route path="/tilahallinta/vuokratilat/" element={<Properties />} />
                    <Route path="/tilahallinta/palvelut/" element={<Services />} />
                    <Route path="/tilahallinta/laitteet/" element={<Devices />} />
                    <Route path="/varaushallinta/" element={<Reservation />} />
                    <Route path="/laskutus/" element={<Invoices />} />
                    <Route path="/verot/" element={<Taxes />} />
                    <Route path="*" element={<ErrorPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
