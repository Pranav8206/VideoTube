import React from "react";
import { Link } from "react-router-dom";
import { menuItems } from "../utils/videosData";

const SmallSidebar = () => {
  return (
    <aside
      className={`h-[calc(100vh-3rem)] bg-white max-sm:hidden w-20 sticky sm:top-12`}
    >
      <div className="px-2 py-1 h-full flex flex-col overflow-y-auto">
        {/* Menu Items */}
        <nav className="space-y-4 pt-2 px-1 bg-white">
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.label}
              className={`w-full flex-col items-center justify-center mx-auto py-1 rounded-lg cursor-pointer text-xs flex ${
                item.active ? "bg-purple-50 text-primary" : " text-gray-700"
              }`}
            >
              <item.icon className="mx-auto" size={24} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Subscriptions */}
        <div className="mt-4 pt-2 border-t border-gray-100">
          <h3
            className="text-sm font-semibold overflow-clip text-ellipsis text-gray-500 mb-1"
            title="SUBSCRIPTIONS"
          >
            SUBSCRIPTIONS
          </h3>
          <div className="space-y-1">
            {["TechChannel", "MusicHub", "GameZone"].map((channel) => (
              <Link
                to={`/c/${channel.toLowerCase()}`}
                key={channel}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">{channel[0]}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SmallSidebar;
