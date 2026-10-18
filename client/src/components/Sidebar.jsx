import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  X,
  Menu,
  Crown,
  MessageCircle,
  CircleUserRound,
  UserRoundX,
  ShieldBan,
  RotateCcw,
} from "lucide-react";
import socket from "../socket/socket";
import "../styles/Sidebar.css";

function Sidebar({
  users = [],
  ownerId,
  roomId,
  isOwner = false,
  bannedUsers = [],
}) {
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

  const handleModeration = (action, targetUserId, username) => {
    const labels = {
      kick: `Kick ${username} from this room? They can rejoin.`,
      block: `Block ${username} from this room? They cannot rejoin until unblocked.`,
      unblock: `Unblock ${username}? They will be allowed to join again.`,
    };

    if (!window.confirm(labels[action])) return;

    const eventName = {
      kick: "kick_user",
      block: "block_user",
      unblock: "unblock_user",
    }[action];

    socket.emit(eventName, { roomId, targetUserId });
  };

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
              const userIsOwner = isRoomOwner(user.userId);

              return (
                <div
                  key={String(user.userId)}
                  className={`member-row ${
                    userIsOwner ? "member-row-owner" : ""
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

                  {userIsOwner && (
                    <span
                      className="member-owner-badge"
                      title="Room owner"
                    >
                      <Crown size={13} />
                      Owner
                    </span>
                  )}

                  {isOwner && !userIsOwner && (
                    <div className="member-moderation-actions">
                      <button
                        type="button"
                        title="Kick member"
                        aria-label={`Kick ${user.username}`}
                        onClick={() =>
                          handleModeration(
                            "kick",
                            String(user.userId),
                            user.username || "this user"
                          )
                        }
                      >
                        <UserRoundX size={15} />
                      </button>

                      <button
                        type="button"
                        title="Block member"
                        aria-label={`Block ${user.username}`}
                        onClick={() =>
                          handleModeration(
                            "block",
                            String(user.userId),
                            user.username || "this user"
                          )
                        }
                      >
                        <ShieldBan size={15} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {isOwner && (
          <div className="blocked-members-section">
            <div className="members-section-heading">
              <span>BLOCKED MEMBERS</span>
              <span className="members-count">
                {bannedUsers.length}
              </span>
            </div>

            {bannedUsers.length === 0 ? (
              <p className="blocked-members-empty">
                No blocked members.
              </p>
            ) : (
              bannedUsers.map((blockedUser) => {
                const blockedId =
                  typeof blockedUser === "object" && blockedUser !== null
                    ? blockedUser._id
                    : blockedUser;

                const blockedName =
                  typeof blockedUser === "object" && blockedUser !== null
                    ? blockedUser.username || "Unknown user"
                    : `User ${String(blockedUser).slice(-6)}`;

                return (
                  <div
                    className="blocked-member-row"
                    key={String(blockedId)}
                  >
                    <span className="blocked-member-name">
                      {blockedName}
                    </span>

                    <button
                      type="button"
                      title={`Unblock ${blockedName}`}
                      aria-label={`Unblock ${blockedName}`}
                      onClick={() =>
                        handleModeration(
                          "unblock",
                          String(blockedId),
                          blockedName
                        )
                      }
                    >
                      <RotateCcw size={15} />
                      Unblock
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        <div className="members-sidebar-footer">
          <span className="footer-status-dot" />
          <span>Room connection active</span>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;