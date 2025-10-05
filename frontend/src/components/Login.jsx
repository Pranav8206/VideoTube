import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AppContext } from "../context/context";
import { AlertCircle, Eye, EyeOff, User, Mail, Lock, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setShowLogin, showLogin, axios, setToken, fetchCurrentUser } =
    useContext(AppContext);

  const [state, setState] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => reset(), [state, reset]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const payload =
        state === "login"
          ? { email: formData.email, password: formData.password }
          : {
              username: formData.username,
              email: formData.email,
              password: formData.password,
            };

      const { data } = await axios.post(`/api/v1/users/${state}`, payload);
      console.log(data, "data");

      if (data?.success) {
        localStorage.setItem("token", data.data.accessToken);
        setToken(data.data.accessToken);
        navigate("/");
        console.log("login successfully");

        setShowLogin(false);
        fetchCurrentUser();
        reset();
      } else {
        console.log(data);

        setError("root", {
          type: "manual",
          message: data.message || "Authentication failed",
        });
      }
    } catch (error) {
      setError("root", {
        type: "manual",
        message:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowLogin(false);
    reset();
  };

  if (!showLogin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm cursor-pointer"
      />

      <div className="relative w-full max-w-sm animate-in zoom-in-95 duration-200 overflow-y-auto">
        <div className="relative bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-15 bg-gradient-to-br from-primary/20 via-primary/30 to-primary/20 opacity-30" />

          <button
            onClick={handleClose}
            className="absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all duration-200 cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </button>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative p-5 sm:p-6 pt-5 space-y-3"
          >
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {state === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                {state === "login"
                  ? "Sign in to continue"
                  : "Sign up to get started"}
              </p>
            </div>

            {/* Root Error */}
            {errors.root && (
              <div className="flex items-start gap-2 px-2 py-1 bg-red-50 border border-red-200 rounded-md text-sm">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{errors.root.message}</p>
              </div>
            )}

            {/* Name Field */}
            {state === "register" && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    {...register("username", {
                      required:
                        state === "register" ? "Username is required" : false,
                      minLength: { value: 4, message: "At least 4 characters" },
                      validate: {
                        noInvalidSymbol: (value) =>
                          /^[a-zA-Z0-9_]+$/.test(value) ||
                          "Username can't contain symbol",
                        noEdgeUnderscore: (value) =>
                          !/^_|_$/.test(value) ||
                          "Username cannot start or end with underscore",
                      },
                    })}
                    type="text"
                    placeholder="pranav_mavle"
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm ${
                      errors.username
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.username.message}
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "At least 6 characters" },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-3 bg-primary hover:bg-primary-dull text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : state === "register" ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>

            {/* Toggle */}
            <div className="text-center pt-1">
              <p className="text-xs sm:text-sm text-gray-600">
                {state === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setState("register")}
                      className="font-medium text-primary hover:underline cursor-pointer transition-colors"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setState("login")}
                      className="font-medium text-primary hover:underline cursor-pointer transition-colors"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
