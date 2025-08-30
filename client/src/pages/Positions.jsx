import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import dayjs from "dayjs";

const API = "http://localhost:3000/api/positions";
const DEPT_API = "http://localhost:3000/api/departments";

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchPositions();
    fetchDepartments();
  }, []);

  const fetchPositions = async () => {
    try {
      const { data } = await axios.get(API, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPositions(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch positions");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get(DEPT_API, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDepartments(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch departments");
    }
  };

  const handleDelete = async (position_id) => {
    if (!window.confirm("Delete this position?")) return;
    try {
      await axios.delete(`${API}/delete/${position_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPositions(positions.filter((p) => p.position_id !== position_id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete position");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    try {
      await axios.post(`${API}/create`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowAddModal(false);
      fetchPositions();
    } catch (err) {
      console.error(err);
      alert("Failed to add position");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/update/${editData.position_id}`, editData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEditData(null);
      fetchPositions();
    } catch (err) {
      console.error(err);
      alert("Failed to update position");
    }
  };

  return (
    <DashboardLayout activePage="Positions">
      <section className="p-4 md:p-6 space-y-6">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-xl font-bold">Manage Positions</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Position
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
                  {[
                    "ID",
                    "Title",
                    "Description",
                    "Department",
                    "Created At",
                    "Updated At",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="px-4 py-2 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {positions.map((p) => (
                  <tr key={p.position_id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{p.position_id}</td>
                    <td className="px-4 py-2">{p.title}</td>
                    <td className="px-4 py-2">{p.description || "—"}</td>
                    <td className="px-4 py-2">{p.department_name || "—"}</td>
                    <td className="px-4 py-2">
                      {p.created_at
                        ? dayjs(p.created_at).format("YYYY-MM-DD HH:mm")
                        : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {p.updated_at
                        ? dayjs(p.updated_at).format("YYYY-MM-DD HH:mm")
                        : "—"}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => setEditData({ ...p })}
                        className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.position_id)}
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
              <h3 className="text-lg font-semibold mb-4">Add Position</h3>
              <form onSubmit={handleAdd} className="space-y-3">
                <input
                  name="title"
                  type="text"
                  placeholder="TITLE"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
                <input
                  name="description"
                  type="text"
                  placeholder="DESCRIPTION"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
                {/* ✅ Dropdown for Department */}
                <select
                  name="department_id"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.name}
                    </option>
                  ))}
                </select>
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
              <h3 className="text-lg font-semibold mb-4">Edit Position</h3>
              <form onSubmit={handleEdit} className="space-y-3">
                <input
                  type="text"
                  placeholder="TITLE"
                  value={editData.title || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
                <input
                  type="text"
                  placeholder="DESCRIPTION"
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
                <select
                  value={editData.department_id || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, department_id: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.name}
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
