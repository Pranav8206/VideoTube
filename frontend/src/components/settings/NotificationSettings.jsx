import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { CheckCircle, Loader2 } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import toast from "react-hot-toast";

const NotificationSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      comments: true,
      likes: false,
      newFollowers: true,
      mentions: true,
    },
  });

  useEffect(() => {
    const subscription = watch(() => setHasChanges(true));
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasChanges(false);
      toast.success("Changes saved successfully!");
    }, 1500);
  };

  const fields = [
    {
      name: "newFollowers",
      label: "New Followers",
      description: "When someone follows you",
    },
    {
      name: "likes",
      label: "Likes",
      description: "When someone likes your content",
    },

    {
      name: "comments",
      label: "Comments",
      description: "When someone comments on your videos",
    },
    {
      name: "mentions",
      label: "Mentions",
      description: "When someone mentions you",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto sm:bg-gray-50 sm:rounded-tl-2xl p-3 sm:p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-120">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          Notification Settings
        </h1>
        <div className="space-y-4">
          {fields.map((field) => (
            <Controller
              key={field.name}
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <div className="flex items-center justify-between gap-1 pl-2 sm:px-4">
                  <div>
                    <p className="font-medium text-gray-900">{field.label}</p>
                    <p className="text-gray-500 text-xs sm:text-sm leading-none">
                      {field.description}
                    </p>
                  </div>
                  <div>
                    <ToggleSwitch
                      checked={controllerField.value}
                      onChange={controllerField.onChange}
                      disabled={field.name === "mentions"}
                    />
                  </div>
                </div>
              )}
            />
          ))}
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

export default NotificationSettings;
