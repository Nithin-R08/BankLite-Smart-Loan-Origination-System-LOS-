import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  User,
  LogOut,
  FolderLock,
  LineChart,
  History,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, logout, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const customerLinks = [
    {
      label: "Dashboard",
      path: "/customer/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Apply for Loan",
      path: "/customer/apply",
      icon: FilePlus2,
    },
    {
      label: "My Applications",
      path: "/customer/loans",
      icon: FileText,
    },
    {
      label: "My Profile",
      path: "/customer/profile",
      icon: User,
    },
  ];

  const officerLinks = [
    {
      label: "Executive Stats",
      path: "/officer/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Pending Reviews",
      path: "/officer/pending",
      icon: FolderLock,
    },
    {
      label: "Audit Timeline",
      path: "/officer/audit-logs",
      icon: History,
    },
    {
      label: "Analytics Hub",
      path: "/officer/analytics",
      icon: LineChart,
    },
  ];

  const links = role === "Officer" ? officerLinks : customerLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-lg">
              BL
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              BankLite
            </span>
          </Link>
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-950 focus:outline-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* User Info Badge */}
        <div className="mx-4 my-4 rounded-xl bg-slate-50 p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-semibold uppercase">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <h4 className="truncate text-sm font-semibold text-slate-950">
                {user?.full_name || "Guest User"}
              </h4>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 mt-1">
                {role === "Officer" ? (
                  <>
                    <ShieldCheck className="h-3 w-3" />
                    Credit Officer
                  </>
                ) : (
                  "Customer"
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-4 py-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-500"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="border-t border-slate-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-5 w-5" />
            Logout Account
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
