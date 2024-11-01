
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import refreshToken from "../utils/RefreshToken";
import { jwtDecode } from "jwt-decode";
import instance from "../utils/axios"
import getConfig from "../utils/getConfig";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({ userRole: "", isLoading: true });
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    // Initial token validation or refresh
    useEffect(() => {
        refreshToken().then((response) => {
            if (response) {
                const jwt = response.data;
                setToken(jwt);
                const decoded = jwtDecode(jwt);
                setAuthState({ userRole: decoded.role, isLoading: false });
            } else {
                setAuthState({ userRole: "", isLoading: false });
            }
        }).catch(() => {
            setAuthState({ userRole: "", isLoading: false });
            navigate("/login");
        });
    }, [navigate]);

    // Periodic token refresh
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            refreshToken()
                .then((response) => {
                    if (response) {
                        const jwt = response.data;
                        setToken(jwt);
                    } else {
                        setToken(null);
                    }
                })
                .catch((error) => {
                    console.error("Failed to refresh token", error);
                    setToken(null);
                });
        }, 15 * 60 * 1000); // Refresh token every 15 minutes

        return () => clearInterval(refreshInterval);
    }, []);

    const login = (jwt) => {
        setToken(jwt);
        const decoded = jwtDecode(jwt);
        setAuthState({ userRole: decoded.role, isLoading: false });
    };

    const logout = async () => {
        // remove cookie
        await instance.get("/api/auth/logout")
        setToken(null);
        setAuthState({ userRole: "", isLoading: false });
        navigate("/");
    };

    const deleteCurrentUser = async (id) => {
        await instance.delete(`/api/user/${id}`, getConfig(token)).then(() => {
        setToken(null);
        setAuthState({ userRole: "", isLoading: false });
        navigate("/");
    }).catch((error) => {
        console.error("Failed to delete user", error);
        return error;
    });
    }

    return (
        <AuthContext.Provider value={{ ...authState, logout, login, token, deleteCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

