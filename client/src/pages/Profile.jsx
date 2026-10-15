
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Logout from "../components/LogOutbtn";
import CreateRoomModal from "../components/CreateRoomModel";
import JoinRoomModal from "../components/JoinRoomModel";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Plus, ArrowRight, Users, Sparkles } from "lucide-react";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  const handleRoomCreated = (roomId) => {
    setShowCreateRoom(false);
    navigate(`/chatroom/${roomId}`);
  };

  const handleJoinRoom = (roomId) => {
    setShowJoinRoom(false);
    navigate(`/chatroom/${roomId}`);
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="profile-loader" />
        <p>Preparing your workspace...</p>
      </div>
    );
  }

  const initial = user.username?.charAt(0).toUpperCase() || "U";

  return (
    <main className="profile-container">
      <header className="profile-header">
        <button
          className="profile-brand"
          onClick={() => navigate("/profile")}
          aria-label="ChatHub home"
        >
          <span className="brand-icon">
            <MessageCircle size={25} />
          </span>
          <span>
            Chat<span className="brand-highlight">Hub</span>
          </span>
        </button>

        <div className="profile-header-right">
          <div className="profile-user-chip">
            <span className="profile-avatar-small">{initial}</span>
            <span className="profile-user-name">{user.username}</span>
          </div>
          <Logout className="logout-button" />
        </div>
      </header>

      <section className="profile-main">
        <div className="profile-decoration profile-decoration-one" />
        <div className="profile-decoration profile-decoration-two" />

        <div className="profile-content">
          <div className="profile-welcome-icon">
            <span className="profile-avatar-large">{initial}</span>
            <span className="profile-online-dot" />
          </div>

          <div className="profile-eyebrow">
            <Sparkles size={15} />
            YOUR SPACE TO CONNECT
          </div>

          <h1 className="profile-title">
            Welcome back,
            <span className="username">{user.username}</span>
          </h1>

          <p className="profile-subtitle">
            Great conversations start here. Create a room or join your
            friends and start chatting.
          </p>

          <div className="profile-stats">
            <div className="profile-stat-icon">
              <Users size={17} />
            </div>
            <span>Connect, share, and chat in real time</span>
          </div>

          <div className="button-group">
            <button
              className="action-button create-button"
              onClick={() => setShowCreateRoom(true)}
            >
              <span className="action-icon create-icon">
                <Plus size={27} />
              </span>

              <span className="action-copy">
                <strong>Create a room</strong>
                <span>Start a new conversation</span>
              </span>

              <span className="action-arrow">
                <ArrowRight size={20} />
              </span>
            </button>

            <button
              className="action-button join-button"
              onClick={() => setShowJoinRoom(true)}
            >
              <span className="action-icon join-icon">
                <MessageCircle size={25} />
              </span>

              <span className="action-copy">
                <strong>Join a room</strong>
                <span>Enter a room ID to connect</span>
              </span>

              <span className="action-arrow">
                <ArrowRight size={20} />
              </span>
            </button>
          </div>

          <p className="profile-footer-note">
            <span className="footer-status-dot" />
            Your next great conversation is one click away.
          </p>
        </div>
      </section>

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
    </main>
  );
}

export default Profile;
