import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Landmark, ShieldCheck, CheckCircle2 } from "lucide-react";

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left side: Premium Banking Branding - Hidden on mobile/tablet */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-slate-900 p-16 text-white relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        {/* Top: Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-lg">
            BL
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            BankLite
          </span>
        </div>

        {/* Middle: Content */}
        <div className="space-y-6 max-w-lg relative z-10">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Institutional-Grade Loan Underwriting Engine.
          </h2>
          <p className="text-lg text-slate-300 font-medium">
            Empowering modern financial institutions with smart, secure, automated, and auditable lending workflows.
          </p>

          <div className="space-y-4 pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Automated Credit Analysis</h4>
                <p className="text-sm text-slate-400">Risk profiling and credit score evaluation calculated dynamically upon submission.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Full Underwriting Transparency</h4>
                <p className="text-sm text-slate-400">Comprehensive, tamper-proof activity logs for internal audit compliance.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold">Role-Segregated Environment</h4>
                <p className="text-sm text-slate-400">Strict cryptographically-signed access boundaries for customers and credit officers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Footer Info */}
        <div className="flex items-center gap-2 text-sm text-slate-400 relative z-10">
          <ShieldCheck className="h-5 w-5 text-indigo-400" />
          <span>AES-256 Encrypted Session Security. BankLite Corp © 2026.</span>
        </div>
      </div>

      {/* Right side: Login/Register Form container */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-xs">
          {/* Mobile Header Logo */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-base">
              BL
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              BankLite
            </span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
