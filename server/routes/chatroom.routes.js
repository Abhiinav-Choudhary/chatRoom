import express from "express";
import { createRoom , closeRoom , getChatRoomById,getNearbyRooms} from "../controllers/chatroom.controller.js";
import protect from "../middleware/auth.middleware.js";
import { createRoomLimiter } from "../middleware/rateLimit.js";


const router = express.Router();

router.post("/create", protect, createRoomLimiter, createRoom);
router.get("/nearby", protect, getNearbyRooms);
router.post("/:roomId/close", protect, closeRoom);
router.get("/:roomId", protect, getChatRoomById);


export default router;
