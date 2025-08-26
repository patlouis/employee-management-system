import { connectToDatabase } from "../lib/database.js";
import express from "express";

const router = express.Router();

// ================= Constants =================
const POSITION_REQUIRED_FIELDS = ["title"];

// ================= Helper Functions =================
function validateFields(body, requiredFields) {
  for (const field of requiredFields) {
    if (!body[field] || body[field].toString().trim() === "") {
      return `${field} is required`;
    }
  }
  return null;
}

// ================= Routes =================

// Get all positions
router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(
      "SELECT * FROM positions ORDER BY position_id ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching positions:", err);
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

// Get position by ID
router.get("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(
      "SELECT * FROM positions WHERE position_id = ?",
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Position not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching position:", err);
    res.status(500).json({ error: "Failed to fetch position" });
  }
});

// Create position
router.post("/create", async (req, res) => {
  try {
    const error = validateFields(req.body, POSITION_REQUIRED_FIELDS);
    if (error) return res.status(400).json({ error });

    const { title, description } = req.body;
    const db = await connectToDatabase();

    const [result] = await db.query(
      "INSERT INTO positions (title, description) VALUES (?, ?)",
      [title, description || null]
    );

    res
      .status(201)
      .json({ message: "Position created", position_id: result.insertId });
  } catch (err) {
    console.error("Error creating position:", err);
    res.status(500).json({ error: "Failed to create position" });
  }
});

// Update position
router.put("/update/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const db = await connectToDatabase();

    const [result] = await db.query(
      "UPDATE positions SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE position_id = ?",
      [title, description || null, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Position not found" });

    res.json({ message: "Position updated" });
  } catch (err) {
    console.error("Error updating position:", err);
    res.status(500).json({ error: "Failed to update position" });
  }
});

// Delete position
router.delete("/delete/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [result] = await db.query(
      "DELETE FROM positions WHERE position_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Position not found" });

    res.json({ message: "Position deleted" });
  } catch (err) {
    console.error("Error deleting position:", err);
    res.status(500).json({ error: "Failed to delete position" });
  }
});

export default router;
