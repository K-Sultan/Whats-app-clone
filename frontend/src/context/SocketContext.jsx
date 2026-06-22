// frontend/src/context/SocketContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        // Only connect if the user is logged in
        if (user) {
            // 1. Initialize the socket connection to our backend
            // import.meta.env.VITE_API_URL is "http://localhost:5000"
            const newSocket = io(import.meta.env.VITE_API_URL);

            setSocket(newSocket);

            // 2. Emit the 'setup' event to tell the backend who just connected
            // This allows the backend to track online users
            newSocket.emit("setup", user._id);

            // Cleanup: Disconnect when the component unmounts or user logs out
            return () => newSocket.close();
        }
    }, [user]); // Re-run this effect if the user changes (logs in/out)

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};