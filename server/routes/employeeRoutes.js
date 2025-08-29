import { connectToDatabase } from "../lib/database.js";
import express from "express";

const router = express.Router();

const EMPLOYEE_REQUIRED_FIELDS = [
  "first_name",
  "last_name",
  "email",
  "phone",
  "department_id",
  "position_id",
  "salary",
];

// ================= Helper =================
function validateFields(body, requiredFields) {
  for (const field of requiredFields) {
    if (!body[field]) return `${field} is required.`;
  }
  return null;
}

// ================= Routes =================

// Get all employees with department & position names
router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(
      `SELECT e.employee_id, e.first_name, e.last_name, e.email, e.phone,
              e.salary, e.department_id, e.position_id,
              d.name AS department, p.title AS position
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.department_id
       LEFT JOIN positions p ON e.position_id = p.position_id`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Failed to fetch employees." });
  }
});

// GET total employee count
router.get("/count", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM employees");
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("[Count Employees Error]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create
router.post("/create", async (req, res) => {
  try {
    const error = validateFields(req.body, EMPLOYEE_REQUIRED_FIELDS);
    if (error) return res.status(400).json({ error });

    const db = await connectToDatabase();
    const {
      first_name,
      last_name,
      email,
      phone,
      department_id,
      position_id,
      salary,
    } = req.body;

    await db.query(
      `INSERT INTO employees (first_name, last_name, email, phone, department_id, position_id, salary)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone, department_id, position_id, salary]
    );

    res.json({ message: "Employee created successfully." });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: "Failed to create employee." });
  }
});

// Update
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const error = validateFields(req.body, EMPLOYEE_REQUIRED_FIELDS);
    if (error) return res.status(400).json({ error });

    const db = await connectToDatabase();
    const {
      first_name,
      last_name,
      email,
      phone,
      department_id,
      position_id,
      salary,
    } = req.body;

    await db.query(
      `UPDATE employees 
       SET first_name=?, last_name=?, email=?, phone=?, department_id=?, position_id=?, salary=?
       WHERE employee_id=?`,
      [
        first_name,
        last_name,
        email,
        phone,
        department_id,
        position_id,
        salary,
        id,
      ]
    );

    res.json({ message: "Employee updated successfully." });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ error: "Failed to update employee." });
  }
});

// Delete
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    await db.query("DELETE FROM employees WHERE employee_id=?", [id]);
    res.json({ message: "Employee deleted successfully." });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ error: "Failed to delete employee." });
  }
});

export default router;
