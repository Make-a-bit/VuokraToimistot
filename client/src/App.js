import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Content } from './components/layout/content';
import { Home } from './pages/home'
import { ErrorPage } from './pages/errorpage';


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Content />}>
                    <Route index element={ <Home /> } />
                    <Route path="*" element={<ErrorPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
         );
}

export default App;
