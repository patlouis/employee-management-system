import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

const API = "http://localhost:3000/api/employees";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);

  const fields = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "department_id",
    "position_id",
    "salary",
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(API);
      setEmployees(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      setEmployees(employees.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee");
    }
  };

  // Add/Edit employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalData.id) {
        await axios.put(`${API}/${modalData.id}`, modalData);
      } else {
        await axios.post(API, modalData);
      }

      setModalData(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to save employee");
    }
  };

  return (
    <DashboardLayout activePage="Employees">
      <section className="p-4 md:p-6 space-y-6">

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-xl font-bold">Manage Employees</h2>
          <button
            onClick={() => setModalData({})}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
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
                  {["#", "Name", "Email", "Phone", "Dept", "Position", "Salary", "Actions"].map(
                    (h) => (
                      <th key={h} className="px-4 py-2 text-left">{h}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {employees.map((e, i) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{e.first_name} {e.last_name}</td>
                    <td className="px-4 py-2">{e.email}</td>
                    <td className="px-4 py-2">{e.phone}</td>
                    <td className="px-4 py-2">{e.department_id}</td>
                    <td className="px-4 py-2">{e.position_id}</td>
                    <td className="px-4 py-2">{e.salary}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => setModalData({ ...e })}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="p-1 rounded hover:bg-gray-100"
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

        {/* Add/Edit Modal */}
        {modalData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-3">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                {modalData.id ? "Edit" : "Add"} Employee
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                {fields.map((f) => (
                  <input
                    key={f}
                    type={f === "email" ? "email" : "text"}
                    placeholder={f.replace("_", " ").toUpperCase()}
                    value={modalData[f] || ""}
                    onChange={(e) =>
                      setModalData({ ...modalData, [f]: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    required
                  />
                ))}
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setModalData(null)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save
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
