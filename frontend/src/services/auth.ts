import api from "./api";
import type { User, ApiResponse } from "../types";

export interface RegisterData {
  full_name: string;
  email: string;
  phone?: string;
  password?: string;
  role: "Customer" | "Officer";
}

export interface LoginData {
  email: string;
  password?: string;
  role: "Customer" | "Officer";
}

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  password?: string;
  current_password?: string;
}

export const authService = {
  async register(data: RegisterData): Promise<ApiResponse> {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  async login(data: LoginData): Promise<ApiResponse> {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  async getMe(): Promise<ApiResponse> {
    const res = await api.get("/auth/me");
    return res.data;
  },

  async getCustomerProfile(): Promise<ApiResponse> {
    const res = await api.get("/customer/profile");
    return res.data;
  },

  async updateCustomerProfile(data: UpdateProfileData): Promise<ApiResponse> {
    const res = await api.put("/customer/profile", data);
    return res.data;
  },
};
