// frontend/src/context/ChatContext.jsx
import { createContext, useState, useContext } from "react";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null); // The chat currently open
    const [chats, setChats] = useState([]); // Array of all chats

    return (
        <ChatContext.Provider value={{ selectedChat, setSelectedChat, chats, setChats }}>
            {children}
        </ChatContext.Provider>
    );
};