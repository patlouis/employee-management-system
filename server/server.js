import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import departmentsRoutes from "./routes/departmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import positionRoutes from "./routes/positionRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

import { verifyToken } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Employee Management System!");
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", verifyToken, departmentsRoutes);
app.use("/api/positions", verifyToken, positionRoutes);
app.use("/api/projects", verifyToken, projectRoutes);
app.use("/api/users", verifyToken, userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
