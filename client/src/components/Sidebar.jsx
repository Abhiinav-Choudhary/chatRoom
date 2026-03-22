import React, { useState } from "react";
import "../styles/Sidebar.css";

function Sidebar({ users, ownerId }) {
  const [isOpen, setIsOpen] = useState(false);

  const uniqueUsers = Array.from(
    new Map(users.map(u => [u.userId, u])).values()
  );

  return (
    <>
      {/* Hamburger Button */}
      <button className="hamburger-btn" onClick={() => setIsOpen(true)}>
        ☰
      </button>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">Users</h3>
          <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        {uniqueUsers.length === 0 && <p className="no-users">No users</p>}

        {uniqueUsers.map((user) => {
          const isOwner = user.userId === ownerId;

          return (
            <div key={user.userId} className="user-item">
              <span className="user-status">🟢</span>
              <span className="user-name">{user.username}</span>
              {isOwner && <span className="owner-badge">👑 Owner</span>}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Sidebar;