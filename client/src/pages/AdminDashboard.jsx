import DashboardLayout from "../components/DashboardLayout";

export default function AdminDashboard() {
  return (
    <DashboardLayout activePage="Overview">
      {/* Dashboard Content */}
      <section className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="text-sm font-medium mb-1">Total Employees</h3>
            <p className="text-3xl font-semibold">1,284</p>
            <p className="text-xs text-gray-500 mt-1">+4.1% from last week</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="text-sm font-medium mb-1">Total Departments</h3>
            <p className="text-3xl font-semibold">41</p>
            <p className="text-xs text-gray-500 mt-1">-2.3% today</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <h3 className="text-sm font-medium mb-1">Errors</h3>
            <p className="text-3xl font-semibold">7</p>
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
