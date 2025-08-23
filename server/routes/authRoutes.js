import { connectToDatabase } from "../lib/database.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

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
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
