// backend/socket/socket.js
const { Server } = require("socket.io");

// We will initialize this function in server.js and pass the HTTP server to it
const initializeSocket = (server) => {

    // 1. Initialize Socket.IO and attach it to our HTTP server
    // We also configure CORS so our React frontend (running on a different port) can connect
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Vite's default frontend port
            methods: ["GET", "POST"],
        },
    });

    // 📦 In-memory storage to track online users (Optional but useful for 1-on-1 notifications)
    // Maps userId -> socket.id
    const onlineUsers = new Map();

    // 2. Listen for new WebSocket connections
    // This runs EVERY TIME a user connects to the server
    io.on("connection", (socket) => {
        console.log(`🔌 A user connected. Socket ID: ${socket.id}`);

        // ---------------------------------------------------------
        // EVENT 1: User Setup (Track who is online)
        // ---------------------------------------------------------
        // When the frontend connects, it will emit a 'setup' event with the user's ID
        socket.on("setup", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log(`👤 User ${userId} is now online. Socket: ${socket.id}`);

            // Optional: Tell everyone else that this user came online
            socket.broadcast.emit("user_online", userId);
        });

        // ---------------------------------------------------------
        // EVENT 2: Joining a Chat Room
        // ---------------------------------------------------------
        // When a user clicks on a chat (private or group), they join that chat's "room"
        socket.on("join_chat", (chatId) => {
            socket.join(chatId);
            console.log(`🚪 User with Socket ${socket.id} joined room: ${chatId}`);
        });

        // ---------------------------------------------------------
        // EVENT 3: Receiving and Broadcasting a New Message
        // ---------------------------------------------------------
        // When a user sends a message, the frontend emits 'new_message'
        socket.on("new_message", (data) => {
            // data contains: { chatId: "...", message: { ... } }
            const { chatId, message } = data;

            console.log(`💬 New message in room ${chatId}: ${message.content}`);

            // 🚀 BROADCAST to the specific room!
            // We use io.to(chatId).emit() so ONLY users in this specific chat receive it.
            io.to(chatId).emit("message_received", message);
        });

        // ---------------------------------------------------------
        // EVENT 4: Typing Indicators (Simple implementation)
        // ---------------------------------------------------------
        socket.on("typing", (chatId) => {
            // Broadcast to everyone in the room EXCEPT the sender
            socket.to(chatId).emit("typing", chatId);
        });

        socket.on("stop_typing", (chatId) => {
            socket.to(chatId).emit("stop_typing", chatId);
        });

        // ---------------------------------------------------------
        // EVENT 5: Disconnect
        // ---------------------------------------------------------
        // When the user closes the tab or loses internet
        socket.on("disconnect", () => {
            console.log(`❌ User disconnected. Socket ID: ${socket.id}`);

            // Find and remove the user from our onlineUsers map
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    console.log(`👋 User ${userId} went offline.`);
                    io.emit("user_offline", userId); // Tell everyone
                    break;
                }
            }
        });
    });

    // Return the io instance in case we need it in controllers later
    return io;
};

module.exports = initializeSocket;