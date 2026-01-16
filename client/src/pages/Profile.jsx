import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Logout from "../components/LogOutbtn";
import CreateRoomModal from "../components/CreateRoomModel";
import JoinRoomModal from "../components/JoinRoomModel";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  const handleRoomCreated = (roomId) => {
    navigate(`/chatroom/${roomId}`);
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/chatroom/${roomId}`);
  };

  if (!user) return <p className="loading-message">Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Logout className="logout-button" />
      </div>

      <div className="profile-content">
        <h2 className="profile-title">Welcome, <span className="username">{user.username}</span></h2>
        <p className="profile-subtitle">Manage your chat rooms</p>

        <div className="button-group">
          <button 
            className="action-button create-button"
            onClick={() => setShowCreateRoom(true)}
          >
            <span className="button-icon">+</span>
            Create Room
          </button>

          <button 
            className="action-button join-button"
            onClick={() => setShowJoinRoom(true)}
          >
            <span className="button-icon">→</span>
            Join Room
          </button>
        </div>
      </div>

      {showCreateRoom && (
        <CreateRoomModal
          onClose={() => setShowCreateRoom(false)}
          onRoomCreated={handleRoomCreated}
        />
      )}

      {showJoinRoom && (
        <JoinRoomModal
          onClose={() => setShowJoinRoom(false)}
          onJoin={handleJoinRoom}
        />
      )}
    </div>
  );
}

export default Profile;