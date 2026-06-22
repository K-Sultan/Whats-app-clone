// frontend/src/components/ChatList.jsx
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import api from "../services/api";
import NewChatModal from "./NewChatModal"; // 👈 Import Modal

function ChatList() {
    const { user } = useAuth();
    const { chats, setChats, selectedChat, setSelectedChat, isModalOpen, setIsModalOpen } = useChat(); // 👈 Get modal state
    const { socket } = useSocket();

    // ... (keep the existing useEffects for fetching chats and socket listeners exactly as they are) ...
    useEffect(() => { /* ... fetchChats ... */ }, [setChats]);
    useEffect(() => { /* ... socket listener ... */ }, [socket, setChats]);

    const getChatDetails = (chat) => { /* ... keep as is ... */ };

    return (
        <div className="chat-sidebar">
            <div className="sidebar-header">
                <h2>Chats</h2>
                {/* 👇 UPDATE THIS BUTTON 👇 */}
                <button
                    onClick={() => setIsModalOpen(true)} // Open the modal!
                    style={{ background: 'transparent', border: 'none', color: '#00a884', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                >
                    + New
                </button>
            </div>

            <div className="chat-list">
                {/* ... map through chats ... */}
                {chats.map((chat) => {
                    const { title, avatar } = getChatDetails(chat);
                    return (
                        <div key={chat._id} className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`} onClick={() => setSelectedChat(chat)}>
                            <img src={avatar} alt="avatar" className="chat-avatar" />
                            <div className="chat-info">
                                <h4>{title}</h4>
                                <p>{chat.latestMessage ? `${chat.latestMessage.senderId.username}: ${chat.latestMessage.content}` : "Start a conversation"}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 👇 RENDER THE MODAL HERE 👇 */}
            <NewChatModal />
        </div>
    );
}

export default ChatList;