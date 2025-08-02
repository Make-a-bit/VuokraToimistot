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
const useAutoClearMessages = (errorMessage, successMessage) => {
    /** @type {import('react-redux').Dispatch} */
    // Reasoning: useDispatch returns the Redux dispatch function.
    const dispatch = useDispatch();

    useEffect(() => {
        if (errorMessage || successMessage) {
            /** @type {NodeJS.Timeout} */
            // Reasoning: setTimeout returns a Timeout object in Node.js, which is compatible with clearTimeout.
            const timer = setTimeout(() => {
                dispatch(clearMessages());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage, successMessage, dispatch]);
};

export default useAutoClearMessages;