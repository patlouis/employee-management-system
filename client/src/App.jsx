import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Users from "./pages/Users";
import Positions from "./pages/Positions";
import Projects from "./pages/Projects";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes (only guests allowed) */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected routes (must have valid token) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/dashboard/employees" element={<Employees />} />
            <Route path="/dashboard/departments" element={<Departments />} />
            <Route path="/dashboard/users" element={<Users />} />
            <Route path="/dashboard/positions" element={<Positions />} />
            <Route path="/dashboard/projects" element={<Projects />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
