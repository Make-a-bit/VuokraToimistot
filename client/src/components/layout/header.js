import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import NavDropdown from "react-bootstrap/NavDropdown"

const Header = () => {

    const navLinks = [
        { path: "/", label: "Etusivu" },
        {
            label: "Asiakkaat",
            dropdown: [
                { path: "/customers/new", label: "Lisää uusi" },
                { path: "/customers/", label: "Kaikki asiakkaat" }
            ]
        },
    ]

    return (
        <Navbar expand="lg" bg="success-subtle" className="mb-3">
            <Container>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        {navLinks.map(({ path, label, dropdown }) => (
                        dropdown ? (
                            <NavDropdown title={label} key={label} id="customers-dropdown">
                                {dropdown.map(({ path, label }) => (
                                    <NavDropdown.Item as={NavLink}
                                        to={path}
                                        key={path}
                                        className={({ isActive }) =>
                                            "dropdown-item" + (isActive ? "active" : "")}>{label}</NavDropdown.Item>
                                ))}
                            </NavDropdown>
                        ) : (
                        <Nav.Link
                            as={NavLink}
                            key={path}
                            to={path}
                            end
                            className={({ isActive }) =>
                                'nav-link' + (isActive ? ' active border-bottom border-success' : '')}>{label}
                        </Nav.Link>
                        )))}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export { Header };