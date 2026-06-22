const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


dotenv.config();


connectDB();

const app = express();


// We need this because Socket.IO works on top of HTTP, not Express directly
const server = http.createServer(app);


app.use(cors());                   
app.use(express.json());            

app.use("/api/auth", require("./routes/auth"));
app.use("/api/chat", require("./routes/chat")); 
app.use("/api/message", require("./routes/message")); 

// Basic route to check if server is running
app.get("/", (req, res) => {
    res.send("WhatsApp Clone API is running 🚀");
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});