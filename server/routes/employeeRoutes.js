import { connectToDatabase } from "../lib/database.js";
import express from "express";

const router = express.Router();

// ================= Constants =================
const EMPLOYEE_REQUIRED_FIELDS = [
  "first_name",
  "last_name",
  "email",
  "phone",
  "department_id",
  "position_id",
  "salary",
];

// ================= Helper Functions =================
function validateFields(body, requiredFields) {
  for (const field of requiredFields) {
    if (!body[field]) return `${field} is required.`;
  }

  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return "Invalid email format.";
  }

  if (body.salary && isNaN(body.salary)) {
    return "Salary must be a number.";
  }

  return null;
}

// ================= Middleware =================
function validateEmployee(req, res, next) {
  const error = validateFields(req.body, EMPLOYEE_REQUIRED_FIELDS);
  if (error) return res.status(400).json({ message: error });
  next();
}

// ================= Routes =================

// GET all employees
router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT * FROM employees");
    res.status(200).json(rows);
  } catch (err) {
    console.error("[Fetch Employees Error]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// CREATE employee
router.post("/create", validateEmployee, async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    department_id,
    position_id,
    salary,
  } = req.body;

  try {
    const db = await connectToDatabase();
    await db.query(
      "INSERT INTO employees (first_name, last_name, email, phone, department_id, position_id, salary) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, email, phone, department_id, position_id, salary]
    );
    res.status(201).json({ message: "Employee created successfully." });
  } catch (err) {
    console.error("[Create Employee Error]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// UPDATE employee
router.put("/update/:id", validateEmployee, async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    email,
    phone,
    department_id,
    position_id,
    salary,
  } = req.body;

  try {
    const db = await connectToDatabase();
    const [result] = await db.query(
      "UPDATE employees SET first_name = ?, last_name = ?, email = ?, phone = ?, department_id = ?, position_id = ?, salary = ? WHERE id = ?",
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

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({ message: "Employee updated successfully." });
  } catch (err) {
    console.error("[Update Employee Error]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE employee
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const db = await connectToDatabase();
    const [result] = await db.query("DELETE FROM employees WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({ message: "Employee deleted successfully." });
  } catch (err) {
    console.error("[Delete Employee Error]", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
