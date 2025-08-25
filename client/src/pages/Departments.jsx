import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

const API = "http://localhost:3000/api/departments";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fields = [
    { name: "name", type: "text", placeholder: "Department Name" },
    { name: "description", type: "text", placeholder: "Description" },
  ];

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get(API);
      setDepartments(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  // Delete department
  const handleDelete = async (department_id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await axios.delete(`${API}/delete/${department_id}`);
      setDepartments(departments.filter((d) => d.department_id !== department_id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete department");
    }
  };

  // Add department
  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));

    try {
      await axios.post(`${API}/create`, formData);
      setShowAddModal(false);
      fetchDepartments();
    } catch (err) {
      console.error(err);
      alert("Failed to add department");
    }
  };

  // Edit department
  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API}/update/${editData.department_id}`, editData);
      setEditData(null);
      fetchDepartments();
    } catch (err) {
      console.error(err);
      alert("Failed to update department");
    }
  };

  return (
    <DashboardLayout activePage="Departments">
      <section className="p-4 md:p-6 space-y-6">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-xl font-bold">Manage Departments</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Department
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
                  {["ID", "Name", "Description", "Created", "Updated", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-2 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <tr key={d.department_id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{d.department_id}</td>
                    <td className="px-4 py-2">{d.name}</td>
                    <td className="px-4 py-2">{d.description}</td>
                    <td className="px-4 py-2">{new Date(d.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2">{new Date(d.updated_at).toLocaleString()}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => setEditData({ ...d })}
                        className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.department_id)}
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
              <h3 className="text-lg font-semibold mb-4">Add Department</h3>
              <form onSubmit={handleAdd} className="space-y-3">
                {fields.map((f) => (
                  <input
                    key={f.name}
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    required={f.name === "name"}
                  />
                ))}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
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
              <h3 className="text-lg font-semibold mb-4">Edit Department</h3>
              <form onSubmit={handleEdit} className="space-y-3">
                {fields.map((f) => (
                  <input
                    key={f.name}
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={editData[f.name] || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, [f.name]: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    required={f.name === "name"}
                  />
                ))}
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
