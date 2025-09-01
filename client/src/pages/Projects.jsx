import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import dayjs from "dayjs";

const API = "http://localhost:3000/api/projects";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // Sorting state
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState(null);

  const STATUS_OPTIONS = ["Planned", "In Progress", "On Hold", "Completed", "Cancelled"];

  useEffect(() => {
    fetchProjects();
    fetchDepartments();
  }, [sortBy, order]);

  const fetchProjects = async () => {
    try {
      const params = sortBy ? { sortBy, order } : {};
      const { data } = await axios.get(API, {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProjects(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/departments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDepartments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (project_id) => {
    if (!window.confirm("Delete this project?")) return;
    setProjects((prev) => prev.filter((p) => p.project_id !== project_id));
    try {
      await axios.delete(`${API}/delete/${project_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
      fetchProjects();
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
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to add project");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/update/${editData.project_id}`, editData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEditData(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to update project");
    }
  };

  // Sorting handlers
  const handleSort = (column) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) return <ArrowUp className="w-4 h-4 opacity-0 inline ml-1" />;
    return order === "asc" ? (
      <ArrowUp className="w-4 h-4 text-gray-600 inline ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 text-gray-600 inline ml-1" />
    );
  };

  return (
    <DashboardLayout activePage="Projects">
      <section className="p-4 md:p-6 space-y-6">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-xl font-bold">Manage Projects</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Project
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
                    { key: "project_id", label: "ID" },
                    { key: "title", label: "Title" },
                    { key: "department_name", label: "Department" },
                    { key: "description", label: "Description" },
                    { key: "status", label: "Status" },
                    { key: "created_at", label: "Created" },
                    { key: "updated_at", label: "Updated" },
                    { key: "actions", label: "Actions", sortable: false },
                  ].map((h) => (
                    <th
                      key={h.key}
                      className={`px-4 py-2 text-left font-bold ${
                        h.sortable === false
                          ? ""
                          : "cursor-pointer hover:bg-gray-200 transition select-none"
                      }`}
                      onClick={() => h.sortable !== false && handleSort(h.key)}
                    >
                      <div className="flex items-center">
                        {h.label}
                        {h.sortable !== false && renderSortIcon(h.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {projects.map((p) => (
                  <tr key={p.project_id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-2">{p.project_id}</td>
                    <td className="px-4 py-2">{p.title}</td>
                    <td className="px-4 py-2">{p.department_name || "—"}</td>
                    <td className="px-4 py-2">{p.description}</td>
                    <td className="px-4 py-2">{p.status}</td>
                    <td className="px-4 py-2">{dayjs(p.created_at).format("YYYY-MM-DD HH:mm")}</td>
                    <td className="px-4 py-2">{dayjs(p.updated_at).format("YYYY-MM-DD HH:mm")}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => setEditData({ ...p })}
                        className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.project_id)}
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
              <h3 className="text-lg font-semibold mb-4">Add Project</h3>
              <form onSubmit={handleAdd} className="space-y-3">
                <input
                  name="title"
                  type="text"
                  placeholder="Project Title"
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <select
                  name="department_id"
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
                <textarea
                  name="description"
                  placeholder="Description"
                  className="w-full border rounded px-3 py-2"
                />
                <select
                  name="status"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  required
                >
                  <option value="">Select Status</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
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
              <h3 className="text-lg font-semibold mb-4">Edit Project</h3>
              <form onSubmit={handleEdit} className="space-y-3">
                <input
                  name="title"
                  type="text"
                  placeholder="Project Title"
                  value={editData.title || ""}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={editData.description || ""}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
                <select
                  value={editData.status || ""}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                  required
                >
                  <option value="">Select Status</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
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
