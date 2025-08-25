import { connectToDatabase } from "../lib/database.js";
import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

const USER_REQUIRED_FIELDS = ["first_name", "last_name", "email", "password"];

function validateFields(body, requiredFields) {
  for (const field of requiredFields) {
    if (!body[field]) return `${field} is required.`;
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return "Invalid email format.";
  }
  return null;
}

function validateUser(req, res, next) {
  const error = validateFields(req.body, USER_REQUIRED_FIELDS);
  if (error) return res.status(400).json({ message: error });
  next();
}

// ================== GET all users ==================
router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (err) {
    console.error("[Fetch Users Error]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get department count
router.get("/count", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM users");
    res.json({ total: rows[0].total });
  } catch (err) {
    console.error("Error fetching user count:", err);
    res.status(500).json({ error: "Failed to fetch user count" });
  }
});

// ================== CREATE user ==================
router.post("/create", validateUser, async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const db = await connectToDatabase();

    // Check if email already exists
    const [existing] = await db.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (first_name, last_name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [first_name, last_name, email, hashedPassword]
    );

    res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    console.error("[Create User Error]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================== UPDATE user ==================
router.put("/update/:user_id", validateUser, async (req, res) => {
  const { user_id } = req.params;
  const { first_name, last_name, email, password } = req.body;

  try {
    const db = await connectToDatabase();

    // Check if email exists for another user
    const [existing] = await db.query(
      "SELECT user_id FROM users WHERE email = ? AND user_id != ?",
      [email, user_id]
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "Email already in use by another user." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `UPDATE users 
       SET first_name = ?, last_name = ?, email = ?, password = ?, updated_at = NOW()
       WHERE user_id = ?`,
      [first_name, last_name, email, hashedPassword, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User updated successfully." });
  } catch (err) {
    console.error("[Update User Error]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================== DELETE user ==================
router.delete("/delete/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const db = await connectToDatabase();
    const [result] = await db.query("DELETE FROM users WHERE user_id = ?", [
      user_id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("[Delete User Error]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
