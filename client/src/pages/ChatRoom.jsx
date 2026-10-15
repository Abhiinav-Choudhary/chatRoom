
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  ImagePlus,
  Smile,
  BarChart3,
  LogOut,
  X,
  MessageCircle,
  Users,
  LoaderCircle,
} from "lucide-react";

import socket from "../socket/socket";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { closeChatRoom } from "../api/chat.api";
import EmojiPicker from "emoji-picker-react";
import CreatePollModal from "../components/CreatePollModal";
import "../styles/ChatRoom.css";

function ChatRoom() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [closing, setClosing] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomError, setRoomError] = useState("");
  const [uploading, setUploading] = useState(false);

  const imageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const userId = user?._id?.toString();
  const ownerId = (
    typeof room?.createdBy === "object"
      ? room?.createdBy?._id
      : room?.createdBy
  )?.toString();

  const isOwner = Boolean(userId && ownerId === userId);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let cancelled = false;

    const fetchRoom = async () => {
      setRoomLoading(true);
      setRoomError("");

      try {
        const res = await fetch(
          `${apiUrl}/api/chatroom/${roomId}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error(`Unable to load room (${res.status})`);
        }

        const data = await res.json();

        if (!cancelled) setRoom(data);
      } catch (error) {
        if (!cancelled) {
          setRoomError(error.message || "Failed to load room.");
        }
      } finally {
        if (!cancelled) setRoomLoading(false);
      }
    };

    if (roomId) fetchRoom();

    return () => {
      cancelled = true;
    };
  }, [roomId, apiUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    const joinRoom = () => {
      socket.emit("join_room", { roomId });
    };

    const handleRoomUsers = (data) => setUsers(data);
    const handlePreviousMessages = (data) => setMessages(data);

    const handleReceiveMessage = (msg) => {
      setMessages((prev) =>
        prev.some((item) => item._id === msg._id)
          ? prev
          : [...prev, msg]
      );
    };

    const handleRoomClosed = ({ message }) => {
      window.alert(message);
      navigate("/profile");
    };

    const handlePollUpdated = ({ messageId, poll }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, poll } : msg
        )
      );
    };

    socket.on("connect", joinRoom);
    socket.on("room_users", handleRoomUsers);
    socket.on("previous_messages", handlePreviousMessages);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("room_closed", handleRoomClosed);
    socket.on("poll_updated", handlePollUpdated);

    if (!socket.connected) {
      socket.connect();
    } else {
      joinRoom();
    }

    return () => {
      if (socket.connected) {
        socket.emit("leave_room", { roomId });
      }

      socket.off("connect", joinRoom);
      socket.off("room_users", handleRoomUsers);
      socket.off("previous_messages", handlePreviousMessages);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("room_closed", handleRoomClosed);
      socket.off("poll_updated", handlePollUpdated);
    };
  }, [roomId, navigate]);

  const sendMessage = () => {
    if (!input.trim() || !socket.connected) return;

    socket.emit("send_message", {
      roomId,
      type: "text",
      content: input.trim(),
    });

    setInput("");
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleCreatePoll = (pollData) => {
    if (!socket.connected) return;

    socket.emit("send_message", {
      roomId,
      type: "poll",
      poll: pollData,
    });

    setShowPollModal(false);
  };

  const addEmojiToInput = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please select an image.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const res = await fetch(`${apiUrl}/api/upload/image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed (${res.status})`);
      }

      const data = await res.json();

      if (!data.url) throw new Error("Image URL missing.");

      socket.emit("send_message", {
        roomId,
        type: "image",
        content: data.url,
      });
    } catch (error) {
      window.alert(error.message || "Image upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleLeaveRoom = () => {
    if (socket.connected) {
      socket.emit("leave_room", { roomId });
    }

    navigate("/profile");
  };

  const handleCloseRoom = async () => {
    const confirmed = window.confirm(
      "Close this room for everyone? This action may not be reversible."
    );

    if (!confirmed) return;

    try {
      setClosing(true);
      await closeChatRoom(roomId);
      navigate("/profile");
    } catch {
      window.alert("Failed to close room.");
    } finally {
      setClosing(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (roomLoading) {
    return (
      <div className="chatroom-state">
        <LoaderCircle className="state-spinner" size={30} />
        <p>Opening your conversation...</p>
      </div>
    );
  }

  if (roomError) {
    return (
      <div className="chatroom-state">
        <MessageCircle size={36} />
        <h2>Couldn't open this room</h2>
        <p>{roomError}</p>
        <button onClick={() => navigate("/profile")}>
          Back to profile
        </button>
      </div>
    );
  }

  return (
    <main className="chatroom-container">
      {/* Members sidebar stays visible on desktop and becomes a drawer on smaller screens. */}
      <Sidebar users={users} ownerId={ownerId} />

      <section className="chat-wrapper">
   
        <header className="chat-header">
          <button
            className="mobile-back-btn"
            onClick={() => navigate("/profile")}
            aria-label="Back to profile"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="room-avatar">
            <MessageCircle size={23} />
          </div>

          <div className="room-heading">
            <h1>{room?.name || room?.title || "Chat Room"}</h1>
            <p>
              <span className="online-indicator" />
              {users.length} {users.length === 1 ? "member" : "members"}{" "}
              <span className="header-divider">·</span> Live conversation
            </p>
          </div>

          <div className="header-actions">
            <div className="member-count">
              <Users size={16} />
              <span>{users.length}</span>
            </div>
            {isOwner ? (
              <button
                className="header-action danger-action"
                onClick={handleCloseRoom}
                disabled={closing}
                title="Close room"
              >
                <X size={17} />
                <span>{closing ? "Closing..." : "Close room"}</span>
              </button>
            ) : (
              <button
                className="header-action"
                onClick={handleLeaveRoom}
                title="Leave room"
              >
                <LogOut size={17} />
                <span>Leave</span>
              </button>
            )}
          </div>
        </header>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">
                <MessageCircle size={30} />
              </div>
              <h2>Start the conversation</h2>
              <p>Say hello or share something with the room.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const ownMessage =
                msg.sender?._id?.toString() === userId ||
                msg.sender?.toString() === userId;

              const pollOptions = msg.poll?.options || [];
              const hasVoted = pollOptions.some((option) =>
                (option.votes || []).some(
                  (vote) => vote.toString() === userId
                )
              );

              return (
                <article
                  key={msg._id}
                  className={`message-row ${
                    ownMessage ? "own-message" : ""
                  }`}
                >
                  <div className="message-avatar">
                    {(msg.sender?.username || "?")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="message-content">
                    <div className="message-meta">
                      <span className="message-sender">
                        {ownMessage
                          ? "You"
                          : msg.sender?.username || "Member"}
                      </span>
                      <time>{formatTime(msg.createdAt)}</time>
                    </div>

                    <div className="message-bubble">
                      {msg.type === "text" && (
                        <p className="message-text">{msg.content}</p>
                      )}

                      {msg.type === "emoji" && (
                        <p className="message-emoji">{msg.content}</p>
                      )}

                      {msg.type === "image" && (
                        <a
                          href={msg.content}
                          target="_blank"
                          rel="noreferrer"
                          className="message-image-link"
                        >
                          <img
                            src={msg.content}
                            alt="Shared in chat"
                            className="message-image"
                            loading="lazy"
                          />
                        </a>
                      )}

                      {msg.type === "file" && (
                        <div className="file-message">
                          {msg.fileName || "Shared file"}
                          {msg.fileSize
                            ? ` · ${(msg.fileSize / 1024).toFixed(1)} KB`
                            : ""}
                        </div>
                      )}

                      {msg.type === "poll" && (
                        <div className="poll-box">
                          <div className="poll-title-row">
                            <BarChart3 size={19} />
                            <span>Community poll</span>
                          </div>

                          <h3 className="poll-question">
                            {msg.poll?.question}
                          </h3>

                          <div className="poll-options">
                            {pollOptions.map((option, index) => {
                              const votes = option.votes || [];
                              const totalVotes = pollOptions.reduce(
                                (sum, item) =>
                                  sum + (item.votes?.length || 0),
                                0
                              );
                              const percentage = totalVotes
                                ? Math.round(
                                    (votes.length / totalVotes) * 100
                                  )
                                : 0;

                              return (
                                <button
                                  key={index}
                                  className="poll-option"
                                  disabled={hasVoted || !socket.connected}
                                  onClick={() =>
                                    socket.emit("vote_poll", {
                                      messageId: msg._id,
                                      optionIndex: index,
                                    })
                                  }
                                >
                                  <span
                                    className="poll-progress"
                                    style={{
                                      width: `${percentage}%`,
                                    }}
                                  />
                                  <span className="poll-option-label">
                                    {option.option}
                                  </span>
                                  <span className="poll-vote-count">
                                    {votes.length}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          <p className="poll-footer">
                            {hasVoted
                              ? "You've voted"
                              : "Choose an option to vote"}
                            {" · "}
                            {pollOptions.reduce(
                              (sum, option) =>
                                sum + (option.votes?.length || 0),
                              0
                            )}{" "}
                            votes
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        <footer className="chat-composer">
          {showEmojiPicker && (
            <div className="emoji-picker-wrapper">
              <EmojiPicker
                onEmojiClick={addEmojiToInput}
                height={350}
                width="min(320px, calc(100vw - 32px))"
              />
            </div>
          )}

          <div className="composer-toolbar">
            <button
              className={`composer-icon ${
                showEmojiPicker ? "active" : ""
              }`}
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              aria-label="Add emoji"
              title="Add emoji"
            >
              <Smile size={21} />
            </button>

            <button
              className="composer-icon"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              aria-label="Upload image"
              title="Upload image"
            >
              {uploading ? (
                <LoaderCircle className="state-spinner" size={20} />
              ) : (
                <ImagePlus size={21} />
              )}
            </button>

            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              hidden
              onChange={handleImageUpload}
            />

            <button
              className="composer-icon"
              onClick={() => setShowPollModal(true)}
              aria-label="Create poll"
              title="Create poll"
            >
              <BarChart3 size={21} />
            </button>

            <span className="composer-hint">
              Be kind. Keep the conversation going.
            </span>
          </div>

          <div className="composer-input-row">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              onFocus={() => setShowEmojiPicker(false)}
              placeholder="Write a message..."
              className="message-input"
              aria-label="Write a message"
            />

            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || !socket.connected}
              aria-label="Send message"
            >
              <Send size={18} />
              <span>Send</span>
            </button>
          </div>
        </footer>

               {showPollModal && (
          <CreatePollModal
            onClose={() => setShowPollModal(false)}
            onCreate={handleCreatePoll}
          />
        )}
      </section>
    </main>
  );
}

export default ChatRoom;
