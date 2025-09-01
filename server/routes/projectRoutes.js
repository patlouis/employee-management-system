import { connectToDatabase } from "../lib/database.js";
import express from "express";

const router = express.Router();

const PROJECT_REQUIRED_FIELDS = [
  "department_id",
  "title",
  "description",
  "status",
];

// ================= Helper =================
function validateFields(body, requiredFields) {
  for (const field of requiredFields) {
    if (!body[field] || body[field].toString().trim() === "") {
      return `${field} is required`;
    }
  }
  return null;
}

// ================= Routes =================

// Get all projects with optional sorting
router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    let sql = `
      SELECT p.*, d.name AS department_name 
      FROM projects p
      LEFT JOIN departments d ON p.department_id = d.department_id
    `;

    // Server-side sorting
    const { sortBy, order } = req.query;
    const validColumns = [
      "project_id",
      "title",
      "department_name",
      "description",
      "status",
      "created_at",
      "updated_at",
    ];
    if (sortBy && validColumns.includes(sortBy)) {
      const sortOrder = order === "desc" ? "DESC" : "ASC";
      sql += ` ORDER BY ${sortBy} ${sortOrder}`;
    } else {
      sql += " ORDER BY project_id ASC"; // default sorting
    }

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Get project count
router.get("/count", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM projects");
    res.json({ total: rows[0].total });
  } catch (err) {
    console.error("Error fetching project count:", err);
    res.status(500).json({ error: "Failed to fetch project count" });
  }
});

// Get project by ID
router.get("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(
      "SELECT * FROM projects WHERE project_id = ?",
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Project not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// Create project
router.post("/create", async (req, res) => {
  try {
    const error = validateFields(req.body, PROJECT_REQUIRED_FIELDS);
    if (error) return res.status(400).json({ error });

    const { title, description, department_id, status } = req.body;
    const db = await connectToDatabase();

    const [result] = await db.query(
      "INSERT INTO projects (title, description, department_id, status) VALUES (?, ?, ?, ?)",
      [title, description || null, department_id, status]
    );

    res
      .status(201)
      .json({ message: "Project created", project_id: result.insertId });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Update project
router.put("/update/:id", async (req, res) => {
  try {
    const { title, description, department_id, status } = req.body;
    const db = await connectToDatabase();

    const [result] = await db.query(
      "UPDATE projects SET title = ?, description = ?, department_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE project_id = ?",
      [title, description || null, department_id, status, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Project not found" });

    res.json({ message: "Project updated" });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// Delete project
router.delete("/delete/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [result] = await db.query(
      "DELETE FROM projects WHERE project_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Project not found" });

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
