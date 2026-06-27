import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { officerService } from "../../services/officer";
import type { LoanApplication } from "../../types";
import { toast } from "react-hot-toast";
import {
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  TrendingDown,
  Scale,
  Calendar,
  IndianRupee,
  User,
  Shield,
  History,
} from "lucide-react";
import { TableSkeleton } from "../../components/SkeletonLoader";

export const ReviewApplicationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const selectedId = searchParams.get("id");
  
  // State
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [loadingApp, setLoadingApp] = useState(false);
  
  // Review form state
  const [decision, setDecision] = useState<"Approved" | "Rejected" | "">("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch pending queue
  const fetchPendingQueue = async () => {
    setLoading(true);
    try {
      const res = await officerService.getPendingApplications();
      if (res.success && res.data) {
        setApplications(res.data.loans);
        setTotal(res.data.total);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load pending underwriting queue.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch selected application details
  const fetchAppDetails = async (id: number) => {
    setLoadingApp(true);
    try {
      const res = await officerService.getApplication(id);
      if (res.success && res.data) {
        setSelectedApp(res.data);
        // Reset form values
        setDecision("");
        setComments("");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to retrieve application file.");
      setSearchParams({}); // return to queue list
    } finally {
      setLoadingApp(false);
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchAppDetails(Number(selectedId));
    } else {
      setSelectedApp(null);
      fetchPendingQueue();
    }
  }, [selectedId]);

  const handleSelectApp = (id: number) => {
    setSearchParams({ id: String(id) });
  };

  const handleBackToQueue = () => {
    setSearchParams({});
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    if (!decision) {
      toast.error("Please select an underwriting decision (Approve or Reject).");
      return;
    }
    if (comments.trim().length < 5) {
      toast.error("Underwriter comments are mandatory (minimum 5 characters required).");
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading("Dispatching decision to central registry...");
    try {
      const res = await officerService.reviewApplication(selectedApp.id, {
        status: decision,
        comments: comments,
      });

      if (res.success) {
        toast.success(`Underwriting file #${selectedApp.id} has been successfully ${decision.toLowerCase()}!`, {
          id: loadingToast,
        });
        handleBackToQueue();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to record decision.", { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskTier = (score: number) => {
    if (score >= 740) return { label: "Low Credit Risk", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (score >= 600) return { label: "Medium Credit Risk", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { label: "High Credit Risk", color: "text-red-700 bg-red-50 border-red-200" };
  };

  const getDtiRatio = (monthlyIncome: number, loanAmount: number, duration: number) => {
    // Simple mock calculation: Monthly payment / Monthly income
    // Assuming 6% mock interest rate for payment calculation
    const monthlyRate = 0.06 / 12;
    const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, duration)) / (Math.pow(1 + monthlyRate, duration) - 1);
    const ratio = (payment / monthlyIncome) * 100;
    return {
      monthlyPayment: Math.round(payment),
      ratio: Math.round(ratio * 10) / 10,
    };
  };

  // Render Queue List View
  if (!selectedId) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Pending Underwriting Queue
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Active file queue assigned to your credential tier for evaluation.
          </p>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-350 bg-white p-16 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-150">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Queue is Clear</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                There are no pending loan files awaiting underwriter verification.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Loan Volume Request</th>
                    <th className="px-6 py-4">Dynamic Credit score</th>
                    <th className="px-6 py-4">Income Declaration</th>
                    <th className="px-6 py-4">Date Filed</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900">#{app.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-950">{app.customer?.full_name}</p>
                        <p className="text-xs text-slate-500">{app.customer?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">₹{app.loan_amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">{app.purpose} · {app.loan_duration}m</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-mono font-bold ${getRiskTier(app.credit_score).color}`}>
                          {app.credit_score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">₹{app.monthly_income.toLocaleString()}/mo</p>
                        <p className="text-xs text-slate-500">{app.employment_type}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleSelectApp(app.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                        >
                          Review File
                          <ChevronRight className="h-3 w-3" />
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
    );
  }

  // Render Detailed File Review Panel
  if (loadingApp) {
    return (
      <div className="flex h-64 items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-semibold text-slate-500">Decrypting financial record file...</p>
        </div>
      </div>
    );
  }

  if (!selectedApp) return null;

  const dti = getDtiRatio(selectedApp.monthly_income, selectedApp.loan_amount, selectedApp.loan_duration);
  const risk = getRiskTier(selectedApp.credit_score);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={handleBackToQueue}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-950 transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Return to Queue
        </button>
      </div>

      {/* Main Container Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Applicant Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* File Card Header */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest">Underwriting File Target</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Application File #{selectedApp.id}</h3>
              </div>
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${selectedApp.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-250" : selectedApp.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-250" : "bg-red-50 text-red-700 border-red-250"}`}>
                {selectedApp.status}
              </span>
            </div>

            {/* General Info */}
            <div className="grid gap-6 sm:grid-cols-3">
              {/* Applicant Name */}
              <div className="flex items-start gap-3 col-span-2 sm:col-span-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-3xs font-bold text-slate-400 uppercase">Applicant</p>
                  <p className="text-sm font-bold text-slate-900 leading-tight">{selectedApp.customer?.full_name}</p>
                  <p className="text-2xs text-slate-500 truncate max-w-[120px]">{selectedApp.customer?.email}</p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <IndianRupee className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-3xs font-bold text-slate-400 uppercase">Volume Requested</p>
                  <p className="text-sm font-bold text-slate-900">₹{selectedApp.loan_amount.toLocaleString()}</p>
                  <p className="text-2xs text-slate-500">{selectedApp.purpose}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-3xs font-bold text-slate-400 uppercase">Filing Date</p>
                  <p className="text-sm font-bold text-slate-900">{new Date(selectedApp.created_at).toLocaleDateString()}</p>
                  <p className="text-2xs text-slate-500">{new Date(selectedApp.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Underwriting Indicators Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Risk indicators */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-indigo-650" />
                Risk Underwriting Scoring
              </h4>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-500">Credit Score:</span>
                    <span className="font-bold text-slate-900">{selectedApp.credit_score}</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${((selectedApp.credit_score - 300) / 550) * 100}%` }}
                    />
                  </div>
                </div>

                <div className={`rounded-lg border p-3 ${risk.color} text-xs flex items-start gap-2.5`}>
                  <TrendingDown className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold">{risk.label}</h5>
                    <p className="text-2xs opacity-80 mt-0.5 leading-relaxed">
                      Acceptable parameters: Scores above 600 fit underwriting guidelines. Scores below 600 require manual review.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial indicators */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-indigo-650" />
                Income & Ratio Matrix
              </h4>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-450 uppercase">Declared Monthly</p>
                  <p className="font-semibold text-slate-800 mt-0.5">₹{selectedApp.monthly_income.toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-450 uppercase">Declared Yearly</p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    ₹{(selectedApp.yearly_income || selectedApp.monthly_income * 12).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-450 uppercase">Employment Status</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.employment_type}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-450 uppercase">Amortization Period</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedApp.loan_duration} Months</p>
                </div>
                <div className="col-span-2">
                  <p className="font-bold text-slate-450 uppercase">Payment Estimate</p>
                  <p className="font-semibold text-slate-800 mt-0.5">₹{dti.monthlyPayment.toLocaleString()}/mo</p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-150 p-2.5 text-2xs flex justify-between items-center">
                <span className="font-semibold text-slate-500">Debt-To-Income Ratio:</span>
                <span className={`font-mono font-bold ${dti.ratio > 40 ? "text-red-600" : "text-emerald-700"}`}>
                  {dti.ratio}% {dti.ratio > 40 ? "(DTI Alert)" : "(Healthy)"}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline of audits for this file */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <History className="h-4 w-4 text-indigo-650" />
              File History Registry
            </h4>

            <div className="space-y-4 relative pl-4 before:absolute before:top-1.5 before:bottom-1.5 before:left-1 before:w-0.5 before:bg-slate-200">
              {/* Event 1: Creation */}
              <div className="relative space-y-1">
                <span className="absolute -left-4.5 top-1.5 h-2.5 w-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">File Filed in Registry</span>
                  <span className="text-3xs text-slate-400 font-medium">{new Date(selectedApp.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-2xs text-slate-500 leading-normal">
                  File registered under customer ID #{selectedApp.customer_id}. Dynamically pulled credit score matrix: {selectedApp.credit_score}.
                </p>
              </div>

              {/* Event 2: Action details if approved/rejected */}
              {selectedApp.status !== "Pending" && (
                <div className="relative space-y-1">
                  <span className={`absolute -left-4.5 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${selectedApp.status === "Approved" ? "bg-emerald-500" : "bg-red-500"}`} />
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Underwriting Decision: {selectedApp.status}</span>
                    <span className="text-3xs text-slate-400 font-medium">{new Date(selectedApp.updated_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-2xs text-slate-500 leading-normal">
                    Compliance status updated to {selectedApp.status}. Underwriter comments permanently appended.
                  </p>
                  {selectedApp.officer_comments && (
                    <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 text-2xs text-slate-655 italic mt-1.5">
                      "{selectedApp.officer_comments}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Decision Desk Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 h-fit">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Decision Underwriting Desk
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Select decision status and write compliance commentary.
            </p>
          </div>

          {selectedApp.status !== "Pending" ? (
            <div className="rounded-xl bg-slate-50 border border-slate-150 p-4 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800">Underwriting File Locked</p>
                <p className="text-3xs text-slate-500 leading-relaxed">
                  A definitive decision of <span className="font-bold text-slate-900">{selectedApp.status}</span> has been logged. This file is legally locked.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-5">
              {/* Decision select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Compliance Action
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDecision("Approved")}
                    className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-bold transition-all ${
                      decision === "Approved"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                    Approve File
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecision("Rejected")}
                    className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-bold transition-all ${
                      decision === "Rejected"
                        ? "border-red-600 bg-red-50 text-red-700"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <XCircle className="h-4.5 w-4.5 text-red-650" />
                    Decline File
                  </button>
                </div>
              </div>

              {/* Comments box */}
              <div className="space-y-1.5">
                <label htmlFor="comments" className="text-xs font-bold text-slate-500 uppercase">
                  Underwriter Compliance Comments
                </label>
                <textarea
                  id="comments"
                  rows={6}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Underwriter remarks detailing credit worthiness, income verification details, risk tier assessments, or rejection reasons..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
                <span className="text-3xs text-slate-400 block text-right font-medium">
                  {comments.trim().length} / 1000 characters (min 5)
                </span>
              </div>

              {/* Warning warning */}
              <div className="rounded-lg bg-amber-50 border border-amber-150 p-3 text-3xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                <p className="leading-relaxed font-semibold">
                  This decision will trigger dynamic status notifications to the customer and create a permanent audit log entry in the security timeline.
                </p>
              </div>

              {/* Submit decision */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full rounded-lg py-2.5 text-xs font-bold text-white transition-all shadow-xs ${
                  decision === "Approved"
                    ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                    : decision === "Rejected"
                    ? "bg-red-600 hover:bg-red-750 focus:ring-red-500"
                    : "bg-slate-900 hover:bg-slate-800 focus:ring-slate-500"
                }`}
              >
                {submitting ? "Writing ledger..." : "Dispatch Underwriting Decision"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default ReviewApplicationPage;
