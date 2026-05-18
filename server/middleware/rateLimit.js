import rateLimit from "express-rate-limit";

/* ===========================
   🚦 GENERAL API LIMITER
=========================== */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                // 100 requests per IP
  message: {
    error: "Too many requests, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false
});

/* ===========================
   🚦 ROOM CREATION LIMITER
=========================== */
export const createRoomLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,                  // only 20 rooms per hour
  message: {
    error: "Room creation limit reached"
  }
});
