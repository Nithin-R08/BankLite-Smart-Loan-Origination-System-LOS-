import React, { useState, useEffect } from "react";
import { loanService } from "../../services/loans";
import type { LoanApplication } from "../../types";
import { toast } from "react-hot-toast";
import { Search, Filter, Calendar, ChevronLeft, ChevronRight, Eye, AlertCircle } from "lucide-react";
import Modal from "../../components/Modal";
import { TableSkeleton } from "../../components/SkeletonLoader";

export const MyApplications: React.FC = () => {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * limit;
      const res = await loanService.getLoans({
        search: search || undefined,
        status_filter: statusFilter === "All" ? undefined : statusFilter,
        skip,
        limit,
      });

      if (res.success && res.data) {
        setLoans(res.data.loans);
        setTotal(res.data.total);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load loan applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset to page 1 on filter/search change
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchLoans();
  }, [page, search, statusFilter]);

  const handleViewDetails = (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setDetailsOpen(true);
  };

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

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Application History Log
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Comprehensive ledger of all files submitted under your credentials.
        </p>
      </div>

      {/* Filters Card */}
      <div className="flex flex-col md:flex-row gap-4 bg-white border border-slate-200 p-4 rounded-xl items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs outline-none focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex rounded-lg border border-slate-200 p-1 bg-slate-50 text-xs w-full justify-between">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-md px-3 py-1.5 font-bold transition-all ${
                  statusFilter === status
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : loans.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-350 bg-white p-16 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">No matching applications located</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
              Adjust your search keywords or filter queries.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Request Details</th>
                    <th className="px-6 py-4">Income Declaration</th>
                    <th className="px-6 py-4">Credit Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Submission Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900">#{loan.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-950">₹{loan.loan_amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">{loan.purpose} · {loan.loan_duration} Months</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">₹{loan.monthly_income.toLocaleString()}/mo</p>
                        <p className="text-xs text-slate-500">{loan.employment_type}</p>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-700">
                        {loan.credit_score}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusStyle(loan.status)}`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(loan.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewDetails(loan)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between bg-white border border-slate-200 px-6 py-4 rounded-xl text-sm">
            <span className="text-slate-500 font-semibold">
              Showing <span className="text-slate-800">{(page - 1) * limit + 1}</span> to{" "}
              <span className="text-slate-800">{Math.min(page * limit, total)}</span> of{" "}
              <span className="text-slate-800">{total}</span> files
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={`Underwriting File Details — #${selectedLoan?.id}`}
        footer={
          <button
            onClick={() => setDetailsOpen(false)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
          >
            Close Panel
          </button>
        }
        size="lg"
      >
        {selectedLoan && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Requested Loan Volume</span>
                <p className="text-2xl font-black text-slate-900">₹{selectedLoan.loan_amount.toLocaleString()}</p>
                <p className="text-xs text-slate-500 font-medium">{selectedLoan.purpose}</p>
              </div>

              <div className="space-y-1.5 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Dynamic Risk Score</span>
                <p className="text-2xl font-black text-slate-950 font-mono">{selectedLoan.credit_score}</p>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-2xs font-semibold ${getStatusStyle(selectedLoan.status)}`}>
                  {selectedLoan.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Financial Disclosures</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-400 uppercase">Employment Status</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedLoan.employment_type}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-400 uppercase">Monthly Declarations</p>
                  <p className="font-semibold text-slate-800 mt-0.5">₹{selectedLoan.monthly_income.toLocaleString()}/mo</p>
                </div>
                <div>
                  <p className="font-bold text-slate-400 uppercase">Amortization Period</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedLoan.loan_duration} Months</p>
                </div>
                <div>
                  <p className="font-bold text-slate-400 uppercase">Submission Timestamp</p>
                  <p className="font-semibold text-slate-850 mt-0.5">{new Date(selectedLoan.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Underwriter Decision Commentary</h4>
              {selectedLoan.officer_comments ? (
                <div className="rounded-lg bg-slate-50 border border-slate-150 p-4">
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed italic">
                    "{selectedLoan.officer_comments}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-medium italic">
                  No commentary has been recorded. The underwriting file is currently in the active analysis queue.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default MyApplications;
