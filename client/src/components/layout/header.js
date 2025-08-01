import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import navigationLinks from '../../constants/navigation';
import { AppBar, Box, Button, Container, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { logoutUser } from "../../redux/actions/loginActions";

const Header = () => {
    const [anchorEls, setAnchorEls] = useState({});
    const location = useLocation();
    const dispatch = useDispatch();
    const loggedUser = useSelector(state => state.login.loggedUser);

    // Open dropdown menu for key
    const handleMenuOpen = (event, key) => {
        setAnchorEls(prev => ({ ...prev, [key]: event.currentTarget }));
    };

    // Close dropdown menu for key
    const handleMenuClose = (key) => {
        setAnchorEls(prev => ({ ...prev, [key]: null }));
    };

    // Check if any dropdown link is active
    const isDropdownActive = (dropdown) =>
        dropdown.some(link => location.pathname === link.path);

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{ bgcolor: "transparent", mb: 3 }}
        >
            <Container
                maxWidth="xl"
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    bgcolor: "white",
                    pt: 1,
                }}
            >
                {loggedUser && (
                    <>
                        <Typography color="black" variant="body1">
                            Kirjautuneena: <b>{loggedUser}</b>
                        </Typography>
                        <Box sx={{ mx: 1, color: "black" }}>|</Box>
                        <Button
                            color="inherit"
                            variant="text"
                            size="small"
                            onClick={() => dispatch(logoutUser())}
                            sx={{
                                color: "black",
                                fontWeight: 600,
                                letterSpacing: 1
                            }}
                        >
                            KIRJAUDU ULOS
                        </Button>
                    </>
                )}
            </Container>

            <Container
                maxWidth="xl"
                sx={{
                    bgcolor: "success.light",
                    borderRadius: 2,
                    minHeight: 64,
                }}
            >

                <Toolbar disableGutters>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {navigationLinks.map(({ path, label, dropdown }) => {
                            if (dropdown) {
                                const open = Boolean(anchorEls[label]);
                                const dropdownActive = dropdown.some(link => location.pathname.startsWith(link.path));
                                return (
                                    <Box key={label}>
                                        <Button
                                            onClick={(e) => handleMenuOpen(e, label)}
                                            sx={{
                                                color: dropdownActive ? 'yellow' : 'white', // Highlight if active
                                                fontWeight: dropdownActive ? 700 : 400,
                                                textTransform: 'none',
                                                borderRadius: 0,
                                            }}
                                            aria-controls={open ? `${label}-menu` : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                        >
                                            {label}
                                        </Button>
                                        <Menu
                                            id={`${label}-menu`}
                                            anchorEl={anchorEls[label]}
                                            open={open}
                                            onClose={() => handleMenuClose(label)}
                                            MenuListProps={{
                                                'aria-labelledby': `${label}-button`,
                                            }}
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                            keepMounted
                                        >
                                            {dropdown.map(({ path: subPath, label: subLabel }) => (
                                                <MenuItem
                                                    key={subPath}
                                                    component={NavLink}
                                                    to={subPath}
                                                    onClick={() => handleMenuClose(label)}
                                                    sx={{
                                                        color: 'black',
                                                    }}
                                                >
                                                    {subLabel}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </Box>
                                );
                            }

                            // Top-level link without dropdown
                            const isHome = path === '/';
                            const isActive = isHome
                                ? location.pathname === path
                                : location.pathname.startsWith(path) && path !== '/';

                            return (
                                <Button
                                    key={path}
                                    component={NavLink}
                                    to={path}
                                    end
                                    sx={{
                                        color: isActive ? 'yellow' : 'white', // Highlight if active
                                        fontWeight: isActive ? 700 : 400,
                                        textTransform: 'none',
                                        borderRadius: 0,
                                    }}
                                >
                                    {label}
                                </Button>
                            );
                        })}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
