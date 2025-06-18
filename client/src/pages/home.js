import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../redux/actions/customerActions"
import { fetchOffices } from "../redux/actions/officeActions"


const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchOffices());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    return (
        <>
            <p>This is homepage</p>
        </>
    )
}

export default Home;