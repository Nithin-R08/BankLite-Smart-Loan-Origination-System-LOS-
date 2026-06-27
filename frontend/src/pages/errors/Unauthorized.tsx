import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 text-center">
      <div className="space-y-6 max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-200 shadow-xs">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Access Level Denied
          </h1>
          <p className="text-sm font-semibold text-red-600 uppercase tracking-wider font-mono">
            Error Code 403: Forbidden Action
          </p>
          <p className="text-slate-500 font-medium">
            Your credentials do not possess the authorization level required to access this endpoint. Please verify your portal tier role.
          </p>
        </div>
        <div className="pt-4 flex flex-col gap-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back Previous
          </button>
          <button
            onClick={() => navigate("/select-role")}
            className="text-xs font-semibold text-slate-500 hover:text-slate-950 transition-colors"
          >
            Re-Authenticate Login Page
          </button>
        </div>
      </div>
    </div>
  );
};
export default Unauthorized;
