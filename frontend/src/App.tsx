import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// General Pages
import LandingPage from "./pages/LandingPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Customer Pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ApplyLoanPage from "./pages/customer/ApplyLoanPage";
import MyApplications from "./pages/customer/MyApplications";
import ProfilePage from "./pages/customer/ProfilePage";

// Officer Pages
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import ReviewApplicationPage from "./pages/officer/ReviewApplicationPage";
import AuditLogPage from "./pages/officer/AuditLogPage";
import AnalyticsPage from "./pages/officer/AnalyticsPage";

// Error Pages
import Unauthorized from "./pages/errors/Unauthorized";
import NotFound from "./pages/errors/NotFound";
import ServerError from "./pages/errors/ServerError";

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        {/* Toast notifications center */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1E293B",
              color: "#FFF",
              fontSize: "13px",
              borderRadius: "8px",
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#FFF",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#FFF",
              },
            },
          }}
        />

        <Routes>
          {/* Public Portal Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/select-role" element={<RoleSelectionPage />} />
          
          {/* Auth Layout Wrapper */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Customer Portal Guarded Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/apply" element={<ApplyLoanPage />} />
            <Route path="/customer/loans" element={<MyApplications />} />
            <Route path="/customer/profile" element={<ProfilePage />} />
          </Route>

          {/* Secure Credit Officer Guarded Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/officer/dashboard" element={<OfficerDashboard />} />
            <Route path="/officer/pending" element={<ReviewApplicationPage />} />
            <Route path="/officer/audit-logs" element={<AuditLogPage />} />
            <Route path="/officer/analytics" element={<AnalyticsPage />} />
          </Route>

          {/* Error and Redirection Handling */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
