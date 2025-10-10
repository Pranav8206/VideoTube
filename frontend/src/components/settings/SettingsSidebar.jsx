import React from "react";
import { User, Shield, Bell, Lock, Play, Video } from "lucide-react";

const SettingsSidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "my-videos", label: "Your", icon: Video },
  ];

  return (
    <div
      className={`sm:sticky sm:top-0 max-sm:bg-gray- max-sm:w-screen max-sm:flex 
        sm:h-screen sm:w-44 py-1 sm:p-2 sm:py-5 transition-all duration-300`}
    >
      <nav className="sm:space-y-2 max-s:gap-x-2 max-sm:gap-x-4 max-sm:mx-auto max-sm:flex max-sm:items-end max-sm:justify-end transition-all duration-300">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              aria-current={isActive ? "true" : "false"}
              className={`w-full flex items-center sm:gap-3  p-2 sm:p-3 rounded-xl text-left justify-center sm:justify-start cursor-pointer ${
                isActive
                  ? "sm:bg-gradient-to-r sm:from-primary sm:to-purple-500 max-sm:bg-primary text-white"
                  : "text-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span
                className={`font-medium sm:text-base hidden sm:inline transition-all duration-300 ${
                  isActive ? "max-sm:inline" : "max-sm:hidden"
                } ml-2`}
              >
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
