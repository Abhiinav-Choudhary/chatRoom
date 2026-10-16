import express from "express";
import upload from "../middleware/upload.middleware.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/image",
  protect,
  upload.single("image"),
  (req, res) => {
    res.json({
      url: `https://chatroom-lgj7.onrender.com/uploads/${req.file.filename}`
    });
  }
);

export default router;
