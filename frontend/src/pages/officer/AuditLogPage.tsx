import React, { useState, useEffect } from "react";
import { officerService } from "../../services/officer";
import type { AuditLog } from "../../types";
import { toast } from "react-hot-toast";
import { Search, History, ChevronLeft, ChevronRight, AlertCircle, FileSpreadsheet } from "lucide-react";
import { TableSkeleton } from "../../components/SkeletonLoader";

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 15;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * limit;
      const res = await officerService.getAuditLogs({
        skip,
        limit,
      });

      if (res.success && res.data) {
        setLogs(res.data.audit_logs);
        setTotal(res.data.total);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  // Filter logs locally based on search (officer name, customer name, loan ID) and action
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.officer?.full_name.toLowerCase().includes(search.toLowerCase()) ||
      log.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      String(log.loan_id).includes(search);
      
    const matchesAction =
      actionFilter === "All" || log.action.toLowerCase() === actionFilter.toLowerCase();

    return matchesSearch && matchesAction;
  });

  const getActionStyle = (action: string) => {
    switch (action) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      toast.error("No log entries match the filters to export.");
      return;
    }
    const headers = ["Log ID", "Officer Name", "Officer Email", "Loan ID", "Customer Target", "Loan Volume (₹)", "Compliance Action", "Comments", "Timestamp"];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.officer?.full_name || "Unknown",
      log.officer?.email || "Unknown",
      log.loan_id,
      log.customer_name || "Unknown",
      log.loan_amount || 0.0,
      log.action,
      `"${log.comments || ""}"`,
      log.created_at,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `banklite_audit_compliance_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit compliance CSV ledger downloaded successfully!");
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Institutional Audit Ledger
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Permanent, read-only transaction timeline recording all credit officer underwriting actions.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-350 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export Ledger CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white border border-slate-200 p-4 rounded-xl items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by officer name, customer, or loan ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs outline-none focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650"
          />
        </div>

        {/* Action Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-450 uppercase">Filter Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          >
            <option value="All">All Actions</option>
            <option value="Approved">Approved Decisions</option>
            <option value="Rejected">Rejected Decisions</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : filteredLogs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-350 bg-white p-16 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">No log entries matched your filter parameters.</h4>
            <p className="text-xs text-slate-500 mt-1">Try broadening your keyword search.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Audit ID</th>
                    <th className="px-6 py-4">Underwriting Officer</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Target File Details</th>
                    <th className="px-6 py-4">Mandatory Compliance Comments</th>
                    <th className="px-6 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">#{log.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-950">{log.officer?.full_name}</p>
                        <p className="text-xs text-slate-500">{log.officer?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-2xs font-semibold ${getActionStyle(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-950">₹{log.loan_amount?.toLocaleString()}</p>
                        <p className="text-2xs text-slate-500">Applicant: {log.customer_name} · ID: #{log.loan_id}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 max-w-sm leading-relaxed">
                        {log.comments || "-"}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white border border-slate-200 px-6 py-4 rounded-xl text-sm">
            <span className="text-slate-500 font-semibold">
              Showing <span className="text-slate-800">{(page - 1) * limit + 1}</span> to{" "}
              <span className="text-slate-800">{Math.min(page * limit, total)}</span> of{" "}
              <span className="text-slate-800">{total}</span> total audits
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AuditLogPage;
