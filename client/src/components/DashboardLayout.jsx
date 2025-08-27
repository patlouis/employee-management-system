import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  Layers,
  FolderKanban,
  ShieldCheck,
  Briefcase, 
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Employees", icon: Users, to: "/dashboard/employees" },
  { label: "Departments", icon: Layers, to: "/dashboard/departments" },
  { label: "Positions", icon: Briefcase, to: "/dashboard/positions" },
  { label: "Projects", icon: FolderKanban, to: "/dashboard/projects" },
  { label: "Users", icon: ShieldCheck, to: "/dashboard/users" },
  { label: "Settings", icon: Settings, to: "/dashboard/settings" },
];

export default function DashboardLayout({ activePage, children }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(activePage || "Overview");
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col border-r bg-white shadow-sm">
        <div className="px-5 pt-6 pb-4 flex items-center gap-3">
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
        </div>
        <nav className="px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setActive(label)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 ${
                active === label ? "bg-gray-100 font-medium" : ""
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <header className="md:hidden sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="h-14 px-3 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">Admin Panel</span>
          </div>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative z-10 h-full w-72 max-w-[86%] border-r bg-white p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <LayoutDashboard className="w-6 h-6 text-blue-600" />
              <h1 className="text-base font-semibold">Admin Panel</h1>
            </div>
            <nav className="space-y-1 overflow-y-auto">
              {navItems.map(({ label, icon: Icon, to }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => {
                    setActive(label);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 ${
                    active === label ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="md:pl-64">
        {/* Topbar (desktop) */}
        <div className="hidden md:flex sticky top-0 z-30 h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-md hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gray-200 grid place-items-center font-semibold text-gray-600">
                AD
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-400">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        {children}
      </main>
    </div>
  );
}
