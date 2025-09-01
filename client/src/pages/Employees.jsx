import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

const API = "http://localhost:3000/api/employees";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedDept, setSelectedDept] = useState("");

  const fields = ["first_name", "last_name", "email", "phone", "salary"];

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchPositions();
  }, []);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(API, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployees(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/departments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDepartments(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch departments");
    }
  };

  // Fetch positions
  const fetchPositions = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/positions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPositions(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch positions");
    }
  };

  // Delete
  const handleDelete = async (employee_id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await axios.delete(`${API}/delete/${employee_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployees(employees.filter((e) => e.employee_id !== employee_id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee");
    }
  };

  // Add
  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));

    try {
      await axios.post(`${API}/create`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowAddModal(false);
      setSelectedDept("");
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to add employee");
    }
  };

  // Edit
  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = { ...editData };

    try {
      await axios.put(`${API}/update/${editData.employee_id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEditData(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to update employee");
    }
  };

  return (
    <DashboardLayout activePage="Employees">
      <section className="p-4 md:p-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-xl font-bold">Manage Employees</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {["ID", "Name", "Email", "Phone", "Dept", "Position", "Salary", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.employee_id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-2">{e.employee_id}</td>
                    <td className="px-4 py-2">{e.first_name} {e.last_name}</td>
                    <td className="px-4 py-2">{e.email}</td>
                    <td className="px-4 py-2">{e.phone}</td>
                    <td className="px-4 py-2">{e.department}</td>
                    <td className="px-4 py-2">{e.position}</td>
                    <td className="px-4 py-2">{e.salary}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => setEditData({ ...e })}
                        className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(e.employee_id)}
                        className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-3">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Add Employee</h3>
              <form onSubmit={handleAdd} className="space-y-3">
                {fields.map((f) => (
                  <input
                    key={f}
                    name={f}
                    type={f === "email" ? "email" : "text"}
                    placeholder={f.replace("_", " ").toUpperCase()}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                ))}

                {/* Department dropdown */}
                <select
                  name="department_id"
                  className="w-full border rounded px-3 py-2"
                  required
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                {/* Filtered Positions */}
                <select name="position_id" disabled={!selectedDept} className="w-full border rounded px-3 py-2 disabled:bg-gray-100" required>
                  <option value="">Select Position</option>
                  {positions
                    .filter((p) => p.department_id === parseInt(selectedDept))
                    .map((p) => (
                      <option key={p.position_id} value={p.position_id}>
                        {p.title}
                      </option>
                    ))}
                </select>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedDept("");
                    }}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-3">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Edit Employee</h3>
              <form onSubmit={handleEdit} className="space-y-3">
                {fields.map((f) => (
                  <input
                    key={f}
                    type={f === "email" ? "email" : "text"}
                    placeholder={f.replace("_", " ").toUpperCase()}
                    value={editData[f] || ""}
                    onChange={(e) => setEditData({ ...editData, [f]: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                ))}

                {/* Department dropdown */}
                <select
                  value={editData.department_id || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      department_id: parseInt(e.target.value),
                      position_id: "",
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                {/* Filtered Positions */}
                <select
                  value={editData.position_id || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, position_id: parseInt(e.target.value) })
                  }
                  disabled={!editData.department_id}
                  className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                  required
                >
                  <option value="">Select Position</option>
                  {positions
                    .filter((p) => p.department_id === editData.department_id)
                    .map((p) => (
                      <option key={p.position_id} value={p.position_id}>
                        {p.title}
                      </option>
                    ))}
                </select>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setEditData(null)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
