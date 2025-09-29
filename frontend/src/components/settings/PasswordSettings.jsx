import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

const PasswordSettings = () => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saveStatus, setSaveStatus] = useState(null);

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = (data) => {
    setSaveStatus("success");
    console.log("Password change data:", data);

    setTimeout(() => {
      setSaveStatus(null);
      reset();
    }, 3000);
  };

  const toggleShow = (field) =>
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  const renderPasswordField = (name, label, placeholder) => (
    <div>
      <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1 sm:mb-2">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: `${label} is required`,
          ...(name === "newPassword" && {
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }),
          ...(name === "confirmPassword" && {
            validate: (value) =>
              value === newPassword || "Passwords do not match",
          }),
        }}
        render={({ field }) => (
          <div className="relative">
            <input
              {...field}
              type={
                showPasswords[
                  name === "currentPassword"
                    ? "current"
                    : name === "newPassword"
                    ? "new"
                    : "confirm"
                ]
                  ? "text"
                  : "password"
              }
              placeholder={placeholder}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 pr-12 rounded-lg border-2 text-sm sm:text-base ${
                errors[name]
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-400 focus:border-gray-400-dark"
              } focus:outline-none transition-colors`}
            />
            <button
              type="button"
              onClick={() =>
                toggleShow(
                  name === "currentPassword"
                    ? "current"
                    : name === "newPassword"
                    ? "new"
                    : "confirm"
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPasswords[
                name === "currentPassword"
                  ? "current"
                  : name === "newPassword"
                  ? "new"
                  : "confirm"
              ] ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            {errors[name] && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors[name].message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2">
          Change Password
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-primary to-indigo-500 rounded-full"></div>
      </div>

      <div className="max-w-xl space-y-6">
        {renderPasswordField(
          "currentPassword",
          "Current Password",
          "Enter current password"
        )}
        {renderPasswordField(
          "newPassword",
          "New Password",
          "Enter new password"
        )}
        {renderPasswordField(
          "confirmPassword",
          "Confirm New Password",
          "Confirm new password"
        )}

        {/* Password Requirements */}
        <div className="flex-1 min-w-[250px] bg-gray-50 rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-3">
            Password Requirements:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>At least 8 characters long</li>
            <li>Include uppercase and lowercase letters</li>
            <li>Include at least one number</li>
            <li>Include at least one special character</li>
          </ul>
        </div>

        {/* Save Status */}
        {saveStatus && (
          <div
            className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3 text-sm sm:text-base ${
              saveStatus === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {saveStatus === "success" ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  Password changed successfully!
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Please fix the errors above</span>
              </>
            )}
          </div>
        )}

        {/* Change Password Button */}
        <button
          type="submit"
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105"
        >
          Change Password
        </button>
      </div>
    </form>
  );
};

export default PasswordSettings;
