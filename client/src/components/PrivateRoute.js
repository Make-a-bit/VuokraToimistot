// Reasoning: React is imported as a module object.
/** @type {import("react")} */
import React from "react";

// Reasoning: useSelector is a function from react-redux.
/** @type {import("react-redux").useSelector} */
import { useSelector } from "react-redux";

// Reasoning: Navigate and Outlet are React components from react-router-dom.
/** @type {import("react-router-dom").Navigate} */
import { Navigate, Outlet } from "react-router-dom";

/**
 * PrivateRoute component restricts access to authenticated users.
 * @function
 * @returns {JSX.Element} Renders child routes if user is logged in, otherwise redirects to login.
 */
const PrivateRoute = () => {
    // Reasoning: loggedUser is likely an object or null, based on authentication state.
    /** @type {object|null} */
    const loggedUser = useSelector(state => state.login.loggedUser);
    return loggedUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;