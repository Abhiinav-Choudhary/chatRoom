import React, { useEffect, useState , useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { closeChatRoom } from "../api/chat.api";
import EmojiPicker from "emoji-picker-react"
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


const imageInputRef = useRef(null);
const messagesEndRef = useRef(null);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

  useEffect(() => {
  const fetchRoom = async () => {
    try {
      const res = await fetch(
        `https://chatroom-lgj7.onrender.com/api/chatroom/${roomId}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setRoom(data);
    } catch (err) {
      console.error("Failed to fetch room");
    }
  };

  fetchRoom();
}, [roomId]);

useEffect(() => {
  scrollToBottom();
}, [messages]);


 
  useEffect(() => {
  // 🔥 Join room
  socket.emit("join_room", { roomId });

  const handleRoomUsers = (users) => {
    setUsers(users);
  };

  const handlePreviousMessages = (msgs) => {
    setMessages(msgs);
  };

  const handleReceiveMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleRoomClosed = ({ message }) => {
    alert(message);
    navigate("/profile");
  };

  const handlePollUpdated = ({ messageId, poll }) => {
    setMessages(prev =>
      prev.map(msg =>
        msg._id === messageId
          ? { ...msg, poll }
          : msg
      )
    );
  };

  socket.on("room_users", handleRoomUsers);
  socket.on("previous_messages", handlePreviousMessages);
  socket.on("receive_message", handleReceiveMessage);
  socket.on("room_closed", handleRoomClosed);
  socket.on("poll_updated", handlePollUpdated);

  return () => {
    socket.emit("leave_room", { roomId });

    socket.off("room_users", handleRoomUsers);
    socket.off("previous_messages", handlePreviousMessages);
    socket.off("receive_message", handleReceiveMessage);
    socket.off("room_closed", handleRoomClosed);
    socket.off("poll_updated", handlePollUpdated);
  };
}, [roomId, navigate]);




  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("send_message", {
      roomId,
      type: "text",
      content: input
    });

    setInput("");
    setShowEmojiPicker(false);
  };



const handleCreatePoll = (pollData) => {
  socket.emit("send_message", {
    roomId,
    type: "poll",
    poll: pollData
  });
};


const addEmojiToInput = (emojiData) => {
  setInput(prev => prev + emojiData.emoji);
};




const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch(
      "https://chatroom-lgj7.onrender.com/api/upload/image",
      {
        method: "POST",
        credentials: "include",
        body: formData
      }
    );

    const data = await res.json();

    socket.emit("send_message", {
      roomId,
      type: "image",
      content: data.url
    });
  } catch (err) {
    alert("Image upload failed");
  }
};

const sendFile = (fileUrl, fileMeta) => {
  socket.emit("send_message", {
    roomId,
    type: "file",
    content: fileUrl,
    file: fileMeta
  });
};





    const handleLeaveRoom = () => {
  socket.emit("leave_room", { roomId });
  navigate("/profile");

  socket.off("poll_updated");
socket.off("receive_message");

};

  const handleCloseRoom = async () => {
  const confirmClose = window.confirm(
    "Are you sure? This will permanently close the room for everyone."
  );

  if (!confirmClose) return;

  try {
    setClosing(true);
    await closeChatRoom(roomId);
    
  } catch (err) {
    alert("Failed to close room");
  } finally {
    setClosing(false);
  }
};


  return (
    <div className="chatroom-container">
     <Sidebar
  users={users}
  ownerId={
    typeof room?.createdBy === "object"
      ? room.createdBy._id
      : room?.createdBy
  }
/>

      {/* CHAT AREA */}
      <div className="chat-wrapper">
        <div className="room-actions">
          {room &&
      user &&
      room.createdBy.toString() === user._id.toString() && (
        <button
          onClick={handleCloseRoom}
          disabled={closing}
          className="close-room-btn"
        >
          {closing ? "Closing..." : "Close Room"}
        </button>
    )}

    {room &&
      user &&
      (
        (typeof room.createdBy === "object"
          ? room.createdBy._id
          : room.createdBy
        ).toString() !== user._id.toString()
      ) && (
        <button
          onClick={handleLeaveRoom}
          className="leave-room-btn"
        >
          Leave Room
        </button>
    )}
        </div>

        <div className="messages-container">
  {messages.map((msg) => (
  <div key={msg._id} className="message">
    <strong className="message-sender">{msg.sender.username}:</strong>

    {msg.type === "text" && (
      <span className="message-text"> {msg.content}</span>
    )}

    {msg.type === "emoji" && (
      <span className="message-emoji">
        {msg.content}
      </span>
    )}

    {msg.type === "image" && (
      <div className="message-image-wrapper">
        <img
          src={msg.content}
          alt="uploaded"
          className="message-image"
        />
      </div>
    )}

{msg.type === "poll" && (() => {
  const hasVoted = msg.poll.options.some(opt =>
    opt.votes.includes(user._id)
  );

  return (
    <div className="poll-box">
      <strong className="poll-question">{msg.poll.question}</strong>

      {msg.poll.options.map((opt, idx) => (
        <button
          key={idx}
          className={`poll-option ${hasVoted ? 'disabled' : ''}`}
          disabled={hasVoted}
          onClick={() =>
            socket.emit("vote_poll", {
              messageId: msg._id,
              optionIndex: idx
            })
          }
        >
          {opt.option} ({opt.votes.length})
        </button>
      ))}
    </div>
  );
})()}

  </div>
))}
  <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
         
           <button
        onClick={() => setShowEmojiPicker(prev => !prev)}
         className="icon-btn emoji-btn"
          >
          😀
         </button>

       {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="emoji-picker-wrapper">
     <EmojiPicker onEmojiClick={addEmojiToInput} />
          </div>
  )}

  <button className="icon-btn image-btn" onClick={() => imageInputRef.current.click()}>
  🖼
</button>

<input
  type="file"
  accept="image/*"
  ref={imageInputRef}
  style={{ display: "none" }}
  onChange={handleImageUpload}
/>

    <button className="icon-btn poll-btn" onClick={() => setShowPollModal(true)}>
  📊
</button>

{showPollModal && (
  <CreatePollModal
    onClose={() => setShowPollModal(false)}
    onCreate={handleCreatePoll}
  />
)}

           
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          
          

          <button className="send-btn" onClick={sendMessage}>Send</button>

          {/* MOBILE ACTION BUTTONS */}
<div className="mobile-room-actions">
  {room &&
    user &&
    room.createdBy.toString() === user._id.toString() && (
      <button
        onClick={handleCloseRoom}
        disabled={closing}
        className="close-room-btn"
      >
        ✖
      </button>
    )}

  {room &&
    user &&
    (
      (typeof room.createdBy === "object"
        ? room.createdBy._id
        : room.createdBy
      ).toString() !== user._id.toString()
    ) && (
      <button
        onClick={handleLeaveRoom}
        className="leave-room-btn"
      >
        🚪
      </button>
    )}
</div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;