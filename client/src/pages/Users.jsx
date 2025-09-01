import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

const API = "http://localhost:3000/api/users";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // Sorting state
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState(null);

  const fields = ["first_name", "last_name", "email", "password"];

  useEffect(() => {
    fetchUsers();
  }, [sortBy, order]);

  const fetchUsers = async () => {
    try {
      const params = sortBy ? { sortBy, order } : {};
      const { data } = await axios.get(API, {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user_id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API}/delete/${user_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers((prev) => prev.filter((u) => u.user_id !== user_id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
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
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/update/${editData.user_id}`, editData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEditData(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) {
      return <ArrowUp className="w-4 h-4 opacity-0 inline ml-1" />;
    }
    return order === "asc" ? (
      <ArrowUp className="w-4 h-4 text-gray-600 inline ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 text-gray-600 inline ml-1" />
    );
  };

  return (
    <DashboardLayout activePage="Users">
      <section className="p-4 md:p-6 space-y-6">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-xl font-bold">Manage Users</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-800 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add User
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
                    { key: "user_id", label: "ID" },
                    { key: "name", label: "Name" },
                    { key: "email", label: "Email" },
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
                {users.map((u) => (
                  <tr
                    key={u.user_id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{u.user_id}</td>
                    <td className="px-4 py-2">{u.last_name}, {u.first_name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">
                      {new Date(u.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(u.updated_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => setEditData({ ...u })}
                        className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.user_id)}
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
              <h3 className="text-lg font-semibold mb-4">Add User</h3>
              <form onSubmit={handleAdd} className="space-y-3">
                {fields.map((f) => (
                  <input
                    key={f}
                    name={f}
                    type={
                      f === "email"
                        ? "email"
                        : f === "password"
                        ? "password"
                        : "text"
                    }
                    placeholder={f.replace("_", " ").toUpperCase()}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    required
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
              <h3 className="text-lg font-semibold mb-4">Edit User</h3>
              <form onSubmit={handleEdit} className="space-y-3">
                {fields.map((f) => (
                  <input
                    key={f}
                    type={
                      f === "email"
                        ? "email"
                        : f === "password"
                        ? "password"
                        : "text"
                    }
                    placeholder={f.replace("_", " ").toUpperCase()}
                    value={editData[f] || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, [f]: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    required
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
