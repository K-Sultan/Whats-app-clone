import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// 3. Create the Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // To show a loading screen on refresh

    // Check if user is already logged in when the app loads
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    // Verify the token with the backend
                    const { data } = await api.get("/api/auth/me");
                    setUser(data);
                } catch (error) {
                    // If token is invalid/expired, clear it
                    console.error("Token invalid, logging out.");
                    localStorage.removeItem("token");
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        const { data } = await api.post("/api/auth/login", { email, password });
        localStorage.setItem("token", data.token);
        setUser(data);
        return data;
    };

    // Register function
    const register = async (username, email, password) => {
        const { data } = await api.post("/api/auth/register", { username, email, password });
        localStorage.setItem("token", data.token);
        setUser(data);
        return data;
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};