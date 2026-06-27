import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertOctagon, RefreshCw } from "lucide-react";

export const ServerError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 text-center">
      <div className="space-y-6 max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-xs">
          <AlertOctagon className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Internal Connection Fault
          </h1>
          <p className="text-sm font-semibold text-amber-600 uppercase tracking-wider font-mono">
            Error Code 500: Server Failure
          </p>
          <p className="text-slate-500 font-medium">
            The BankLite cluster encountered an unexpected crash while executing the request. Try reloading the viewport.
          </p>
        </div>
        <div className="pt-4 flex flex-col gap-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Session
          </button>
        </div>
      </div>
    </div>
  );
};
export default ServerError;
