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




# 📖 How to Use the WhatsApp Clone

Welcome to the WhatsApp Clone! This guide will walk you through how to use the application, from creating your account to testing the real-time messaging features. 

Whether you are testing the deployed live version or running it locally, the user experience is exactly the same.

---

## 🧑‍💻 Step 1: Create Your Accounts

To test a chat application, you need at least **two different users**. 

1. Open your browser and navigate to the app (e.g., `http://localhost:5173` or your deployed Vercel URL).
2. Click **"Sign Up"** and create your first user (e.g., `User A`).
3. **Crucial Step:** Open an **Incognito/Private Browsing** window (or a completely different browser like Firefox if you used Chrome). This simulates a second person.
4. In the Incognito window, navigate to the app and **"Sign Up"** for a second user (e.g., `User B`).
5. *Optional:* Repeat this process to create a `User C` so you can test Group Chats later.

---

## 🔍 Step 2: Start a 1-on-1 Chat

Now that you have multiple accounts, let's connect them.

1. Log in as **User A** in your normal browser window.
2. Look at the top left of the sidebar and click the **"+ New"** button.
3. A modal will pop up. Ensure you are on the **"Search User"** tab.
4. Type the username or email of **User B** in the search bar.
5. Click on **User B's** profile from the search results.
6. The right side of the screen will open the Chat Window with User B. You are now in a private 1-on-1 chat!

---

## 💬 Step 3: Send Real-Time Messages

This is where the magic happens.

1. With the chat with **User B** open in your normal window, go to your **Incognito window** and log in as **User B**.
2. In User B's window, click the **"+ New"** button, search for **User A**, and open the chat.
3. **Both screens should now be showing the same chat window.**
4. In User A's window, start typing a message. 
   * *Notice:* Look at the header in User B's window. You should see the **"typing..."** indicator appear in real-time!
5. Hit **Send** in User A's window.
6. Watch User B's window: the message will appear **instantly** without either of you needing to refresh the page.
7. Reply as User B and watch it appear in User A's window instantly.

---

## 👥 Step 4: Create a Group Chat

Let's test the group messaging functionality.

1. Log in as **User A** in your normal window.
2. Click the **"+ New"** button in the sidebar.
3. Switch to the **"Create Group"** tab in the modal.
4. Type a name for your group (e.g., "React Devs") in the Group Name input.
5. Search for **User B** and click on them. They will appear as a green badge at the top.
6. Search for **User C** (if you created one) and click on them to add them too. *(Note: You need at least 2 other users to create a group).*
7. Click the **"Create Group Chat"** button at the bottom.
8. The group chat will open. Send a message.
9. Log in as User B and User C in their respective windows. The group chat will appear in their sidebars, and the message will be delivered to all of them in real-time.

---

## 🔄 Step 5: Navigating Multiple Chats

1. Create a few different 1-on-1 chats and a Group chat using the **"+ New"** button.
2. All your conversations will be listed in the **Left Sidebar**, sorted by the most recent activity.
3. Click on any chat in the sidebar to switch the **Right Chat Window** to that conversation.
4. **Test the Sidebar Update:** Open Chat 1 in User A's window. In User B's window, send a message in Chat 2. Watch User A's sidebar instantly update the preview text for Chat 2, even though Chat 1 is currently open on the screen!

---

## 🛠️ Troubleshooting & Tips

- **"I'm not receiving messages in real-time!"**
  Make sure both browser windows are fully loaded and logged in. If the WebSocket connection drops (which can happen if you put your computer to sleep), simply refresh the page to reconnect the socket.
- **"My messages disappeared when I refreshed!"**
  If this happens, it means the message wasn't saved to the database. Check your backend terminal to ensure the MongoDB connection is active and the REST API `/api/message` is returning a `201 Created` status.
- **"I can't find a user in the search bar."**
  Ensure you have spelled the username or email correctly. The search is case-insensitive, but it requires at least one matching character. Also, the search will *never* show your own logged-in account.
- **"The 'typing...' indicator isn't working."**
  The typing indicator relies on WebSockets. Ensure your backend `socket.js` is running and that both users are currently inside the *same* chat room (i.e., both have the specific chat open on their screens).

---

## 🎉 Enjoy Chatting!

You are now fully set up to explore the application. Try creating multiple groups, spamming messages to test the auto-scroll feature, and switching between chats to see the live sidebar updates. 
