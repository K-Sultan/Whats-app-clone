# 💬 WhatsApp Clone (MERN + Socket.IO)

A fully functional, real-time messaging application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. This project replicates the core experience of WhatsApp, featuring secure authentication, one-to-one private chats, group conversations, and instant real-time message delivery.

## ✨ Features

- 🔐 **Secure Authentication:** User registration and login with JWT (JSON Web Tokens) and bcrypt password hashing.
- 💬 **One-to-One Chat:** Private messaging between two users with persistent chat history.
- 👥 **Group Chats:** Create groups, add multiple participants, and chat in real-time.
- ⚡ **Real-Time Messaging:** Instant message delivery using WebSockets (Socket.IO) without page refreshes.
- ⌨️ **Typing Indicators:** See when the other person is typing in real-time.
- 📱 **Responsive UI:** Clean, dark-themed interface inspired by WhatsApp Web.
- 🔄 **Live Sidebar Updates:** Chat list automatically updates with the latest message previews.
- 🔍 **User Search:** Easily find and start chats with other registered users.

## 🛠️ Tech Stack

### Frontend
- **React 18** (UI Library)
- **Vite** (Build Tool)
- **React Router DOM** (Client-side routing)
- **Axios** (HTTP Client with interceptors for JWT)
- **Socket.IO Client** (WebSocket connection)
- **Context API** (Global state management for Auth, Chats, and Sockets)

### Backend
- **Node.js & Express.js** (Server framework)
- **Socket.IO** (Real-time bidirectional event-based communication)
- **MongoDB & Mongoose** (NoSQL Database & ODM)
- **JSON Web Token (JWT)** (Authentication)
- **bcryptjs** (Password hashing)

---

## 🏗️ Architecture: How It Works

This application uses a **hybrid approach** for data handling:
1. **REST APIs (HTTP):** Used for data persistence and initial loading. When you log in, fetch chat history, or send a message, it hits the Express REST API to save/read from MongoDB.
2. **WebSockets (Socket.IO):** Used for real-time broadcasting. When a message is saved via REST, the server emits a Socket event to push that message instantly to the recipient's screen without them needing to refresh.

### The "Room" Concept
To ensure messages only go to the intended recipients (especially in group chats), Socket.IO **Rooms** are used. When a user opens a chat, their socket joins a room named after the `chatId`. When a message is sent, it is broadcasted *only* to that specific room.

---

## 📂 Project Structure

```text
whatsapp-clone/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Business logic (Auth, Chat, Message, User)
│   ├── middleware/     # JWT protection middleware
│   ├── models/         # Mongoose schemas (User, Chat, Message)
│   ├── routes/         # Express API routes
│   ├── socket/         # Socket.IO event handlers
│   ├── .env            # Environment variables (Not in Git)
│   └── server.js       # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI (ChatList, ChatWindow, Modals)
│   │   ├── context/    # React Context (Auth, Chat, Socket)
│   │   ├── pages/      # Route pages (Login, Register, Home)
│   │   ├── services/   # Axios instance configuration
│   │   ├── App.jsx     # Router setup
│   │   └── index.css   # Global styles
│   └── .env            # Frontend environment variables
