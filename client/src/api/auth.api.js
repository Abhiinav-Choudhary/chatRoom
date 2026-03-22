import axios from "axios";

const API = axios.create({
  baseURL: "https://chatroom-lgj7.onrender.com/api",
  withCredentials: true // VERY IMPORTANT (cookies)
});

export const loginUser = (data) =>
  API.post("/auth/login", data);

export const registerUser = (data) =>
  API.post("/auth/register", data);

export const logoutUser = () =>
  API.post("/auth/logout");

export const getMe = () =>
  API.get("/auth/me");
