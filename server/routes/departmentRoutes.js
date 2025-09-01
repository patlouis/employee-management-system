import { connectToDatabase } from "../lib/database.js";
import express from "express";

const router = express.Router();

// ================= Constants =================
const DEPARTMENT_REQUIRED_FIELDS = ["name"];

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

// Get all departments with optional sorting
router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    let { sortBy = "department_id", order = "asc" } = req.query;

    // ✅ Allow only safe columns
    const allowedColumns = [
      "department_id",
      "name",
      "description",
      "created_at",
      "updated_at",
    ];
    if (!allowedColumns.includes(sortBy)) sortBy = "department_id";
    if (!["asc", "desc"].includes(order.toLowerCase())) order = "asc";

    const [rows] = await db.query(
      `SELECT * FROM departments ORDER BY ${sortBy} ${order.toUpperCase()}`
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

// Get department count
router.get("/count", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM departments");
    res.json({ total: rows[0].total });
  } catch (err) {
    console.error("Error fetching department count:", err);
    res.status(500).json({ error: "Failed to fetch department count" });
  }
});

// Get department by ID
router.get("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(
      "SELECT * FROM departments WHERE department_id = ?",
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Department not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching department:", err);
    res.status(500).json({ error: "Failed to fetch department" });
  }
});

// Create department
router.post("/create", async (req, res) => {
  try {
    const error = validateFields(req.body, DEPARTMENT_REQUIRED_FIELDS);
    if (error) return res.status(400).json({ error });

    const { name, description } = req.body;
    const db = await connectToDatabase();

    const [result] = await db.query(
      "INSERT INTO departments (name, description) VALUES (?, ?)",
      [name, description || null]
    );

    res
      .status(201)
      .json({ message: "Department created", department_id: result.insertId });
  } catch (err) {
    console.error("Error creating department:", err);
    res.status(500).json({ error: "Failed to create department" });
  }
});

// Update department
router.put("/update/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const db = await connectToDatabase();

    const [result] = await db.query(
      "UPDATE departments SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE department_id = ?",
      [name, description || null, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Department not found" });

    res.json({ message: "Department updated" });
  } catch (err) {
    console.error("Error updating department:", err);
    res.status(500).json({ error: "Failed to update department" });
  }
});

// Delete department
router.delete("/delete/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [result] = await db.query(
      "DELETE FROM departments WHERE department_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Department not found" });

    res.json({ message: "Department deleted" });
  } catch (err) {
    console.error("Error deleting department:", err);
    res.status(500).json({ error: "Failed to delete department" });
  }
});

export default router;
