import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import navigationLinks from '../../constants/navigation';

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";

const Header = () => {
    const [anchorEls, setAnchorEls] = useState({});
    const location = useLocation();

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
                sx={{ bgcolor: "success.light", borderRadius: 2 }}
            >
                <Toolbar disableGutters>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {navigationLinks.map(({ path, label, dropdown }) => {
                            if (dropdown) {
                                const open = Boolean(anchorEls[label]);
                                return (
                                    <Box key={label}>
                                        <Button
                                            onClick={(e) => handleMenuOpen(e, label)}
                                            sx={{
                                                color: 'white',
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
                            return (
                                <Button
                                    key={path}
                                    component={NavLink}
                                    to={path}
                                    end
                                    sx={{
                                        color: 'white',
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
