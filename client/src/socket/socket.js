
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`, {
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  autoConnect: false,
});

export default socket;
// https://chatroom-lgj7.onrender.com