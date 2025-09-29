import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { AlertTriangle, Camera, Upload, CheckCircle } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

const AccountSettings = () => {
  const {
    register,
    handleSubmit,
    control,
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

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const watchAvatar = watch("avatar");
  const watchCover = watch("coverImage");

  const handleFilePreview = (file, type) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "avatar") setAvatarPreview(reader.result);
      else setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data) => {
    setSaveStatus("success");
    setTimeout(() => setSaveStatus(null), 3000);
    console.log("Form submitted:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Account Settings
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-primary to-indigo-500 rounded-full"></div>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-2">
          Cover Image
        </label>
        <Controller
          control={control}
          name="coverImage"
          render={({ field }) => (
            <div className="relative h-32 sm:h-40 bg-gradient-to-r from-primary/20 to-indigo-100 rounded-xl overflow-hidden border-2 border-dashed border-text-400 transition-colors">
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
              <label className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors">
                <div className="text-center">
                  <Upload className="w-6 h-6 text-gray-800 mx-auto mb-1 sm:mb-2" />
                  <span className="text-sm sm:text-base text-gray-800 font-medium">
                    Upload Cover
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
            </div>
          )}
        />
      </div>

      {/* Avatar */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Profile Picture
        </label>
        <Controller
          control={control}
          name="avatar"
          render={({ field }) => (
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-300 to-primary flex items-center justify-center">
                      <Camera className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors shadow-lg">
                  <Upload className="w-4 h-4 text-white" />
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
              <div className="text-sm sm:text-base text-gray-600">
                <p className="font-medium">
                  Recommended: Square image, at least 200x200px
                </p>
                <p>PNG, JPG or GIF. Max 5MB.</p>
              </div>
            </div>
          )}
        />
      </div>

      {/* Form Fields */}
      <div className="space-y-4 sm:space-y-6">
        {[
          {
            label: "Full Name",
            name: "fullName",
            type: "text",
            placeholder: "Enter your full name",
            validation: { required: "Full name is required" },
          },
          {
            label: "Username",
            name: "username",
            type: "text",
            placeholder: "Enter your username",
            validation: {
              required: "Username is required",
              minLength: { value: 3, message: "Minimum 3 characters" },
            },
          },
          {
            label: "Email Address",
            name: "email",
            type: "email",
            placeholder: "Enter your email",
            validation: {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            },
          },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">
              {field.label}
            </label>
            <input
              type={field.type}
              {...register(field.name, field.validation)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm sm:text-base ${
                errors[field.name]
                  ? "border-red-300 focus:border-red-500"
                  : "border-text-400 focus:border-text-400-dark"
              } focus:outline-none transition-colors`}
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Notification Preferences */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Notifications
        </h3>
        {[
          { label: "Email notifications", name: "emailNotifications" },
          { label: "Push notifications", name: "pushNotifications" },
        ].map((notif) => (
          <Controller
            key={notif.name}
            name={notif.name}
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span>{notif.label}</span>
                <ToggleSwitch checked={field.value} onChange={field.onChange} />
              </div>
            )}
          />
        ))}
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
              <span className="font-medium">Changes saved successfully!</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Please fix the errors above</span>
            </>
          )}
        </div>
      )}

      {/* Save Button */}
      <button
        type="submit"
        className="w-full sm:w-auto bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105"
      >
        Save Changes
      </button>
    </form>
  );
};

export default AccountSettings;
