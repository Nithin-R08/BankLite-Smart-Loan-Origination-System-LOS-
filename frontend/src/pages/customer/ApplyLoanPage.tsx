import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loanService } from "../../services/loans";
import { toast } from "react-hot-toast";
import { IndianRupee, Landmark, Briefcase, Calendar, AlertCircle } from "lucide-react";
import Modal from "../../components/Modal";

const loanFormSchema = z.object({
  loan_amount: z.number().min(500, "Minimum loan amount is ₹500").max(10000000, "Maximum loan amount is ₹10,000,000"),
  purpose: z.string().min(5, "Purpose description must be at least 5 characters").max(255),
  monthly_income: z.number().min(100, "Monthly income must be at least ₹100"),
  employment_type: z.enum(["Full-Time", "Part-Time", "Self-Employed", "Unemployed"]),
  loan_duration: z.number().min(6, "Minimum duration is 6 months").max(360, "Maximum duration is 360 months (30 years)"),
  notes: z.string().max(1000).optional(),
});

type LoanFormValues = z.infer<typeof loanFormSchema>;

export const ApplyLoanPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<LoanFormValues | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      loan_amount: 10000,
      purpose: "Home Refinancing",
      monthly_income: 5000,
      employment_type: "Full-Time",
      loan_duration: 36,
      notes: "",
    },
  });

  const onSubmitStep1 = (values: LoanFormValues) => {
    // Save values and prompt confirmation modal
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const handleConfirmedSubmit = async () => {
    if (!pendingValues) return;
    setConfirmOpen(false);
    setSubmitting(true);
    const loadingToast = toast.loading("Submitting application to underwriting...");

    try {
      const res = await loanService.applyLoan({
        loan_amount: pendingValues.loan_amount,
        purpose: pendingValues.purpose,
        monthly_income: pendingValues.monthly_income,
        employment_type: pendingValues.employment_type,
        loan_duration: pendingValues.loan_duration,
      });

      if (res.success) {
        toast.success("Application successfully routed to underwriting registry!", { id: loadingToast });
        navigate("/customer/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit loan file.", { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Initiate New Underwriting File
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Please input your accurate financial and employment metrics. Misdeclarations are auto-flagged.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
        <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Loan Amount */}
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="loan_amount" className="text-xs font-bold text-slate-500 uppercase">
                Requested Credit Amount (₹)
              </label>
              <div className="relative">
                <IndianRupee className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="loan_amount"
                  type="number"
                  {...register("loan_amount", { valueAsNumber: true })}
                  placeholder="e.g. 50000"
                  className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                    errors.loan_amount ? "border-red-300 focus:border-red-650" : "border-slate-300 focus:border-indigo-650"
                  }`}
                />
              </div>
              {errors.loan_amount && (
                <p className="text-xs font-semibold text-red-600">{errors.loan_amount.message}</p>
              )}
            </div>

            {/* Monthly Income */}
            <div className="space-y-1.5">
              <label htmlFor="monthly_income" className="text-xs font-bold text-slate-500 uppercase">
                Verified Monthly Income (₹)
              </label>
              <div className="relative">
                <IndianRupee className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="monthly_income"
                  type="number"
                  {...register("monthly_income", { valueAsNumber: true })}
                  placeholder="e.g. 6000"
                  className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                    errors.monthly_income ? "border-red-300 focus:border-red-600" : "border-slate-300 focus:border-indigo-600"
                  }`}
                />
              </div>
              {errors.monthly_income && (
                <p className="text-xs font-semibold text-red-600">{errors.monthly_income.message}</p>
              )}
            </div>

            {/* Employment Type */}
            <div className="space-y-1.5">
              <label htmlFor="employment_type" className="text-xs font-bold text-slate-500 uppercase">
                Employment Class
              </label>
              <div className="relative">
                <Briefcase className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  id="employment_type"
                  {...register("employment_type")}
                  className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="Full-Time">Full-Time Employee</option>
                  <option value="Part-Time">Part-Time Employee</option>
                  <option value="Self-Employed">Self-Employed / Contractor</option>
                  <option value="Unemployed">Currently Unemployed</option>
                </select>
              </div>
              {errors.employment_type && (
                <p className="text-xs font-semibold text-red-600">{errors.employment_type.message}</p>
              )}
            </div>

            {/* Loan Duration (months) */}
            <div className="space-y-1.5">
              <label htmlFor="loan_duration" className="text-xs font-bold text-slate-500 uppercase">
                Amortization Duration (Months)
              </label>
              <div className="relative">
                <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="loan_duration"
                  type="number"
                  {...register("loan_duration", { valueAsNumber: true })}
                  placeholder="e.g. 36"
                  className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                    errors.loan_duration ? "border-red-300 focus:border-red-600" : "border-slate-300 focus:border-indigo-600"
                  }`}
                />
              </div>
              {errors.loan_duration && (
                <p className="text-xs font-semibold text-red-600">{errors.loan_duration.message}</p>
              )}
            </div>

            {/* Loan Purpose category (represented in a text input for flexibility or predefined list) */}
            <div className="space-y-1.5">
              <label htmlFor="purpose" className="text-xs font-bold text-slate-500 uppercase">
                Loan Purpose Description
              </label>
              <div className="relative">
                <Landmark className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="purpose"
                  type="text"
                  {...register("purpose")}
                  placeholder="e.g. Purchase of primary residence"
                  className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                    errors.purpose ? "border-red-300 focus:border-red-600" : "border-slate-300 focus:border-indigo-600"
                  }`}
                />
              </div>
              {errors.purpose && (
                <p className="text-xs font-semibold text-red-600">{errors.purpose.message}</p>
              )}
            </div>

            {/* Additional Notes */}
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="notes" className="text-xs font-bold text-slate-500 uppercase">
                Additional Comments / Context (Optional)
              </label>
              <textarea
                id="notes"
                rows={4}
                {...register("notes")}
                placeholder="Include additional collateral information or explain monthly cash flow buffers..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Submission CTA */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => navigate("/customer/dashboard")}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Verify & Submit
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Application Dispatch"
        footer={
          <>
            <button
              onClick={() => setConfirmOpen(false)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Review File
            </button>
            <button
              onClick={handleConfirmedSubmit}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
            >
              Confirm Dispatch
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 border border-indigo-150">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-900">
              You are about to file an official credit application.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Once submitted, our credit scoring engine will immediately query credit profiles and lock the file for underwriter analysis. You will be unable to make edits or cancel the request.
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Requested Amount:</span>
              <span className="font-bold text-slate-900">₹{pendingValues?.loan_amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Duration Period:</span>
              <span className="font-bold text-slate-900">{pendingValues?.loan_duration} Months</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Employment Class:</span>
              <span className="font-bold text-slate-900">{pendingValues?.employment_type}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default ApplyLoanPage;
