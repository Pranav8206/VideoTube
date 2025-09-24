import React, { useContext, useLayoutEffect } from "react";
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

  useLayoutEffect(() => {
    if (sidebarOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, -parseInt(top || "0"));
    }
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed w-full h-full inset-0 bg-black/60 z-20 "
        ></div>
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 sm:w-58 w-50 transform transition-transform duration-300 z-30 cursor-ew-resize
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <div className="px-1 sm:px-3 my-1.5  h-12 max-sm:h-10">
          <div className="flex items-center justify-between px-1 ">
            <div className="flex items-center gap-1 sm:gap-4">
              {/* Hamburger */}
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="p-1.5 sm:p-2 cursor-ew-resize"
              >
                <Menu size={18} className="sm:w-5 sm:h-5" />
              </button>

              {/* logo + text */}
              <Link
                to="/"
                className="flex items-center justify-center min-w-fit"
              >
                <img
                  className="w-5 h-5 sm:w-7 sm:h-7 cursor-pointer"
                  src="/favicon.webp"
                  alt="VideoTube Logo"
                />
                <div className="flex justify-center items-end cursor-pointer text-base sm:text-xl ml-1">
                  <span className="logo-video z-10">Video</span>
                  <span className="logo-tube max-sm:-ml-[1px]">Tube</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1 border-t border-gray-200 sm:mt-1.5 pt-2 px-1 ">
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
