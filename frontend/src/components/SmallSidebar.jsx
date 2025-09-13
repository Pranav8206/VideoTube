import React from "react";
import { Home, Compass, Clock, Heart } from "lucide-react";

const SmallSidebar = () => {
  const menuItems = [
    { icon: Home, label: "Home", active: false },
    { icon: Compass, label: "Explore", active: true },
    { icon: Clock, label: "History", active: false },
    { icon: Heart, label: "Liked", active: false },
  ];

  return (
    <aside
      className={`
         h-[calc(100vh-3rem)] fixed top-12 border bg-white  border-r border-gray-100 max-sm:hidden w-18 
      `}
    >
      <div className="px-2 py-1.5">
        {/* Menu Items */}
        <nav className="space-y-4  pt-2 px-1 ">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`w-full  flex-col  items-center justify-center mx-auto  py-1 rounded-lg  cursor-pointer text-xs ${
                item.active
                  ? "bg-purple-50  text-primary "
                  : "hover:bg-gray-100  text-gray-700 "
              }`}
            >
              <item.icon className=" mx-auto" size={24} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-4 pt-2 border-t border-gray-100 ">
          <h3 className="text-sm font-semibold overflow-clip  text-ellipsis text-gray-500  mb-1" title="SUBSCRIPTIONS">
            SUBSCRIPTIONS
          </h3>
          <div className="space-y-1">
            {["TechChannel", "MusicHub", "GameZone"].map((channel) => (
              <button
                key={channel}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">{channel[0]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SmallSidebar;
