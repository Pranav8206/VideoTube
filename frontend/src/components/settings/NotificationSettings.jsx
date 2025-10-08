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
      name: "comments",
      label: "Comments",
      description: "When someone comments on your videos",
    },
    {
      name: "likes",
      label: "Likes",
      description: "When someone likes your content",
    },
    {
      name: "newFollowers",
      label: "New Followers",
      description: "When someone follows you",
    },
    {
      name: "mentions",
      label: "Mentions",
      description: "When someone mentions you",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 rounded-tl-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-5xl mx-auto rounded-tl-2xl"
      >
        <div className="px-3 sm:px-6 mb-6 max-w-120 space-y-4 mt-5">
          {fields.map((field) => (
            <Controller
              key={field.name}
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <div className="flex items-center justify-between gap-1 ">
                  <div>
                    <p className="font-medium text-gray-900">
                      {field.label}
                    </p>
                    <p className="text-gray-500 text-sm leading-none">
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
