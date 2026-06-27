import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loanService } from "../../services/loans";
import type { CustomerStats, LoanApplication } from "../../types";
import { toast } from "react-hot-toast";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Search,
} from "lucide-react";
import DashboardSkeleton from "../../components/SkeletonLoader";

export const CustomerDashboard: React.FC = () => {
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await loanService.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Filter recent applications based on search query locally
  const filteredRecent = stats?.recent_applications.filter((loan) =>
    loan.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Institutional Funding Desk
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Review your outstanding loan applications or request a new credit underwriting file.
          </p>
        </div>
        <Link
          to="/customer/apply"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-xs"
        >
          <Plus className="h-4.5 w-4.5" />
          Request Credit Line
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Files</span>
            <p className="text-3xl font-extrabold text-slate-900 leading-none">{stats?.total || 0}</p>
            <p className="text-xs font-semibold text-slate-500">Submitted to registry</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2: Pending */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Analysis</span>
            <p className="text-3xl font-extrabold text-slate-900 leading-none">{stats?.pending || 0}</p>
            <p className="text-xs font-semibold text-amber-600">Awaiting officer review</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3: Approved */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credit Approved</span>
            <p className="text-3xl font-extrabold text-slate-900 leading-none">{stats?.approved || 0}</p>
            <p className="text-xs font-semibold text-emerald-600">Ready for origination</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 4: Rejected */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Declined Files</span>
            <p className="text-3xl font-extrabold text-slate-900 leading-none">{stats?.rejected || 0}</p>
            <p className="text-xs font-semibold text-red-600">Risk boundaries exceeded</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-100">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: List + Scoring Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Applications Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Recent Application Registry
            </h3>
            
            {/* Search */}
            <div className="relative max-w-xs">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-1.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          {filteredRecent.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FileText className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">No applications located</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {searchQuery ? "No loans match your search parameters." : "You have not submitted any credit requests to the registry."}
                </p>
              </div>
              {!searchQuery && (
                <Link
                  to="/customer/apply"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  Create Application File
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Requested File</th>
                      <th className="px-6 py-4">Credit Score</th>
                      <th className="px-6 py-4">Decision Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredRecent.map((loan) => (
                      <tr key={loan.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-semibold text-slate-900">#{loan.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-950">₹{loan.loan_amount.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">{loan.purpose}</p>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-700">
                          {loan.credit_score}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusStyle(loan.status)}`}>
                            {loan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate("/customer/loans")}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                          >
                            Details
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Scoring & Policy Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Lending Policy Rules
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              BankLite loan applications are verified under strict compliance regulations.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                1
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-slate-800">Dynamic Score Verification</h5>
                <p className="text-2xs text-slate-500 leading-relaxed">
                  Upon submission, the credit scoring engine checks major credit reference databases (automated score generated: 300 to 850).
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                2
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-slate-800">Underwriter Assignment</h5>
                <p className="text-2xs text-slate-500 leading-relaxed">
                  Applications are automatically routed to a Credit Officer for validation of income declarations, employment, and debt thresholds.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                3
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-slate-800">Origination Approval</h5>
                <p className="text-2xs text-slate-500 leading-relaxed">
                  Approved loan files are immediately cleared for origination. Underwriter comments and audit logs will be permanently archived.
                </p>
              </div>
            </div>
          </div>

          {/* Underwriting Alert */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-150 flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-slate-900">Interest Forecasts</h5>
              <p className="text-2xs text-slate-500 leading-relaxed">
                Credit scores above 740 automatically qualify for tier-1 base rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerDashboard;
