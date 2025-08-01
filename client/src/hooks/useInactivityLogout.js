import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions/loginActions";

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes in ms

const useInactivityLogout = () => {
    const dispatch = useDispatch();
    const loggedUser = useSelector(state => state.login.loggedUser);
    const timer = useRef();

    useEffect(() => {
        if (!loggedUser) return;

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