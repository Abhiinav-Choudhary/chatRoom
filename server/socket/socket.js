import mongoose from "mongoose";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";

import User from "../models/user.model.js";
import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/message.model.js";

let io;

const roomUsers = Object.create(null);
const socketRateMap = Object.create(null);

// Rate limiter for individual socket events
const isRateLimited = (
  socket,
  event,
  limit = 10,
  windowMs = 5000
) => {
  const key = `${socket.id}:${event}`;
  const now = Date.now();

  if (!socketRateMap[key]) {
    socketRateMap[key] = {
      count: 1,
      lastReset: now,
    };

    return false;
  }

  const data = socketRateMap[key];

  if (now - data.lastReset >= windowMs) {
    data.count = 1;
    data.lastReset = now;
    return false;
  }

  data.count += 1;

  return data.count > limit;
};

// Get currently connected users in a room
const getRoomUsers = (roomId) => {
  if (!roomUsers[roomId]) {
    return [];
  }

  return Array.from(roomUsers[roomId].values());
};

// Broadcast the current room users
const broadcastRoomUsers = (roomId) => {
  io.to(roomId).emit("room_users", getRoomUsers(roomId));
};

// Remove a socket from room presence tracking
const removeSocketFromRooms = (socket) => {
  for (const roomId of Object.keys(roomUsers)) {
    if (roomUsers[roomId].has(socket.id)) {
      roomUsers[roomId].delete(socket.id);
      broadcastRoomUsers(roomId);

      if (roomUsers[roomId].size === 0) {
        delete roomUsers[roomId];
      }
    }
  }
};

// Initialize Socket.IO
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://chat-room-mu-umber.vercel.app",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authenticate using the JWT cookie
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;

      if (!cookieHeader) {
        return next(new Error("No cookies found"));
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.token;

      if (!token) {
        return next(new Error("No token found"));
      }

      if (!process.env.JWT_SECRET) {
        return next(new Error("Authentication configuration error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.userId).select(
        "-password"
      );

      if (!user) {
        return next(new Error("Invalid user"));
      }

      socket.user = user;

      next();
    } catch (error) {
      console.error("Socket authentication failed:", error.message);
      next(new Error("Authentication failed"));
    }
  });

  // Every event handler is registered directly on connection
  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.username);

    // JOIN ROOM
   
