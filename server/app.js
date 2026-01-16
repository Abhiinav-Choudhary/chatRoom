import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import chatRoomRoutes from "./routes/chatroom.routes.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import cors from "cors"
import path from "path";
import uploadRoutes from "./routes/upload.routes.js";



const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,               // ALLOW COOKIES
  })
);
app.use(express.json());
app.use(cookieParser());


app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/chatroom", chatRoomRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/upload", uploadRoutes);

export default app;