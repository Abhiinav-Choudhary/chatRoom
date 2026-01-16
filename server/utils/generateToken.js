import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,        // true ONLY in HTTPS
    sameSite: "lax",      // 🔥 REQUIRED for localhost
    maxAge: 24 * 60 * 60 * 1000
  });
};

export default generateToken;
