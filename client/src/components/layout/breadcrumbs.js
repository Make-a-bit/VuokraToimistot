import React from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Typography from "@mui/material/Typography";
import navigationLinks from "../../constants/navigation";

/**
 * Flattens the navigation structure into a map of path (without trailing slash) to label.
 * Handles both top-level navigation items and their dropdown children.
 *
 * @param {Array} links - The navigation links array.
 * @returns {Object} A map where keys are normalized paths and values are their labels.
 */
const buildPathLabelMap = (links) => {
    const map = {};

    links.forEach(item => {
        if (item.path) {
            // Remove trailing slash for consistency
            const basePath = item.path.replace(/\/+$/, "");
            map[basePath] = item.label;
        }
        if (item.dropdown) {
            item.dropdown.forEach(sub => {
                const subPath = sub.path.replace(/\/+$/, "");
                map[subPath] = sub.label;
            });
        }
    });
    console.log(map)
    return map;
};

const AppBreadcrumbs = () => {
    const location = useLocation();
    const pathname = location.pathname.replace(/\/+$/, "");
    const segments = pathname.split("/").filter(Boolean);

    const pathLabelMap = buildPathLabelMap(navigationLinks);

    const buildBreadcrumbItems = () => {
        const crumbs = [];

        for (let i = 0; i < segments.length; i++) {
            const subPath = "/" + segments.slice(0, i + 1).join("/");
            const label = pathLabelMap[subPath] ?? segments[i];
            const isLast = i === segments.length - 1;

            crumbs.push(
                isLast ? (
                    <Typography color="text.primary" key={subPath}>
                        {label}
                    </Typography>
                ) : (
                    <Link
                            component={RouterLink}
                            to={subPath}
                            underline="hover"
                            color="inherit"
                            key={subPath}
                    >
                        {label}
                    </Link>
                )
            );
        }

        return crumbs;
    };

    if (segments.length === 0) return null;

    return (
        <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{
            my: 0.5,
            "& .MuiTypography-root, & .MuiLink-root": { fontSize: "14px" } }}>
            <Link
                component={RouterLink}
                underline="hover"
                color="inherit" to="/"
            >
                Etusivu
            </Link>
            {buildBreadcrumbItems()}
        </Breadcrumbs>
    );
};

export default AppBreadcrumbs;
