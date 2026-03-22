import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // ✅ REQUIRED (HTTPS)
    sameSite: "None",    // ✅ REQUIRED (cross-origin)
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export default generateToken;
