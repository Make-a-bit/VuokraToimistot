import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions/loginActions";

/**
 * INACTIVITY_LIMIT is the time in milliseconds before logout due to inactivity.
 * @type {number}
 */
const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes in ms

/**
 * Custom React hook that logs out the user after a period of inactivity.
 * 
 * - `dispatch` is a Redux dispatch function.
 * - `loggedUser` is the currently logged-in user object or null/undefined.
 * - `timer` is a mutable ref object holding the inactivity timeout ID.
 * 
 * @returns {void}
 */
const useInactivityLogout = () => {
    /** @type {import('react-redux').Dispatch} */
    const dispatch = useDispatch();

    /**
     * loggedUser is inferred from Redux state. 
     * Assuming it is an object when logged in, otherwise null/undefined.
     * @type {?Object}
     */
    const loggedUser = useSelector(state => state.login.loggedUser);

    /**
     * timer holds the timeout ID for inactivity.
     * @type {import('react').MutableRefObject<number|undefined>}
     */
    const timer = useRef();

    useEffect(() => {
        if (!loggedUser) return;

        /**
         * Resets the inactivity timer and sets up logout on timeout.
         * @returns {void}
         */
        const resetTimer = () => {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                dispatch(logoutUser());
            }, INACTIVITY_LIMIT);
        };

        // Listen for user activity
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("mousedown", resetTimer);
        window.addEventListener("touchstart", resetTimer);

        resetTimer();

        return () => {
            clearTimeout(timer.current);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("mousedown", resetTimer);
            window.removeEventListener("touchstart", resetTimer);
        };
    }, [dispatch, loggedUser]);
};

export default useInactivityLogout;