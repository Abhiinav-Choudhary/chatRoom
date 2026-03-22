import { io } from "socket.io-client";

const socket = io("https://chatroom-lgj7.onrender.com", {
  withCredentials: true
});

export default socket;
