import React from "react";
import "../styles/Sidebar.css";

function Sidebar({ users, ownerId }) {
  
  const uniqueUsers = Array.from(
    new Map(users.map(u => [u.userId, u])).values()
  );

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Users</h3>

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
  );
}

export default Sidebar;