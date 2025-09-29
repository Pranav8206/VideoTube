import React from "react";
import { useForm, Controller } from "react-hook-form";
import ToggleSwitch from "./ToggleSwitch";

const NotificationSettings = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      comments: true,
      likes: false,
      newFollowers: true,
      mentions: true,
    },
  });

  const onSubmit = (data) => {
    console.log("Saved notification settings:", data);
    // API call can be added here
  };

  const sections = [
    {
      title: "General Notifications",
      fields: [
        {
          name: "emailNotifications",
          label: "Email Notifications",
          description: "Receive notifications via email",
        },
        {
          name: "pushNotifications",
          label: "Push Notifications",
          description: "Receive push notifications on your device",
        },
      ],
    },
    {
      title: "Activity Notifications",
      fields: [
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
      ],
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto"
    >
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Notification Settings
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
      </div>

      <div className="space-y-6 max-w-2xl">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              {section.title}
            </h3>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  render={({ field: controllerField }) => (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <div>
                        <p className="font-medium text-gray-800 text-sm sm:text-base">
                          {field.label}
                        </p>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          {field.description}
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={controllerField.value}
                        onChange={controllerField.onChange}
                      />
                    </div>
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
      >
        Save Changes
      </button>
    </form>
  );
};

export default NotificationSettings;
