import React from "react";
import { User, Shield, Bell, Lock, Play } from "lucide-react";

const SettingsSidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Lock },
  ];

  return (
    <div className="sticky top-0 h-screen sm:w-50 p-2 py-5 transition-all duration-300">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-0 sm:gap-3 px-2 sm:px-4 py-3 rounded-xl text-left transition-all duration-200 justify-center sm:justify-start cursor-pointer ${
                isActive
                  ? "sm:bg-gradient-to-r sm:from-primary sm:to-purple-500 max-sm:bg-primary text-white shadow-lg shadow-purple-500/30"
                  : "text-gray-700"
              }`}
            >
              <Icon className="w-5 h-5 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline font-medium text-sm sm:text-base">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SettingsSidebar;
