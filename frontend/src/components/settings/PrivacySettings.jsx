import React, { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

const PrivacySettings = () => {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    showEmail: false,
    allowMessages: true,
    showActivity: true,
  });

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const privacyItems = [
    {
      key: "profileVisibility",
      label: "Public Profile",
      desc: "Make your profile visible to everyone",
    },
    {
      key: "showEmail",
      label: "Show Email",
      desc: "Display email on your profile",
    },
    {
      key: "allowMessages",
      label: "Allow Messages",
      desc: "Let others send you direct messages",
    },
    {
      key: "showActivity",
      label: "Show Activity",
      desc: "Display your recent activity",
    },
  ];

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Privacy Settings
        </h1>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
      </div>

      {/* Privacy Options */}
      <div className="space-y-6 max-w-2xl">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Profile Privacy
          </h3>
          <div className="space-y-4">
            {privacyItems.map((item) => (
              <div
                key={item.key}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0"
              >
                <div>
                  <p className="font-medium text-gray-800 text-sm sm:text-base">
                    {item.label}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {item.desc}
                  </p>
                </div>
                <ToggleSwitch
                  checked={settings[item.key]}
                  onChange={() => handleToggle(item.key)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
