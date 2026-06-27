import React, { useState, useEffect } from "react";
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
  AreaChart,
  Area,
} from "recharts";
import { BarChart3, TrendingUp, AlertTriangle, PieChart as PieIcon, LineChart as LineIcon } from "lucide-react";
import DashboardSkeleton from "../../components/SkeletonLoader";

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<OfficerStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await officerService.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load analytics datasets.");
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

  const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Risk & Underwriting Analytics
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Statistical dashboard visualizing loan distributions, acceptance rates, and credit risk grading.
        </p>
      </div>

      {/* Grid: 2 big charts per row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart 1: Area Chart for Approval Trends */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <LineIcon className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Underwriting Decisions Over Time
            </h3>
          </div>
          <div className="h-72 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#64748B" />
                <YAxis tickLine={false} axisLine={false} stroke="#64748B" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E293B", borderRadius: "8px", color: "#FFF", fontSize: "11px" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Area
                  type="monotone"
                  dataKey="approved"
                  name="Approved files"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorApproved)"
                />
                <Area
                  type="monotone"
                  dataKey="rejected"
                  name="Declined files"
                  stroke="#EF4444"
                  fillOpacity={1}
                  fill="url(#colorRejected)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Purpose Horizontal Bar Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <BarChart3 className="h-5 w-5 text-indigo-650" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Capital Distribution by Loan Purpose
            </h3>
          </div>
          <div className="h-72 text-xs">
            {stats && stats.purpose_distribution.length === 0 ? (
              <div className="flex h-full items-center justify-center italic text-slate-400">
                No active loans registered in database.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats?.purpose_distribution}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" tickLine={false} axisLine={false} stroke="#64748B" />
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} stroke="#64748B" width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1E293B", borderRadius: "8px", color: "#FFF", fontSize: "11px" }}
                  />
                  <Bar dataKey="amount" name="Capital Volume (₹)" fill="#4F46E5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 3: Risk Distribution Donut */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <PieIcon className="h-5 w-5 text-indigo-650" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Portfolio Credit Score Distribution
            </h3>
          </div>
          <div className="h-64 text-xs flex justify-center items-center">
            {stats && stats.risk_distribution.every((r) => r.value === 0) ? (
              <p className="italic text-slate-400">No credit scores filed.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.risk_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats?.risk_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1E293B", borderRadius: "8px", color: "#FFF", fontSize: "11px" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 4: Simple line showing application growth */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="h-5 w-5 text-indigo-650" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Application Intake Speed
            </h3>
          </div>
          <div className="h-64 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#64748B" />
                <YAxis tickLine={false} axisLine={false} stroke="#64748B" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E293B", borderRadius: "8px", color: "#FFF", fontSize: "11px" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="applications"
                  name="Volume Submitted"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsPage;
