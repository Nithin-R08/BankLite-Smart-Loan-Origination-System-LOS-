import React from "react";
import { useNavigate } from "react-router-dom";
import { User, ShieldAlert, ArrowRight, Landmark } from "lucide-react";

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectRole = (role: "Customer" | "Officer") => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
            <Landmark className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Welcome to BankLite
          </h2>
          <p className="text-slate-500 font-medium">
            Select your credential authority tier to access the loan origination environment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Customer Portal */}
          <div
            onClick={() => handleSelectRole("Customer")}
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-8 shadow-xs hover:border-indigo-600 hover:shadow-md transition-all duration-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <User className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              Customer Portal
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Submit loan applications, verify credit scores dynamically, track underwriting status updates, and update profile credentials.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:translate-x-1.5 transition-transform">
              Access Customer Login
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>

          {/* Card 2: Officer Portal */}
          <div
            onClick={() => handleSelectRole("Officer")}
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-8 shadow-xs hover:border-amber-600 hover:shadow-md transition-all duration-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Credit Officer Portal
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Conduct applicant underwriting audits, check credit risk parameters, approve/reject loans with mandatory commentary, and review macro dashboards.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-amber-600 group-hover:translate-x-1.5 transition-transform">
              Access Secure Officer Login
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};
export default RoleSelectionPage;
