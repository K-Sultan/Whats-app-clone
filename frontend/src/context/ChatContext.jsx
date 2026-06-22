// frontend/src/context/ChatContext.jsx
import { createContext, useState, useContext } from "react";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);

    // 👇 ADD THESE FOR THE MODAL 👇
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <ChatContext.Provider value={{
            selectedChat, setSelectedChat,
            chats, setChats,
            isModalOpen, setIsModalOpen // 👈 Pass it down
        }}>
            {children}
        </ChatContext.Provider>
    );
};