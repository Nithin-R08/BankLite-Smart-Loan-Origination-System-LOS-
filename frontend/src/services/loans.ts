import api from "./api";
import type { ApiResponse } from "../types";

export interface ApplyLoanData {
  loan_amount: number;
  purpose: string;
  monthly_income: number;
  yearly_income: number;
  employment_type: string;
  loan_duration: number;
}

export const loanService = {
  async applyLoan(data: ApplyLoanData): Promise<ApiResponse> {
    const res = await api.post("/customer/loan/apply", data);
    return res.data;
  },

  async getLoans(params?: {
    status_filter?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    const res = await api.get("/customer/loans", { params });
    return res.data;
  },

  async getDashboardStats(): Promise<ApiResponse> {
    const res = await api.get("/customer/dashboard-stats");
    return res.data;
  },
};
