import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Content from './components/layout/content';
import Home from './pages/home'
import ErrorPage from './pages/errorpage';
import Customers from "../src/pages/customers";
import Offices from "../src/pages/offices";
import Properties from "../src/pages/properties";
import Services from "../src/pages/services";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Content />}>
                    <Route index element={<Home />} />
                    <Route path="/asiakkaat/" element={<Customers />} />
                    <Route path="/tilahallinta/" element={<ErrorPage />} />
                    <Route path="/tilahallinta/kohteet/" element={<Offices />} />
                    <Route path="/tilahallinta/vuokratilat/" element={<Properties />} />
                    <Route path="/tilahallinta/palvelut/" element={<Services/> } />
                    <Route path="*" element={<ErrorPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
         );
}

export default App;
