import React, { useState } from "react";
import { Route, Routes, useLocation, NavLink } from "react-router-dom";

const Header = () => {
    return (         
        <nav className="navbar navbar-expand-lg bg-success-subtle">
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
                        <ul className="navbar-nav">
                        <li className="nav-item active pe-3">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    'nav-link' + (isActive ? ' active border-bottom border-success' : '')}>Etusivu</NavLink>
                        </li>
                        </ul> 
                </div>
            </div>
        </nav>
    )
}

export { Header };