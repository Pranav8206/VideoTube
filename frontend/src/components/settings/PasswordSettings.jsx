// PasswordSettings.jsx (your modal, enhanced)
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Lock,
  X,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff,
  RotateCcwKey,
} from "lucide-react";

const PasswordSettings = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const toggleShow = (field) =>
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleLocalSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return;
    }
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header - unchanged */}
        <div className="bg-gradient-to-r from-primary to-primary/50 px-2 sm:px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-3 text-lg sm:text-xl font-bold text-white">
              <RotateCcwKey className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              Change Password
            </div>
            <button
              onClick={() => {
                onClose();
                reset();
              }}
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleLocalSubmit)}
          className="p-6 space-y-3"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.old ? "text" : "password"}
                {...register("oldPassword", {
                  required: "Current password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="w-full px-4 pr-12 pl-8 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => toggleShow("old")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPasswords.old ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              <Lock className="absolute left-3 top-4 w-4 h-4 text-gray-400 pointer-events-none " />
            </div>
            {errors.oldPassword && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full px-4 pr-12 pl-8 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => toggleShow("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              <Lock className="absolute left-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.newPassword && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value, formValues) =>
                    value === formValues.newPassword ||
                    "Passwords do not match",
                })}
                className="w-full px-4 pr-12 pl-8 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => toggleShow("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              <Lock className="absolute left-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                reset();
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-3 rounded-lg font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Change"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordSettings;
