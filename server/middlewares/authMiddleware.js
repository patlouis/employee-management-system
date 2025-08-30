// middleware/verifyToken.js
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // Expecting: Authorization: Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token data
    next();
  } catch (err) {
    console.error("[JWT Verify Error]", err.message);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}
