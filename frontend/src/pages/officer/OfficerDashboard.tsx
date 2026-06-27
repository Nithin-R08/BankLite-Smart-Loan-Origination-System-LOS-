import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { officerService } from "../../services/officer";
import type { OfficerStats } from "../../types";
import { toast } from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ShieldCheck,
  Calendar,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  Download,
} from "lucide-react";
import DashboardSkeleton from "../../components/SkeletonLoader";

export const OfficerDashboard: React.FC = () => {
  const [stats, setStats] = useState<OfficerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await officerService.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load officer statistics.");
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

  // Pre-configured colors for charts
  const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const handleExportCSV = () => {
    if (!stats || stats.recent_activities.length === 0) {
      toast.error("No activity data available to export.");
      return;
    }
    
    // Create CSV header & rows
    const headers = ["Activity ID", "Officer Name", "Action Taken", "Loan ID", "Volume (₹)", "Comments", "Timestamp"];
    const rows = stats.recent_activities.map((act) => [
      act.id,
      act.officer_name,
      act.action,
      act.loan_id,
      act.amount,
      `"${act.comments || ""}"`,
      act.timestamp,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `banklite_activity_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Activity log CSV file downloaded!");
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Credit Underwriting Console
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-3xs font-extrabold text-indigo-700 border border-indigo-200">
              Tier-1 Security Active
            </span>
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Monitor institutional portfolio health, perform risk matrices audits, and manage underwriting queues.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-350 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
          >
            <Download className="h-4 w-4" />
            Export CSV Log
          </button>
          <Link
            to="/officer/pending"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-xs"
          >
            <FolderOpen className="h-4 w-4" />
            Launch Queue ({stats?.pending_reviews || 0})
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Metric 1: Pending Queue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Pending Review</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats?.pending_reviews || 0}</p>
          <span className="text-3xs font-bold text-amber-600 mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Urgent underwriting files
          </span>
        </div>

        {/* Metric 2: Today Approvals */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Today's Approvals</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats?.today_approvals || 0}</p>
          <span className="text-3xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Origination ready files
          </span>
        </div>

        {/* Metric 3: Today Rejections */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Today's Rejections</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats?.today_rejections || 0}</p>
          <span className="text-3xs font-bold text-red-600 mt-1 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Risk limits exceeded
          </span>
        </div>

        {/* Metric 4: Average Score */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Avg Credit Score</span>
          <p className="text-2xl font-black text-slate-950 font-mono mt-2">{stats?.average_credit_score || 0}</p>
          <span className="text-3xs font-bold text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Portfolio mean credit
          </span>
        </div>

        {/* Metric 5: Approval Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Approval Ratio</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats?.approval_rate || 0}%</p>
          <span className="text-3xs font-bold text-indigo-600 mt-1 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> System acceptance rate
          </span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Chart 1: Application Trends (Monthly) */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs md:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Monthly Applications & Decisions
            </h3>
            <span className="text-3xs text-slate-400 font-semibold uppercase">Rolling 6 Months</span>
          </div>
          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#64748B" />
                <YAxis tickLine={false} axisLine={false} stroke="#64748B" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E293B", borderRadius: "8px", color: "#FFF", fontSize: "11px" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="applications" name="Submitted Files" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Approved" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" name="Declined" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Risk Profile Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Portfolio Credit Risk Class
            </h3>
            <span className="text-3xs text-slate-400 font-semibold uppercase font-mono">Dynamic Analysis</span>
          </div>
          <div className="h-44 text-xs flex justify-center items-center">
            {stats && stats.risk_distribution.every((r) => r.value === 0) ? (
              <p className="text-xs text-slate-450 italic">No credit score metrics registered.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.risk_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {stats?.risk_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1E293B", borderRadius: "8px", color: "#FFF", fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="space-y-2">
            {stats?.risk_distribution.map((risk) => (
              <div key={risk.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: risk.color }}></span>
                  <span className="font-semibold text-slate-600">{risk.name}</span>
                </div>
                <span className="font-bold text-slate-900">{risk.value} files</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Underwriter Activity Ledger */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Institutional Audit Feed
          </h3>
          <Link
            to="/officer/audit-logs"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            Review Full Audits Ledger
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {stats?.recent_activities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-350 bg-white p-12 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <p className="text-xs text-slate-500 font-medium italic">
              No recent underwriting decisions have been logged.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Underwriting Officer</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Loan File Target</th>
                    <th className="px-6 py-4">Decision Comments</th>
                    <th className="px-6 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {stats?.recent_activities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900">#{act.id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{act.officer_name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-2xs font-semibold ${
                            act.action === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                              : "bg-red-50 text-red-700 border-red-250"
                          }`}
                        >
                          {act.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-950">₹{act.amount.toLocaleString()}</p>
                        <p className="text-2xs text-slate-500 font-mono">Loan_ID: #{act.loan_id}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-650 max-w-xs truncate">
                        {act.comments || "-"}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(act.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default OfficerDashboard;
