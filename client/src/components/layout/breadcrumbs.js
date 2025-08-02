import React from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import navigationLinks from "../../constants/navigation";

/**
 * Capitalizes the first character of a string if input is a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string, or the original value if not a string.
 */
const capitalizeFirst = str =>
    typeof str === "string" && str.length > 0
        ? str.charAt(0).toUpperCase() + str.slice(1)
        : str;

/**
 * AppBreadcrumbs component renders the breadcrumb navigation based on the current route.
 * @returns {JSX.Element|null} The breadcrumbs JSX or null if at root.
 */
const AppBreadcrumbs = () => {
    /** @type {{ pathname: string }} */
    const location = useLocation();

    /** @type {string} */
    const pathname = location.pathname.replace(/\/+$/, "");

    /** @type {string[]} */
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) return null;

    /** @type {JSX.Element[]} */
    const crumbs = [];

    // Add "Etusivu" link
    crumbs.push(
        <Link component={RouterLink} to="/" underline="hover" color="inherit" key="home">
            Etusivu
        </Link>
    );

    /** @type {string} */
    const fullPath = `/${segments.join("/")}`;

    // Find matching child route
    /** @type {any} */
    let found = null;
    /** @type {string|null} */
    let parentLabel = null;

    // navigationLinks is assumed to be an array of navigation objects with possible dropdowns
    for (const nav of navigationLinks) {
        if (nav.dropdownParent && nav.dropdown) {
            const match = nav.dropdown.find(
                /** @param {{ path: string }} d */
                d => d.path.replace(/\/+$/, "") === fullPath
            );
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