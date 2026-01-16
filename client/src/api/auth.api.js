import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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
