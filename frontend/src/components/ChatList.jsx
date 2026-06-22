// frontend/src/components/ChatList.jsx
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext"; // 👈 Import Socket
import api from "../services/api";

function ChatList() {
    const { user } = useAuth();
    const { chats, setChats, selectedChat, setSelectedChat } = useChat();
    const { socket } = useSocket(); // 👈 Get socket

    // Fetch chats on mount
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const { data } = await api.get("/api/chat");
                setChats(data);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };
        fetchChats();
    }, [setChats]);

    // 👇 SOCKET LOGIC: Update sidebar when a message arrives for ANY chat 👇
    useEffect(() => {
        if (!socket) return;

        const handleSidebarUpdate = (incomingMessage) => {
            setChats((prevChats) =>
                prevChats.map((chat) => {
                    // If the message belongs to this chat in the sidebar
                    if (chat._id === incomingMessage.chatId._id) {
                        // Update the latestMessage preview
                        return { ...chat, latestMessage: incomingMessage };
                    }
                    return chat;
                })
            );
        };

        socket.on("message_received", handleSidebarUpdate);

        return () => {
            socket.off("message_received", handleSidebarUpdate);
        };
    }, [socket, setChats]);

    const getChatDetails = (chat) => {
        if (chat.type === "group") {
            return { title: chat.groupName, avatar: "https://i.pravatar.cc/150?u=group" };
        } else {
            const otherUser = chat.participants.find((p) => p._id !== user._id);
            return {
                title: otherUser ? otherUser.username : "Unknown",
                avatar: otherUser ? otherUser.avatar : "https://i.pravatar.cc/150?u=default",
            };
        }
    };

    return (
        <div className="chat-sidebar">
            <div className="sidebar-header">
                <h2>Chats</h2>
                <button style={{ background: 'transparent', border: 'none', color: '#00a884', cursor: 'pointer', fontSize: '16px' }}>
                    + New
                </button>
            </div>

            <div className="chat-list">
                {chats.map((chat) => {
                    const { title, avatar } = getChatDetails(chat);

                    return (
                        <div
                            key={chat._id}
                            className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
                            onClick={() => setSelectedChat(chat)}
                        >
                            <img src={avatar} alt="avatar" className="chat-avatar" />
                            <div className="chat-info">
                                <h4>{title}</h4>
                                <p>
                                    {chat.latestMessage
                                        ? `${chat.latestMessage.senderId.username}: ${chat.latestMessage.content}`
                                        : "Start a conversation"}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ChatList;