import axios from "axios";

const API = axios.create({
  baseURL: "https://chatroom-lgj7.onrender.com/api",
  withCredentials: true // cookies
});
// localhost:5000

/* =====================
   CHAT ROOM APIs
===================== */

export const createChatRoom = (data) =>
  API.post("/chatroom/create", data);

export const closeChatRoom = (roomId) =>
  API.post(`/chatroom/${roomId}/close`);

export const joinChatRoom = (roomId) =>
  API.post(`/chatroom/${roomId}/join`); // future use

export const getMyRooms = () =>
  API.get("/chatroom/my"); // future use

export const getNearbyRooms = ({ latitude, longitude }) =>
  API.get("/chatroom/nearby", {
    params: { latitude, longitude }
  });
