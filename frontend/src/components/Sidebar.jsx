import React, { useContext } from "react";
import { Heart, Home, Compass, Clock, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/context";

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useContext(AppContext);

  const menuItems = [
    { icon: Home, label: "Home", path: "/", active: false },
    { icon: Compass, label: "Explore", path: "/explore", active: true },
    { icon: Clock, label: "History", path: "/history", active: false },
    { icon: Heart, label: "Liked Videos", path: "/liked", active: false },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 "
        ></div>
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200  
          sm:w-58 w-50 transform transition-transform duration-300 z-50 cursor-ew-resize
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        onClick={() => {
          setSidebarOpen(!sidebarOpen);
        }}
      >
        <div className="px-2 my-1.5">
          <div className="flex pl-2 items-center gap-4 ">
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu size={20} />
            </button>

            {/* logo + text */}
            <Link to="/" className="flex items-center w-30 justify-center ">
              <img
                className="w-7 h-7 cursor-pointer"
                src="/favicon.webp"
                alt="VideoTube Logo"
              />
              <div className="flex justify-center items-end cursor-pointer text-xl">
                <span className="logo-video">Video</span>
                <span className="logo-tube">Tube</span>
              </div>
            </Link>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1 border-t border-gray-200 mt-2 pt-2 px-1 ">
            {menuItems.map((item) => (
              <Link
                to={item.path}
                key={item.label}
                className={`w-full flex items-center justify-start gap-3 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  item.active
                    ? "bg-purple-50 text-primary"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 pt-2 border-t border-gray-200 ">
            <h3 className="text-sm font-semibold text-gray-500 mb-1">
              SUBSCRIPTIONS
            </h3>
            <div className="space-y-1">
              {["TechChannel", "MusicHub", "GameZone"].map((channel) => (
                <Link
                  to={`/channel/${channel.toLowerCase()}`}
                  key={channel}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 "
                >
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">{channel[0]}</span>
                  </div>
                  <span className="text-gray-700 text-sm">{channel}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
