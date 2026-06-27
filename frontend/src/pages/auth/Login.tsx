import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Lock, Mail, ShieldAlert, ArrowRight, Eye, EyeOff } from "lucide-react";
import type { UserRole } from "../../types";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Role detection: default to Customer if not set or invalid
  const roleParam = searchParams.get("role");
  const role: UserRole = roleParam === "Officer" ? "Officer" : "Customer";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Pre-fill email for development convenience
  useEffect(() => {
    if (role === "Officer") {
      setValue("email", "officer@banklite.com");
    } else {
      setValue("email", "customer@banklite.com");
    }
  }, [role, setValue]);

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    const loadingToast = toast.loading("Verifying credentials...");
    try {
      await login({
        email: values.email,
        password: values.password,
        role: role,
      });
      
      toast.success(`Welcome back! Authenticated as ${role}`, { id: loadingToast });
      
      if (role === "Officer") {
        navigate("/officer/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to log in. Check credentials.", { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {role === "Officer" ? "Officer Authentication" : "Customer Login"}
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          {role === "Officer" 
            ? "Enter your staff email credentials to access underwriting tools." 
            : "Access your dashboard to apply for and manage loans."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase">
            {role === "Officer" ? "Officer Email Address" : "Email Address"}
          </label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="e.g. name@banklite.com"
              className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                errors.email
                  ? "border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  : "border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-semibold text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase">
              Password
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.error("Password reset functionality is not configured.");
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                errors.password
                  ? "border-red-300 focus:border-red-600 focus:ring-1 focus:ring-red-600"
                  : "border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-semibold text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me (Only for customers) */}
        {role === "Customer" && (
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              {...register("rememberMe")}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="rememberMe" className="ml-2 text-xs font-semibold text-slate-600">
              Remember my session
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className={`flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all ${
            role === "Officer" 
              ? "hover:bg-amber-600 bg-slate-950 focus:ring-amber-500" 
              : "focus:ring-indigo-500"
          }`}
        >
          {role === "Officer" ? "Secure Staff Login" : "Authenticate Login"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Footer redirection links */}
      <div className="border-t border-slate-100 pt-4 text-center space-y-2">
        {role === "Customer" && (
          <p className="text-xs text-slate-500 font-medium">
            New applicant?{" "}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
              Create an Account
            </Link>
          </p>
        )}
        <p className="text-xs">
          <Link
            to="/select-role"
            className="font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Switch Authority Tier
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
