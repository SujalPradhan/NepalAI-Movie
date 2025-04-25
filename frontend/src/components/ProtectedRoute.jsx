import {Navigate} from "react-router-dom"; 
import {jwtDecode} from "jwt-decode";
import api from "../api.js";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children, isAuthenticated }) {
    const [isAuthorized, setisAuthorized] = useState(null);

    useEffect(() => {
        // If isAuthenticated is provided and true, we can bypass the token check
        if (isAuthenticated) {
            setisAuthorized(true);
            return;
        }
        
        // Otherwise, check token validity
        auth().catch(() => setisAuthorized(false));
    }, [isAuthenticated]);

    const refreshToken = async () => {
        const refreshToken = sessionStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
            setisAuthorized(false);
            return;
        }
        try {
            const response = await api.post('/auth/token/refresh', { 
                refresh: refreshToken });
            if (response.status == 200) {
                sessionStorage.setItem(ACCESS_TOKEN, response.data.access);
                setisAuthorized(true);
                return;
            }
            else{
                setisAuthorized(false);
                return;
            }
        } catch (error) {
            console.error("Error refreshing token", error);
            setisAuthorized(false);
        }
    }

    const auth = async () => {
        const token = sessionStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setisAuthorized(false);
            return;
        }
        const decodedToken = jwtDecode(token);
        const tokenExpiration = decodedToken.exp;
        const now = new Date()/1000;
        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setisAuthorized(true);
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute;