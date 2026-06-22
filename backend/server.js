// backend/server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// 👇 Import the socket initializer
const initializeSocket = require("./socket/socket");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// 👇 Initialize Socket.IO and pass the HTTP server to it
const io = initializeSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/message", require("./routes/message"));

app.get("/", (req, res) => {
    res.send("WhatsApp Clone API is running 🚀");
});

const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ Socket.IO is listening for connections...`);
});