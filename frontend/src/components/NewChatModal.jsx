// frontend/src/components/NewChatModal.jsx
import { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import api from "../services/api";

function NewChatModal() {
    const { isModalOpen, setIsModalOpen, chats, setChats, setSelectedChat } = useChat();

    const [activeTab, setActiveTab] = useState("search"); // 'search' or 'group'
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Group specific state
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);

    // If modal is closed, reset everything
    if (!isModalOpen) return null;

    // Search Users Logic (Debounced)
    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchQuery) {
                setSearchResults([]);
                return;
            }
            try {
                const { data } = await api.get(`/api/user?search=${searchQuery}`);
                setSearchResults(data);
            } catch (error) {
                console.error("Error searching users:", error);
            }
        };

        // Simple debounce: wait 300ms after user stops typing to search
        const timerId = setTimeout(fetchUsers, 300);
        return () => clearTimeout(timerId);
    }, [searchQuery]);

    // 🤝 Handle 1-on-1 Chat Creation
    const handleAccessChat = async (userId) => {
        try {
            const { data } = await api.post("/api/chat", { userId });

            // If chat already exists, it won't be in our 'chats' array. Add it.
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
            }

            setSelectedChat(data);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error accessing chat:", error);
        }
    };

    // 👥 Handle Adding/Removing Users for Group
    const handleSelectUser = (user) => {
        if (selectedUsers.find((u) => u._id === user._id)) {
            setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    // 🚀 Handle Group Creation
    const handleCreateGroup = async () => {
        if (!groupName || selectedUsers.length < 2) return; // Need at least 2 others + you = 3 total

        try {
            const { data } = await api.post("/api/chat/group", {
                groupName,
                users: selectedUsers.map((u) => u._id),
            });

            setChats([data, ...chats]);
            setSelectedChat(data);

            // Reset state
            setGroupName("");
            setSelectedUsers([]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    return (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>New Conversation</h3>
                    <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                </div>

                {/* Tabs */}
                <div className="modal-tabs">
                    <button className={activeTab === "search" ? "active" : ""} onClick={() => setActiveTab("search")}>
                        Search User
                    </button>
                    <button className={activeTab === "group" ? "active" : ""} onClick={() => setActiveTab("group")}>
                        Create Group
                    </button>
                </div>

                {/* Search Input */}
                <input
                    type="text"
                    className="modal-search-input"
                    placeholder={activeTab === "search" ? "Search by username or email..." : "Search users to add..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Tab Content */}
                {activeTab === "search" ? (
                    // --- 1-ON-1 SEARCH RESULTS ---
                    <div className="user-list">
                        {searchResults.map((user) => (
                            <div key={user._id} className="user-item" onClick={() => handleAccessChat(user._id)}>
                                <img src={user.avatar} alt="avatar" />
                                <div className="user-item-info">
                                    <h4>{user.username}</h4>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                        ))}
                        {searchQuery && searchResults.length === 0 && <p style={{ color: '#8696a0', textAlign: 'center' }}>No users found.</p>}
                    </div>
                ) : (
                    // --- GROUP CREATION UI ---
                    <>
                        <input
                            type="text"
                            className="modal-search-input"
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />

                        {/* Selected Users Badges */}
                        <div className="selected-users-container">
                            {selectedUsers.map((user) => (
                                <div key={user._id} className="user-badge">
                                    {user.username}
                                    <button onClick={() => handleSelectUser(user)}>×</button>
                                </div>
                            ))}
                        </div>

                        {/* Search Results for Group */}
                        <div className="user-list">
                            {searchResults.map((user) => {
                                const isSelected = selectedUsers.find((u) => u._id === user._id);
                                return (
                                    <div
                                        key={user._id}
                                        className="user-item"
                                        onClick={() => handleSelectUser(user)}
                                        style={{ background: isSelected ? '#005c4b' : 'transparent' }}
                                    >
                                        <img src={user.avatar} alt="avatar" />
                                        <div className="user-item-info">
                                            <h4>{user.username}</h4>
                                            <p>{user.email}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            className="create-group-btn"
                            onClick={handleCreateGroup}
                            disabled={!groupName || selectedUsers.length < 2}
                        >
                            Create Group Chat
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default NewChatModal;