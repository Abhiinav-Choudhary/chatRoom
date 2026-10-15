
import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  X,
  Menu,
  Crown,
  MessageCircle,
  CircleUserRound,
} from "lucide-react";
import "../styles/Sidebar.css";

function Sidebar({ users = [], ownerId }) {
  const [isOpen, setIsOpen] = useState(false);

  const uniqueUsers = useMemo(() => {
    const validUsers = Array.isArray(users)
      ? users.filter((user) => user?.userId)
      : [];

    return Array.from(
      new Map(
        validUsers.map((user) => [String(user.userId), user])
      ).values()
    );
  }, [users]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const getInitials = (username) =>
    (username || "User")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");

  const isRoomOwner = (userId) =>
    ownerId != null &&
    userId != null &&
    String(userId) === String(ownerId);

  return (
    <>
      <button
        type="button"
        className="members-menu-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open room members"
        aria-expanded={isOpen}
        aria-controls="room-members-sidebar"
      >
        <Menu size={21} />
      </button>

      {isOpen && (
        <button
          type="button"
          className="members-overlay"
          onClick={() => setIsOpen(false)}
          aria-label="Close members sidebar"
        />
      )}

      <aside
        id="room-members-sidebar"
        className={`members-sidebar ${isOpen ? "is-open" : ""}`}
        aria-label="Room members"
      >
        <div className="members-sidebar-header">
          <div className="members-brand">
            <div className="members-brand-icon">
              <MessageCircle size={21} />
            </div>

            <div>
              <h2>ChatHub</h2>
              <p>Room members</p>
            </div>
          </div>

          <button
            type="button"
            className="members-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close room members"
          >
            <X size={20} />
          </button>
        </div>

        <div className="members-online-summary">
          <span className="members-online-indicator" />

          <div>
            <strong>
              {uniqueUsers.length}{" "}
              {uniqueUsers.length === 1 ? "member" : "members"}
            </strong>
            <p>In this conversation</p>
          </div>
        </div>

        <div className="members-section-heading">
          <span>PEOPLE</span>
          <span className="members-count">{uniqueUsers.length}</span>
        </div>

        <div className="members-list">
          {uniqueUsers.length === 0 ? (
            <div className="members-empty">
              <CircleUserRound size={30} />
              <strong>No members yet</strong>
              <p>Members will appear here when they join.</p>
            </div>
          ) : (
            uniqueUsers.map((user) => {
              const isOwner = isRoomOwner(user.userId);

              return (
                <div
                  key={String(user.userId)}
                  className={`member-row ${
                    isOwner ? "member-row-owner" : ""
                  }`}
                >
                  <div className="member-avatar">
                    {getInitials(user.username)}
                    <span className="member-status-dot" />
                  </div>

                  <div className="member-info">
                    <span className="member-name">
                      {user.username || "Unknown user"}
                    </span>
                    <span className="member-presence">
                      <span />
                      In this room
                    </span>
                  </div>

                  {isOwner && (
                    <span className="member-owner-badge" title="Room owner">
                      <Crown size={13} />
                      Owner
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="members-sidebar-footer">
          <span className="footer-status-dot" />
          <span>Room connection active</span>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
