import api from "./api";
import type { ApiResponse } from "../types";

export const officerService = {
  async getDashboardStats(): Promise<ApiResponse> {
    const res = await api.get("/officer/dashboard");
    return res.data;
  },

  async getPendingApplications(params?: {
    skip?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    const res = await api.get("/officer/pending", { params });
    return res.data;
  },

  async getApplication(loanId: number): Promise<ApiResponse> {
    const res = await api.get(`/officer/application/${loanId}`);
    return res.data;
  },

  async reviewApplication(
    loanId: number,
    data: { status: "Approved" | "Rejected"; comments: string }
  ): Promise<ApiResponse> {
    const res = await api.put(`/officer/review/${loanId}`, data);
    return res.data;
  },

  async getAuditLogs(params?: {
    skip?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    const res = await api.get("/officer/audit-logs", { params });
    return res.data;
  },
};
