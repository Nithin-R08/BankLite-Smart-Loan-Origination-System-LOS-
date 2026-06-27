import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Customer", "Officer"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const roleParam = searchParams.get("role");
  const defaultRole = roleParam === "Officer" ? "Officer" : "Customer";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: defaultRole,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitting(true);
    const loadingToast = toast.loading("Creating account...");
    try {
      await registerAuth({
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role: values.role,
      });
      
      toast.success("Account registered! Please log in.", { id: loadingToast });
      navigate(`/login?role=${values.role}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to register account.", { id: loadingToast });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Create an Account
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Create your login credentials to gain system entry permissions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="fullName" className="text-xs font-bold text-slate-500 uppercase">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="fullName"
              type="text"
              {...register("fullName")}
              placeholder="e.g. John Doe"
              className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                errors.fullName ? "border-red-300 focus:border-red-600" : "border-slate-300 focus:border-indigo-600"
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs font-semibold text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="e.g. name@example.com"
              className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                errors.email ? "border-red-300 focus:border-red-600" : "border-slate-300 focus:border-indigo-600"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-semibold text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="phone"
              type="text"
              {...register("phone")}
              placeholder="e.g. 555-0123-456"
              className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                errors.phone ? "border-red-300 focus:border-red-600" : "border-slate-300 focus:border-indigo-600"
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-xs font-semibold text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                errors.password ? "border-red-300 focus:border-red-600" : "border-slate-300 focus:border-indigo-600"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-semibold text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Role selection dropdown */}
        <div className="space-y-1">
          <label htmlFor="role" className="text-xs font-bold text-slate-500 uppercase">
            System Authority Role
          </label>
          <select
            id="role"
            {...register("role")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          >
            <option value="Customer">Customer Portal Access</option>
            <option value="Officer">Secure Underwriting Officer</option>
          </select>
          {errors.role && (
            <p className="text-xs font-semibold text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all focus:ring-2 focus:ring-indigo-500"
        >
          Register Credentials
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="border-t border-slate-100 pt-4 text-center">
        <p className="text-xs text-slate-500 font-medium">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;
