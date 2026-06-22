// frontend/src/components/ChatWindow.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext"; // 👈 Import Socket
import api from "../services/api";
import MessageBubble from "./MessageBubble";

function ChatWindow() {
    const { user } = useAuth();
    const { selectedChat, setSelectedChat, chats, setChats } = useChat();
    const { socket } = useSocket(); // 👈 Get socket instance

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    // Helper to get chat title/avatar
    const getChatDetails = () => {
        if (!selectedChat) return { title: "", avatar: "" };
        if (selectedChat.type === "group") {
            return { title: selectedChat.groupName, avatar: "https://i.pravatar.cc/150?u=group" };
        }
        const otherUser = selectedChat.participants.find((p) => p._id !== user._id);
        return {
            title: otherUser?.username || "Unknown",
            avatar: otherUser?.avatar || "https://i.pravatar.cc/150?u=default"
        };
    };

    // Fetch messages when selectedChat changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat) return;
            try {
                const { data } = await api.get(`/api/message/${selectedChat._id}`);
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();
    }, [selectedChat]);

    // 👇 SOCKET LOGIC 1: Join Room & Listen for Messages 👇
    useEffect(() => {
        if (!socket) return;

        // When a chat is selected, join its room on the backend
        if (selectedChat) {
            socket.emit("join_chat", selectedChat._id);
        }

        // Listen for incoming messages
        const handleMessageReceived = (incomingMessage) => {
            // Only update the UI if the incoming message belongs to the CURRENTLY OPEN chat
            if (selectedChat && selectedChat._id === incomingMessage.chatId._id) {
                setMessages((prev) => [...prev, incomingMessage]);
            }
            // Optional: You could also update the ChatList sidebar here if it's a different chat!
        };

        socket.on("message_received", handleMessageReceived);

        // Cleanup listener when component unmounts or selectedChat changes
        return () => {
            socket.off("message_received", handleMessageReceived);
        };
    }, [socket, selectedChat]);

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle sending a message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat || !socket) return;

        try {
            // 1. Save to database via REST API
            const { data } = await api.post("/api/message", {
                content: newMessage,
                chatId: selectedChat._id,
            });

            // 2. Add to local state immediately (so the sender sees it instantly)
            setMessages((prev) => [...prev, data]);
            setNewMessage("");

            // 3. 🚀 BROADCAST via Socket.IO to the other person!
            socket.emit("new_message", {
                chatId: selectedChat._id,
                message: data // 'data' is the fully populated message from the REST API
            });

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    if (!selectedChat) {
        return <div className="empty-chat"><p>👈 Select a chat to start messaging</p></div>;
    }

    const { title, avatar } = getChatDetails();

    return (
        <div className="chat-window">
            <div className="chat-header">
                <img src={avatar} alt="avatar" />
                <h3>{title}</h3>
            </div>

            <div className="messages-container">
                {messages.map((msg) => (
                    <MessageBubble key={msg._id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form className="message-input-container" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default ChatWindow;