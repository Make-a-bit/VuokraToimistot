import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearMessages } from "../redux/actions/uiActions"; 

export const useAutoClearMessages = (errorMessage, successMessage) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (errorMessage || successMessage) {
            const timer = setTimeout(() => {
                dispatch(clearMessages());
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage, successMessage, dispatch]);
};
