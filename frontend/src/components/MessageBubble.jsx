// frontend/src/components/MessageBubble.jsx
import { useAuth } from "../context/AuthContext";

function MessageBubble({ message }) {
    const { user } = useAuth();

    // Check if the logged-in user is the sender
    const isSent = message.senderId._id === user._id;

    // Format the timestamp
    const time = new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className={`message-bubble ${isSent ? 'sent' : 'received'}`}>
            <div>{message.content}</div>
            <div className="message-time">{time}</div>
        </div>
    );
}

export default MessageBubble;