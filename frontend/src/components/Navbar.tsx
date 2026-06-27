import React from "react";
import { Menu, Bell, Search, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout, role } = useAuth();
  const location = useLocation();

  // Create simple dynamic breadcrumbs based on pathname
  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    if (path.includes("/customer/dashboard")) return "Dashboard Overview";
    if (path.includes("/customer/apply")) return "Submit Loan Application";
    if (path.includes("/customer/loans")) return "Loan Application History";
    if (path.includes("/customer/profile")) return "Account Profile Settings";
    if (path.includes("/officer/dashboard")) return "Executive Management Dashboard";
    if (path.includes("/officer/pending")) return "Pending Underwriting Reviews";
    if (path.includes("/officer/application")) return "Application Deep Underwriting";
    if (path.includes("/officer/audit-logs")) return "Enterprise Audit Logs";
    if (path.includes("/officer/analytics")) return "Risk & Underwriting Analytics";
    return "BankLite Banking System";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            {getBreadcrumbTitle()}
          </h1>
        </div>
      </div>

      {/* Right side: Search + Notification + Profile dropdown */}
      <div className="flex items-center gap-4">
        {/* Security badge for officers */}
        {role === "Officer" && (
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
            <Shield className="h-3.5 w-3.5" />
            Secure Session
          </span>
        )}

        {/* Notifications Mock Trigger */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-2 ring-white"></span>
        </button>

        {/* User profile button / link */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {user?.full_name}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              {user?.email}
            </p>
          </div>
          <Link
            to={role === "Officer" ? "#" : "/customer/profile"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold hover:ring-2 hover:ring-indigo-600 hover:ring-offset-2 transition-all"
          >
            {user?.full_name?.charAt(0).toUpperCase() || "U"}
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
