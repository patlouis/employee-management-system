import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Users from './pages/Users';

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
      </Routes>
    </BrowserRouter>
  )
}

export default App
