import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Header from "./header"
import { Footer } from "./footer"
import { Outlet } from "react-router-dom";
import AppBreadcrumbs from "./breadcrumbs";

const Content = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            sx={{ alignItems: "center" }}
        >
            <Header />

            <Container
            disableGutters
                component="main"
                maxWidth="xl"
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "-15px",
                    width: "100%",
                    px: 2,
                    boxShadow: (theme) => theme.breakpoints.up("xl") ? 3 : "none",
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                }}>
                <Grid item xs={12}>
                    <AppBreadcrumbs />
                    <Outlet />
                </Grid>
            </Container>
            <Footer />
        </Box>
    );
};

export default Content;