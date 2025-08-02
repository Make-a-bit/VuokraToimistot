import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import {
    Box, Button, FormControl, IconButton, InputAdornment,
    InputLabel, OutlinedInput, Paper, TextField
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { loginUser } from "../redux/actions/loginActions";

/**
 * Login component for user authentication.
 * @function
 * @returns {JSX.Element}
 */
const Login = () => {
    /**
     * Redux dispatch function.
     * @type {function}
     */
    const dispatch = useDispatch();

    /**
     * React Router navigation function.
     * @type {function}
     */
    const navigate = useNavigate();

    /**
     * Login error message from Redux state.
     * @type {string|null}
     */
    const loginError = useSelector(
        /** @param {object} state */
        state => state.login.loginError
    );

    /**
     * Logged in user object from Redux state.
     * @type {object|null}
     */
    const loggedUser = useSelector(
        /** @param {object} state */
        state => state.login.loggedUser
    );

    /**
     * Loading state from Redux UI slice.
     * @type {boolean}
     */
    const loading = useSelector(
        /** @param {object} state */
        state => state.ui.loadingState
    );

    /**
     * Username input value.
     * @type {[string, function]}
     */
    const [username, setUsername] = useState("");

    /**
     * Password input value.
     * @type {[string, function]}
     */
    const [password, setPassword] = useState("");

    /**
     * Show/hide password state.
     * @type {[boolean, function]}
     */
    const [showPassword, setShowPassword] = useState(false);

    /**
     * Ref for the username input field.
     * @type {React.MutableRefObject<HTMLInputElement|null>}
     */
    const usernameRef = useRef(null);

    /**
     * Toggles the visibility of the password field.
     * @function
     * @returns {void}
     */
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    /**
     * Prevents default mouse down behavior on password visibility toggle.
     * @function
     * @param {React.MouseEvent<HTMLButtonElement>} event
     * @returns {void}
     */
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    /**
     * Prevents default mouse up behavior on password visibility toggle.
     * @function
     * @param {React.MouseEvent<HTMLButtonElement>} event
     * @returns {void}
     */
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    /**
     * Handles form submission for login.
     * @function
     * @param {React.FormEvent<HTMLFormElement>} e
     * @returns {void}
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        /**
         * Payload for login action.
         * @type {{username: string, password: string}}
         */
        const payload = { username, password }

        dispatch(loginUser(payload))
        setUsername("");
        setPassword("");
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    }

    useEffect(() => {
        if (loggedUser) {
            navigate("/home");
        }
    }, [loggedUser, navigate]);

    useEffect(() => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    }, []);

    if (loggedUser) {
        return <Navigate to="/home" replace />;
    }

    return (
        <>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "50vh",
            }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minWidth: 320
                    }}
                >

                    <form
                        onSubmit={handleSubmit}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <TextField
                                required
                                label="Käyttäjänimi"
                                id="outlined-required"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                inputRef={usernameRef}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Salasana*</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <Button
                                disabled={!username || !password || loading}
                                variant="contained"
                                color="success"
                                type="submit"
                            >Kirjaudu</Button>
                        </FormControl>
                    </form>
                </Paper>
            </Box>
        </>
    )
}

export default Login;