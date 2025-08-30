import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/AdminDashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Users from './pages/Users';
import Positions from './pages/Positions';
import Projects from './pages/Projects';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard/employees" element={<Employees />} />
        <Route path="/dashboard/departments" element={<Departments />} />
        <Route path="/dashboard/users" element={<Users />} />
        <Route path="/dashboard/positions" element={<Positions />} />
        <Route path="/dashboard/projects" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
