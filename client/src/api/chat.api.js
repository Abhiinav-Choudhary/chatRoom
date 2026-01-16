import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true // cookies
});

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
