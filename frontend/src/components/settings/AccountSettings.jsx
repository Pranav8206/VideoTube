import React, { useContext, useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Loader2,
  Lock,
  LogOut,
  User,
  Mail,
  Image as ImageIcon,
  UserStar,
  Info,
} from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import PasswordSettings from "./PasswordSettings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const { user, setUser, logout } = useContext(AppContext);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const saveRef = useRef();
  const [showMessage, setShowMessage] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      avatar: null,
      coverImage: null,
      emailNotifications: true,
      pushNotifications: true,
    },
  });

  // Watch for form changes
  useEffect(() => {
    const subscription = watch(() => {
      setHasChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (user) {
      setValue("username", user.username || "");
      setValue("email", user.email || "");
      setValue("fullName", user.fullName || "");
      if (user?.avatar) setAvatarPreview(user?.avatar);
      if (user.coverImage) setCoverPreview(user.coverImage);
      setHasChanges(false);
    }
  }, [user, setValue]);

  const handleFilePreview = (file, type) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "avatar") setAvatarPreview(reader.result);
      else setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (file, endpoint) => {
    const formData = new FormData();
    const fieldName = endpoint === "avatar" ? "avatar" : "coverImage";
    formData.append(fieldName, file);
    const response = await axios.patch(`/api/v1/users/${endpoint}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return response.data;
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSaveStatus(null);
    try {
      const accountUpdateData = {
        username: data.username,
        email: data.email,
        fullName: data.fullName,
      };
      const accountResponse = await axios.patch(
        "/api/v1/users/update-account",
        accountUpdateData,
        {
          withCredentials: true,
        }
      );
      let updatedUser = { ...user, ...accountResponse.data.data };

      if (data?.avatar instanceof File) {
        const avatarResponse = await uploadFile(data?.avatar, "avatar");
        updatedUser = { ...updatedUser, ...avatarResponse.data.data };
      }
      if (data.coverImage instanceof File) {
        const coverResponse = await uploadFile(data.coverImage, "cover-image");
        updatedUser = { ...updatedUser, ...coverResponse.data.data };
      }

      setUser({ ...updatedUser });

      toast.success("Updated successfully");
      setSaveStatus("success");
      setHasChanges(false);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error updating account:", error);
      console.log(error);

      setSaveStatus("error");
      toast.error(error?.response?.data?.message || "Something went wrong");
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setIsLoading(false);
    }
    navigate("/setting");
  };

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        "/api/v1/users/change-password",
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          withCredentials: true,
        }
      );
      alert("Password changed successfully!");
      setShowPasswordModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  const handleClick = () => {
    setShowMessage(true);
    setCountdown(4);
  };

  useEffect(() => {
    if (!showMessage) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowMessage(false);
    }
  }, [countdown, showMessage]);

  return (
    <div className="flex-1 overflow-y-auto sm:bg-gray-50 sm:rounded-tl-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-5xl mx-auto sm:rounded-tl-2xl"
      >
        {/* Cover Image */}
        <div className="relative h-30 s:h-35 sm:h-45 md:h-50 lg:h-60 overflow-hidden aspect-video w-full bg-gradient-to-r from-primary to-purple-600 sm:rounded-tl-2xl">
          {coverPreview && (
            <img
              src={coverPreview}
              alt="Cover"
              className="object-cover w-full"
            />
          )}
          <Controller
            control={control}
            name="coverImage"
            render={({ field }) => (
              <label
                className={`absolute bottom-1 right-1 px-1 py-0.5 sm:px-2 sm:py-1 bg-white/90 backdrop-blur-sm rounded-sm sm:rounded-lg cursor-pointer shadow-lg z-20`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {coverPreview ? "Change Cover" : "Add Cover"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    field.onChange(e.target.files[0]);
                    handleFilePreview(e.target.files[0], "cover");
                  }}
                />
              </label>
            )}
          />
        </div>

        {/* Avatar and Info */}
        <div className="relative px-1 s:px-3 sm:px-6 flex items-end gap-1 s:gap-6 -mt-7 s:-mt-10 z-10">
          <Controller
            control={control}
            name="avatar"
            render={({ field }) => (
              <div className="relative">
                <div className="w-24 h-24 s:w-28 s:h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-indigo-400 flex items-center justify-center">
                      <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-1 right-1 w-8 h-8 sm:w-10 sm:h-10 bg-purple-400 rounded-full cursor-pointer hover:bg-primary transition-colors shadow-lg flex items-center justify-center">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      field.onChange(e.target.files[0]);
                      handleFilePreview(e.target.files[0], "avatar");
                    }}
                  />
                </label>
              </div>
            )}
          />
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {user?.fullName || "User"}
            </h2>
            <p className="text-sm text-gray-500">
              @{user?.username || "username"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Member since{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
          {/* Info icon and Message */}
          {showMessage && (
            <span
              className="text-sm absolute top-12 s:top-15 right-0 text-gray-800/80 p-1 bg-purple-100 ml-6 s:ml-10 mr-1 rounded-md whitespace-pre-line border border-gray-400/50"
              aria-live="polite"
            >
              {" "}
              <p className="text-center font-bold tracking-widest italic py-1">
                FOR BEST FIT{"\n"}
              </p>
              <strong>Cover Image:</strong> Use a 16:9 aspect ratio {"\n"}
              <strong>Avatar:</strong> Upload a square image{"\n"}
              ⚠️ <strong></strong> Max file size: 5 MB.
            </span>
          )}
          <div
            onClick={handleClick}
            className="absolute top-8 s:top-11 right-1 cursor-pointer text-gray-400 flex items-center justify-center w-4 h-4"
          >
            {showMessage ? countdown : <Info size={20} strokeWidth={2.5} />}
          </div>
        </div>

        {hasChanges && (
          <div className="mx-3 sm:mx-6 mt-5 p-2 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
              <p className="text-sm font-semibold text-gray-800">
                Unsaved changes detected
              </p>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Click the{" "}
              <span
                className="font-medium text-purple-600 animate-pulse"
                onClick={() =>
                  saveRef?.current?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Save
              </span>{" "}
              button below to apply changes
            </p>
          </div>
        )}

        {/* Personal Information */}
        <div className="p-3 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("fullName", {
                    minLength: { value: 4, message: "At least 4 characters" },
                  })}
                  placeholder="Pranav Mavle"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.fullName
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-primary focus:ring-primary"
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
                <UserStar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                    minLength: { value: 4, message: "At least 4 characters" },
                    maxLength: { value: 15, message: "At max 15 characters" },
                    validate: {
                      noInvalidSymbol: (value) =>
                        !value ||
                        /^[a-zA-Z0-9_]+$/.test(value) ||
                        "Username can't contain symbol and spaces",
                      noEdgeUnderscore: (value) =>
                        !value ||
                        !/^_|_$/.test(value) ||
                        "Username cannot start or end with underscore",
                    },
                  })}
                  placeholder="pranav_mavle"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.username
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-primary focus:ring-primary"
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
                <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.username && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-primary focus:ring-primary"
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="px-3 sm:px-6 mb-6 max-w-125 space-y-4">
          <Controller
            name="emailNotifications"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Receive updates via email
                  </p>
                </div>
                <ToggleSwitch checked={field.value} onChange={field.onChange} />
              </div>
            )}
          />
          <Controller
            name="pushNotifications"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between gap-1 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    Push Notifications
                  </p>
                  <p className="text-sm text-gray-500 leading-none">
                    Receive notifications in browser
                  </p>
                </div>
                <div>
                  <ToggleSwitch
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </div>
              </div>
            )}
          />
        </div>

        <div className="flex gap-2 sm:gap-10 pl-3 pr-1 sm:px-6 h-10 md:px-6 mb-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center w-25  gap-1 text-center justify-center w border py-0.5 sm:py-1 text-sm font-medium cursor-pointer text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>

          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center justify-center w-45 gap-1 rounded-lg border py-0.5 sm:py-1 border-primary bg-white text-sm hover:bg-purple-50 transition-all duration-300 group cursor-pointer hover:text-primary"
          >
            <Lock className="w-4 h-4  text-gray-900 group-hover:text-primary transition-all duration-300" />
            Change Password
          </button>
        </div>

        {/* Save Status & Button */}

        <div className="flex flex-col items-center justify-center my-4">
          {saveStatus === "success" && (
            <p className="text-green-600 text-sm mb-2">Saved successfully!</p>
          )}
          {saveStatus === "error" && (
            <p className="text-red-600 text-sm mb-2">Failed to save changes.</p>
          )}

          {hasChanges && (
            <button
              ref={saveRef}
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-semibold text-white flex items-center gap-2 transition-all ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving....
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          )}
        </div>
        
      </form>

      {/* Password Modal */}
      {showPasswordModal && (
        <PasswordSettings
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSubmit={onPasswordSubmit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default AccountSettings;
