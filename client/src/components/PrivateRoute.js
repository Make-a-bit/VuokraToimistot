import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const loggedUser = useSelector(state => state.login.loggedUser);
    return loggedUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;