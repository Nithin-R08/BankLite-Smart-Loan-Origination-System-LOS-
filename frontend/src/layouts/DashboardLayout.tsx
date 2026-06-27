import React, { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // If auth is loading, render a full screen loader page
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-semibold text-slate-600">Verifying session credentials...</p>
        </div>
      </div>
    );
  }

  // Route protection logic
  if (!isAuthenticated) {
    // Save the target path for post-login redirect
    return <Navigate to="/select-role" state={{ from: location }} replace />;
  }

  // Segregate paths based on roles
  const path = location.pathname;
  if (path.startsWith("/customer") && role !== "Customer") {
    return <Navigate to="/unauthorized" replace />;
  }
  
  if (path.startsWith("/officer") && role !== "Officer") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Responsive Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
