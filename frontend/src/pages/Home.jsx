// frontend/src/pages/Home.jsx
import { ChatProvider } from "../context/ChatContext";
import { SocketProvider } from "../context/SocketContext"; // 👈 Import this
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user, logout } = useAuth();

  return (
    // 👇 Wrap everything in SocketProvider 👇
    <SocketProvider>
      <ChatProvider>
        <div className="chat-app-container">
          <ChatList />
          <ChatWindow />
        </div>

        <button
          onClick={logout}
          style={{
            position: 'fixed', bottom: '20px', right: '20px',
            padding: '10px 15px', background: '#ff4b4b', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer'
          }}
        >
          Logout ({user.username})
        </button>
      </ChatProvider>
    </SocketProvider>
  );
}

export default Home;