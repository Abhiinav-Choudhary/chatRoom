import {Server} from "socket.io"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import cookie from "cookie"
import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/message.model.js";


let io;

const roomUsers = {}; 
const socketRateMap = {};

const isRateLimited = (
  socket,
  event,
  limit = 10,
  windowMs = 5000
) => {
  const key = `${socket.id}:${event}`;
  const now = Date.now();

  if (!socketRateMap[key]) {
    socketRateMap[key] = { count: 1, lastReset: now };
    return false;
  }

  const data = socketRateMap[key];

  if (now - data.lastReset > windowMs) {
    data.count = 1;
    data.lastReset = now;
    return false;
  }

  data.count += 1;

  return data.count > limit;
};


const initSocket =(httpServer)=>{
io = new Server(httpServer , {
    cors : {
        origin:"http://localhost:5173",
        credentials:true
    }
})


io.use(async(socket , next)=>{

   try {
     const cookieHeader = socket.handshake.headers.cookie 

    if(!cookieHeader){
        return next(new Error("No cookies found"));
    }

    const cookies = cookie.parse(cookieHeader)
    const token = cookies.token
    if(!token){
        return next(new Error("No token found"));
    }

    const decoded = jwt.verify(token  , process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId).select("-password")

    if(!user){
        return next(new Error("Invalid user"))
    }

    socket.user = user;
    next()
   } catch (error) {
    return next(new Error("Authentication failed"));
   }
})

io.on("connection",(socket)=>{
  console.log("User connected", socket.user.username)
  


socket.on("join_room", async ({ roomId }) => {

     if (isRateLimited(socket, "join_room", 3, 10000)) {
    socket.emit("error", "Too many join attempts");
    return;
  }

  try {
    if (!roomId) {
      socket.emit("error", "Room ID is required");
      return;
    }

    const room = await ChatRoom.findById(roomId);
    if (!room || !room.isActive) {
      socket.emit("error", "Room is closed or does not exist");
      return;
    }

    // Join socket.io room
    socket.join(roomId);

    // Presence tracking
    if (!roomUsers[roomId]) {
      roomUsers[roomId] = new Map();
    }

    roomUsers[roomId].set(socket.id, {
      userId: socket.user._id,
      username: socket.user.username
    });

    // 🔹 LOAD PREVIOUS MESSAGES (NEW PART)
    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 })   // oldest → newest
      .limit(50)
      .populate("sender", "username");

    // Send chat history ONLY to joining user
    socket.emit("previous_messages", messages);

    // Update sidebar for everyone
    const users = Array.from(roomUsers[roomId].values());
    io.to(roomId).emit("room_users", users);

    socket.emit("joined_room", { roomId });
  } catch (err) {
    console.error(err);
    socket.emit("error", "Failed to join room");
  }


  socket.on("leave_room", async ({ roomId }) => {
  socket.leave(roomId);

  // 🔥 Recalculate users in room
  const sockets = await io.in(roomId).fetchSockets();

  const users = sockets.map((s) => ({
    userId: s.user._id.toString(),
    username: s.user.username
  }));

  // 🔥 Emit updated users list
  io.to(roomId).emit("room_users", users);
});


socket.on("send_message", async ({ roomId, type = "text", content, file, poll }) => {

  try {

  if (isRateLimited(socket, "send_message", 5, 3000)) {
   socket.emit("socket_error", "message");
    return;
  }

  
   if (!roomId) {
  socket.emit("socket_error", "message");
  return;
}

if (type === "text" || type === "emoji") {
  if (!content || !content.trim()) {
    socket.emit("socket_error", "message");
    return;
  }
}

if (type === "image" || type === "file") {
  if (!content) {
    socket.emit("socket_error", "message");
    return;
  }
}

if (type === "poll") {
  if (!poll || !poll.question || poll.options.length < 2) {
    socket.emit("socket_error", "message");
    return;
  }
}


    const room = await ChatRoom.findById(roomId);
    if (!room || !room.isActive) {
     socket.emit("socket_error", "message");
      return;
    }

   
    if (
      !roomUsers[roomId] ||
      !roomUsers[roomId].has(socket.id)
    ) {
      socket.emit("socket_error", "message");
      return;
    }

    
   const message = await Message.create({
  roomId,
  sender: socket.user._id,
  type,
  content,
  file,
  poll
});


  
    const populatedMessage = await message.populate(
      "sender",
      "username"
    );

   
   io.to(roomId).emit("receive_message", {
  _id: populatedMessage._id,
  roomId,
  type: populatedMessage.type,
  content: populatedMessage.content,
  file: populatedMessage.file,
  poll: populatedMessage.poll,
  sender: populatedMessage.sender,
  createdAt: populatedMessage.createdAt
});

  } catch (err) {
    console.error(err);
    socket.emit("socket_error", "message");
  }
});


socket.on("vote_poll", async ({ messageId, optionIndex }) => {
  try {
    const message = await Message.findById(messageId);
    if (!message || message.type !== "poll") return;

    const userId = socket.user._id.toString();

    
    const alreadyVoted = message.poll.options.some(opt =>
      opt.votes.some(v => v.toString() === userId)
    );

    if (alreadyVoted) return;

    
    message.poll.options[optionIndex].votes.push(socket.user._id);
    await message.save();

   
    io.to(message.roomId.toString()).emit("poll_updated", {
      messageId: message._id.toString(),
      poll: message.poll
    });
  } catch (err) {
    console.error("Poll vote error", err);
  }
});



    socket.on("disconnect", () => {
      for (const roomId in roomUsers) {
        if (roomUsers[roomId].has(socket.id)) {
          roomUsers[roomId].delete(socket.id);

          const users = Array.from(roomUsers[roomId].values());
          io.to(roomId).emit("room_users", users);

         
          if (roomUsers[roomId].size === 0) {
            delete roomUsers[roomId];
          }
        }
      }
 
        Object.keys(socketRateMap).forEach(key => {
  if (key.startsWith(socket.id)) {
    delete socketRateMap[key];
  }
});


      console.log("User disconnected:", socket.user.username);
    });

});


});


  return io;

}


export { io };
export default initSocket
