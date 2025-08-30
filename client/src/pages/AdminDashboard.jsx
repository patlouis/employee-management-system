import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

export default function AdminDashboard() {
  const [totalEmployees, setTotalEmployees] = useState(null);
  const [totalDepartments, setTotalDepartments] = useState(null);
  const [totalPositions, setTotalPositions] = useState(null);
  const [totalProjects, setTotalProjects] = useState(null);

  useEffect(() => {
    async function fetchEmployeeCount() {
      try {
      const res = await axios.get("http://localhost:3000/api/employees/count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
        setTotalEmployees(res.data.total);
      } catch (err) {
        console.error("Error fetching employee count:", err);
      }
    }
    fetchEmployeeCount();
  }, []);

    useEffect(() => {
    async function fetchDepartmentCount() {
      try {
        const res = await axios.get("http://localhost:3000/api/departments/count", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTotalDepartments(res.data.total);
      } catch (err) {
        console.error("Error fetching department count:", err);
      }
    }
    fetchDepartmentCount();
  }, []);

    useEffect(() => {
    async function fetchPositionCount() {
      try {
        const res = await axios.get("http://localhost:3000/api/positions/count", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTotalPositions(res.data.total);
      } catch (err) {
        console.error("Error fetching position count:", err);
      }
    }
    fetchPositionCount();
  }, []);

    useEffect(() => {
    async function fetchProjectCount() {
      try {
        const res = await axios.get("http://localhost:3000/api/projects/count", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTotalProjects(res.data.total);
      } catch (err) {
        console.error("Error fetching project count:", err);
      }
    }
    fetchProjectCount();
  }, []);

  return (
    <DashboardLayout activePage="Overview">
      {/* Dashboard Content */}
      <section className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="text-sm font-medium mb-1">Total Employees</h3>
            <p className="text-3xl font-semibold">
              {totalEmployees !== null ? totalEmployees : "Loading..."}
            </p>
            <p className="text-xs text-gray-500 mt-1">+4.1% from last week</p>
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="text-sm font-medium mb-1">Total Departments</h3>
            <p className="text-3xl font-semibold">
              {totalDepartments !== null ? totalDepartments : "Loading..."}
            </p>
            <p className="text-xs text-gray-500 mt-1">-2.3% today</p>
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="text-sm font-medium mb-1">Total Positions</h3>
            <p className="text-3xl font-semibold">
              {totalPositions !== null ? totalPositions : "Loading..."}
            </p>
            <p className="text-xs text-gray-500 mt-1">0 critical</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="text-sm font-medium mb-1">Total Projects</h3>
            <p className="text-3xl font-semibold">
              {totalProjects !== null ? totalProjects : "Loading..."}
            </p>
            <p className="text-xs text-gray-500 mt-1">0 critical</p>
          </div>
        </div>

        {/* Welcome / Placeholder */}
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-base font-semibold mb-2">Welcome to your dashboard</h3>
          <p className="text-sm text-gray-600">
            This is a placeholder content area. Replace with your charts, tables, or any modules for the selected section.
          </p>
        </div>
      </section>
    </DashboardLayout>
  );
}
