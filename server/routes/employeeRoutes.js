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

// Get all employees with optional sorting
router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { sortBy, order } = req.query;

    const allowedSortMap = {
      employee_id: "e.employee_id",
      first_name: "e.first_name",
      last_name: "e.last_name",
      email: "e.email",
      phone: "e.phone",
      salary: "e.salary",
      department: "d.name",
      position: "p.title",
      name: "name", // handled separately
    };

    let sql = `
      SELECT e.employee_id, e.first_name, e.last_name, e.email, e.phone,
             e.salary, e.department_id, e.position_id,
             d.name AS department, p.title AS position
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.department_id
      LEFT JOIN positions p ON e.position_id = p.position_id
    `;

    if (sortBy && allowedSortMap[sortBy]) {
      const ord = order && order.toLowerCase() === "desc" ? "DESC" : "ASC";

      if (sortBy === "name") {
        sql += ` ORDER BY e.last_name ${ord}, e.first_name ${ord}`;
      } else {
        sql += ` ORDER BY ${allowedSortMap[sortBy]} ${ord}`;
      }
    }

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Failed to fetch employees." });
  }
});

// Count employees
router.get("/count", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM employees");
    res.json({ total: rows[0].total });
  } catch (err) {
    console.error("Error counting employees:", err);
    res.status(500).json({ error: "Failed to fetch employee count" });
  }
});

// Create employee
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

// Update employee
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

// Delete employee
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
