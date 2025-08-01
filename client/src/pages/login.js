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

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginError = useSelector(state => state.login.loginError);
    const loggedUser = useSelector(state => state.login.loggedUser);
    const loading = useSelector(state => state.ui.loadingState)

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const usernameRef = useRef(null);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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