socket.on("join_room", async (payload = {}) => {
  if (isRateLimited(socket, "join_room", 3, 10000)) {
    socket.emit("error", "Too many join attempts");
    return;
  }

  try {
    const roomId = payload?.roomId;

    if (!roomId || !mongoose.isValidObjectId(roomId)) {
      socket.emit("error", "A valid room ID is required");
      return;
    }

    const room = await ChatRoom.findById(roomId);

    if (!room || !room.isActive) {
      socket.emit("error", "Room is closed or does not exist");
      return;
    }

    const normalizedRoomId = room._id.toString();
    const userId = socket.user._id.toString();

    // Already joined with this socket.
    if (socket.rooms.has(normalizedRoomId)) {
      socket.emit("joined_room", {
        roomId: normalizedRoomId,
      });
      return;
    }

    if (!roomUsers[normalizedRoomId]) {
      roomUsers[normalizedRoomId] = new Map();
    }

    const members = roomUsers[normalizedRoomId];

    // Count unique users, not socket connections.
    const uniqueUserIds = new Set(
      [...members.values()].map((member) => member.userId)
    );

    const isAlreadyMember = uniqueUserIds.has(userId);
    const maxMembers = room.maxMembers;

    if (
      !isAlreadyMember &&
      maxMembers != null &&
      uniqueUserIds.size >= maxMembers
    ) {
      socket.emit("room_full", {
        roomId: normalizedRoomId,
        message: "This room is full. You cannot join right now.",
        maxMembers,
      });
      return;
    }

    socket.join(normalizedRoomId);

    members.set(socket.id, {
      userId,
      username: socket.user.username,
    });

    // Load the latest 50 messages, oldest to newest.
    const messages = await Message.find({
      roomId: normalizedRoomId,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("sender", "username")
      .then((items) => items.reverse());

    socket.emit("previous_messages", messages);

    broadcastRoomUsers(normalizedRoomId);

    socket.emit("joined_room", {
      roomId: normalizedRoomId,
    });
  } catch (error) {
    console.error("Join room error:", error);
    socket.emit("error", "Failed to join room");
  }
});

    // LEAVE ROOM
    socket.on("leave_room", async (payload = {}) => {
      try {
        const roomId = payload?.roomId;

        if (!roomId) return;

        const normalizedRoomId = roomId.toString();

        // Only leave rooms this socket has joined
        if (!socket.rooms.has(normalizedRoomId)) return;

        socket.leave(normalizedRoomId);

        if (roomUsers[normalizedRoomId]) {
          roomUsers[normalizedRoomId].delete(socket.id);

          if (roomUsers[normalizedRoomId].size === 0) {
            delete roomUsers[normalizedRoomId];
          } else {
            broadcastRoomUsers(normalizedRoomId);
          }
        }
      } catch (error) {
        console.error("Leave room error:", error);
      }
    });

    // SEND MESSAGE
    socket.on("send_message", async (payload = {}) => {
      try {
        if (isRateLimited(socket, "send_message", 5, 3000)) {
          socket.emit("socket_error", "message");
          return;
        }

        const {
          roomId,
          type = "text",
          content,
          file,
          poll,
        } = payload;

        if (!roomId) {
          socket.emit("socket_error", "message");
          return;
        }

        const normalizedRoomId = roomId.toString();

        // Validate the message type
        const allowedTypes = [
          "text",
          "emoji",
          "image",
          "file",
          "poll",
        ];

        if (!allowedTypes.includes(type)) {
          socket.emit("socket_error", "message");
          return;
        }

        if (
          (type === "text" || type === "emoji") &&
          (typeof content !== "string" || !content.trim())
        ) {
          socket.emit("socket_error", "message");
          return;
        }

        if (
          (type === "image" || type === "file") &&
          !content &&
          !file
        ) {
          socket.emit("socket_error", "message");
          return;
        }

        if (
          type === "poll" &&
          (
            !poll ||
            typeof poll.question !== "string" ||
            !poll.question.trim() ||
            !Array.isArray(poll.options) ||
            poll.options.length < 2
          )
        ) {
          socket.emit("socket_error", "message");
          return;
        }

        // The sender must have joined this room
        if (
          !socket.rooms.has(normalizedRoomId) ||
          !roomUsers[normalizedRoomId]?.has(socket.id)
        ) {
          socket.emit("socket_error", "message");
          return;
        }

        const room = await ChatRoom.findById(normalizedRoomId);

        if (!room || !room.isActive) {
          socket.emit("socket_error", "message");
          return;
        }

        const message = await Message.create({
         roomId: normalizedRoomId,
          sender: socket.user._id,
           type,
           content,
          fileName: payload.fileName,
         fileSize: payload.fileSize,
         poll,
         });

        const populatedMessage = await message.populate(
          "sender",
          "username"
        );

        io.to(normalizedRoomId).emit("receive_message", {
         _id: populatedMessage._id,
         roomId: normalizedRoomId,
          type: populatedMessage.type,
          content: populatedMessage.content,
           fileName: populatedMessage.fileName,
           fileSize: populatedMessage.fileSize,
          poll: populatedMessage.poll,
           sender: populatedMessage.sender,
          createdAt: populatedMessage.createdAt,
       });
      } catch (error) {
        console.error("Send message error:", error);
        socket.emit("socket_error", "message");
      }
    });

    // VOTE IN POLL
socket.on("vote_poll", async (payload = {}) => {
  try {
    const { messageId, optionIndex } = payload;

    if (
      !messageId ||
      !Number.isInteger(optionIndex) ||
      optionIndex < 0
    ) {
      return;
    }

    const message = await Message.findById(messageId);

    if (!message || message.type !== "poll") return;

    const roomId = message.roomId.toString();

    if (
      !socket.rooms.has(roomId) ||
      !roomUsers[roomId]?.has(socket.id)
    ) {
      return;
    }

    const options = message.poll?.options;

    if (!Array.isArray(options) || optionIndex >= options.length) {
      return;
    }

    const userId = socket.user._id.toString();

    const alreadyVoted = options.some((option) =>
      option.votes.some((vote) => vote.toString() === userId)
    );

    if (alreadyVoted) return;

    options[optionIndex].votes.push(socket.user._id);

    await message.save();

    // Fetch voter details for the UI.
    const updatedMessage = await Message.findById(message._id)
      .populate("poll.options.votes", "username");

    io.to(roomId).emit("poll_updated", {
      messageId: updatedMessage._id.toString(),
      poll: updatedMessage.poll,
    });
  } catch (error) {
    console.error("Poll vote error:", error);
  }
});

    // DISCONNECT
    socket.on("disconnect", (reason) => {
      removeSocketFromRooms(socket);

      // Clear this socket's rate-limit entries
      for (const key of Object.keys(socketRateMap)) {
        if (key.startsWith(`${socket.id}:`)) {
          delete socketRateMap[key];
        }
      }

      console.log(
        "User disconnected:",
        socket.user.username,
        reason
      );
    });
  });

  return io;
};

export { io };
export default initSocket;
