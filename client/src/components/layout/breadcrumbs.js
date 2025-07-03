import React from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import navigationLinks from "../../constants/navigation";

const capitalizeFirst = str =>
    typeof str === "string" && str.length > 0
        ? str.charAt(0).toUpperCase() + str.slice(1)
        : str;

const AppBreadcrumbs = () => {
    const location = useLocation();
    const pathname = location.pathname.replace(/\/+$/, "");
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) return null;

    const crumbs = [];

    // Add "Etusivu" link
    crumbs.push(
        <Link component={RouterLink} to="/" underline="hover" color="inherit" key="home">
            Etusivu
        </Link>
    );

    const fullPath = `/${segments.join("/")}`;

    // Find matching child route
    let found = null;
    let parentLabel = null;

    for (const nav of navigationLinks) {
        if (nav.dropdownParent && nav.dropdown) {
            const match = nav.dropdown.find(d => d.path.replace(/\/+$/, "") === fullPath);
            if (match) {
                found = match;
                parentLabel = nav.label;
                break;
            }
        } else if (nav.path && nav.path.replace(/\/+$/, "") === fullPath) {
            found = nav;
            break;
        }
    }

    if (parentLabel) {
        crumbs.push(
            <Typography color="text.primary" key="parent">
                {capitalizeFirst(parentLabel)}
            </Typography>
        );
    }

    if (found) {
        crumbs.push(
            <Typography color="text.primary" key={found.path}>
                {capitalizeFirst(found.label)}
            </Typography>
        );
    }

    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{
                my: 0.5,
                "& .MuiTypography-root, & .MuiLink-root": { fontSize: "14px" }
            }}
        >
            {crumbs}
        </Breadcrumbs>
    );
};

export default AppBreadcrumbs;
