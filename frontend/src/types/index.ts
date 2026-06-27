export type UserRole = "Customer" | "Officer";

export interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type LoanStatus = "Pending" | "Approved" | "Rejected";

export interface LoanApplication {
  id: number;
  customer_id: number;
  loan_amount: number;
  purpose: string;
  monthly_income: number;
  yearly_income: number;
  employment_type: string;
  loan_duration: number;
  credit_score: number;
  status: LoanStatus;
  officer_comments: string | null;
  created_at: string;
  updated_at: string;
  customer?: User;
}

export interface AuditLog {
  id: number;
  loan_id: number;
  officer_id: number;
  action: string;
  comments: string | null;
  created_at: string;
  officer?: User;
  loan_amount?: number;
  customer_name?: string;
}

export interface CustomerStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  recent_applications: LoanApplication[];
}

export interface RecentActivity {
  id: number;
  officer_name: string;
  action: string;
  loan_id: number;
  amount: number;
  comments: string | null;
  timestamp: string;
}

export interface OfficerStats {
  pending_reviews: number;
  today_approvals: number;
  today_rejections: number;
  average_credit_score: number;
  approval_rate: number;
  purpose_distribution: {
    name: string;
    value: number;
    amount: number;
  }[];
  trends: {
    month: string;
    applications: number;
    approved: number;
    rejected: number;
  }[];
  risk_distribution: {
    name: string;
    value: number;
    color: string;
  }[];
  recent_activities: RecentActivity[];
}
