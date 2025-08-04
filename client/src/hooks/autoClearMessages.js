import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearMessages } from "../redux/actions/uiActions"; 

/**
 * Custom React hook that automatically clears error or success messages after a timeout.
 * 
 * @param {string|null|undefined} errorMessage - The error message to watch for clearing. Assumed to be a string or null/undefined.
 * @param {string|null|undefined} successMessage - The success message to watch for clearing. Assumed to be a string or null/undefined.
 * @returns {void}
 *
 * Reasoning: errorMessage and successMessage are checked for truthiness and passed to useEffect dependencies, suggesting they are likely strings or possibly null/undefined.
 */
const useAutoClearMessages = (errorMessage, successMessage, delayMs = 3000) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!errorMessage && !successMessage) return;

        const timer = window.setTimeout(() => {
            dispatch(clearMessages());
        }, delayMs);
        return () => {
            window.clearTimeout(timer);
        };
    }, [errorMessage, successMessage, delayMs, dispatch]);
};

export default useAutoClearMessages;