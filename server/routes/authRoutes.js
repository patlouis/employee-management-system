import { connectToDatabase } from "../lib/database.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  // Validate input
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM employees WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO employees (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
      [first_name, last_name, email, hashedPassword]
    );
    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    console.error("[Register Error]", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(
      `SELECT email, first_name, last_name
         FROM employees 
         WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "User does not exist." });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password." });
    }
    const token = jwt.sign(
      {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );
    return res.status(200).json({ token });
  } catch (err) {
    console.error("[Login Error]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
