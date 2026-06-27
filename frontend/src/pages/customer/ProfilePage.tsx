import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { User, Phone, Mail, Lock, CheckCircle2, UserCheck } from "lucide-react";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  currentPassword: z.string().optional().or(z.literal("")),
  newPassword: z.string().optional().or(z.literal("")),
  confirmNewPassword: z.string().optional().or(z.literal("")),
}).refine(
  (data) => {
    if (data.newPassword && data.newPassword.length > 0) {
      return data.currentPassword && data.currentPassword.length > 0;
    }
    return true;
  },
  {
    message: "Current password is required to set a new password",
    path: ["currentPassword"],
  }
).refine(
  (data) => {
    if (data.newPassword && data.newPassword.length > 0) {
      return data.newPassword === data.confirmNewPassword;
    }
    return true;
  },
  {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  }
);

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.full_name || "",
      phone: user?.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setUpdating(true);
    const loadingToast = toast.loading("Updating profile registry...");

    try {
      await updateProfile({
        full_name: values.fullName,
        phone: values.phone,
        password: values.newPassword || undefined,
        current_password: values.currentPassword || undefined,
      });

      toast.success("Profile registry successfully updated!", { id: loadingToast });
      reset({
        fullName: values.fullName,
        phone: values.phone,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.", { id: loadingToast });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Account Profile Settings
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Manage your personal details and adjust authentication credentials.
        </p>
      </div>

      {/* Main card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs space-y-8">
        {/* Avatar badge preview */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-2xl font-black border border-slate-200">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 leading-tight">
              {user?.full_name}
            </h4>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 mt-1">
              <UserCheck className="h-3.5 w-3.5" />
              Verified Identity File
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section: General Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              General Identity Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="fullName" className="text-xs font-bold text-slate-500 uppercase">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="fullName"
                    type="text"
                    {...register("fullName")}
                    className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                      errors.fullName ? "border-red-300 focus:border-red-600" : "border-slate-300 focus:border-indigo-600"
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs font-semibold text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="phone"
                    type="text"
                    {...register("phone")}
                    className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                      errors.phone ? "border-red-300 focus:border-red-600" : "border-slate-300 focus:border-indigo-600"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs font-semibold text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-1.5 col-span-2">
                <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase">
                  Primary Email (Locked)
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-10 py-2.5 text-sm text-slate-500 outline-none select-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Credentials */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Authentication Credentials (Optional)
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Current Password */}
              <div className="space-y-1.5 col-span-2">
                <label htmlFor="currentPassword" className="text-xs font-bold text-slate-500 uppercase">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="currentPassword"
                    type="password"
                    {...register("currentPassword")}
                    placeholder="Enter current password to authorize edits"
                    className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                      errors.currentPassword ? "border-red-300 focus:border-red-600" : "border-slate-300 focus:border-indigo-600"
                    }`}
                  />
                </div>
                {errors.currentPassword && (
                  <p className="text-xs font-semibold text-red-600">{errors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="text-xs font-bold text-slate-500 uppercase">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="newPassword"
                    type="password"
                    {...register("newPassword")}
                    placeholder="••••••••"
                    className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                      errors.newPassword ? "border-red-300 focus:border-red-600" : "border-slate-300 focus:border-indigo-600"
                    }`}
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-xs font-semibold text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmNewPassword" className="text-xs font-bold text-slate-500 uppercase">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="confirmNewPassword"
                    type="password"
                    {...register("confirmNewPassword")}
                    placeholder="••••••••"
                    className={`w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-all ${
                      errors.confirmNewPassword ? "border-red-300 focus:border-red-600" : "border-slate-300 focus:border-indigo-600"
                    }`}
                  />
                </div>
                {errors.confirmNewPassword && (
                  <p className="text-xs font-semibold text-red-600">{errors.confirmNewPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form CTA */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={updating}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Commit Updates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ProfilePage;
