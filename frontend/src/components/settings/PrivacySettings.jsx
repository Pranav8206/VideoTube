import React, { useContext, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { CheckCircle, Loader2, Trash2 } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import toast from "react-hot-toast";
import axios from "axios";
import { AppContext } from "../../context/context";
import { useNavigate } from "react-router-dom";

const PrivacySettings = () => {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      profileVisibility: true,
      showEmail: false,
      allowMessages: true,
      showActivity: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Watch for changes to mark unsaved changes
  useEffect(() => {
    const subscription = watch(() => setHasChanges(true));
    return () => subscription.unsubscribe();
  }, [watch]);

  const privacyItems = [
    {
      key: "profileVisibility",
      label: "Public Profile",
      description: "Make your profile visible to everyone",
    },
    {
      key: "showEmail",
      label: "Show Email",
      description: "Display email on your profile",
    },
    {
      key: "allowMessages",
      label: "Allow Messages",
      description: "Let others send you direct messages",
    },
    {
      key: "showActivity",
      label: "Show Activity",
      description: "Display your recent activity",
    },
  ];

  const onSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasChanges(false);
      toast.success("Changes saved successfully!");
    }, 1500);
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        `Delete your account? All your videos will be permanently deleted.\nThis action is permanent`
      )
    )
      return;

    try {
      setIsDeleting(true);
      await axios.delete("/api/v1/users");

      setUser(null);
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 rounded-tl-2xl p-3 sm:p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-120">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          Privacy Settings
        </h1>
        <div className="space-y-4">
          {privacyItems.map((item) => (
            <Controller
              key={item.key}
              name={item.key}
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-1 pl-2 sm:px-4">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-gray-500 text-xs sm:text-sm leading-none">
                      {item.description}
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
          ))}
          {/* Delete Account Button */}
          <div className="flex w-full xs:justify-end">
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="flex items-center  justify-end gap-2 mx-2 px-3 sm:px-6 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
              Delete Account
            </button>
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 mx-auto py-3 my-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        )}
      </form>
    </div>
  );
};

export default PrivacySettings;
