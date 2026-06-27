import React from "react";
import { useNavigate } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 text-center">
      <div className="space-y-6 max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-xs">
          <Compass className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Page Not Located
          </h1>
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider font-mono">
            Error Code 404: Route Missing
          </p>
          <p className="text-slate-500 font-medium">
            The target address does not exist or has been relocated to another sub-tree directory in the BankLite cluster.
          </p>
        </div>
        <div className="pt-4 flex flex-col gap-2">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Return Main Portal
          </button>
        </div>
      </div>
    </div>
  );
};
export default NotFound;
