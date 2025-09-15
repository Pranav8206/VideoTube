import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Search,
  MessageCircleMore,
  Upload,
  Menu,
  User,
  Mic,
} from "lucide-react";
import Button from "./Button";

const Navbar = ({ setSidebarOpen={setSidebarOpen} }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white border-b z-1000 sticky top-0 border-gray-200 px-4 h-12">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-4 ">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 hover:bg-purple-100  rounded-lg transition-colors cursor-pointer"
          >
            <Menu size={20} />
          </button>

          {/* logo + text */}
          <div className="flex items-center w-30 justify-center ">
            <img
              className="w-7 h-7 cursor-pointer"
              src="/favicon.webp"
              alt="VideoTube Logo"
            />
            <div className="flex justify-center items-end cursor-pointer text-xl">
              <span className="logo-video">Video</span>
              <span className="logo-tube">Tube</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl my-1 mx-8 border bg-purple-100 border-purple-100 rounded-full px-[0.1rem] py-[0.05rem] shadow-sm">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-1.5 pl-10 pr-12 bg-gray-50  rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {/* Search Icon (left) */}
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            {/* Mic Icon (right) */}
            <button
              type="button"
              className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-purple-50 text-gray-500 hover:bg-gray-100 shadow-sm cursor-pointer"
              title="Voice search"
            >
              <Mic size={20} />
            </button>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          {/* Upload Button */}
          <Button variant="info" size="sm">
            <Upload size={16} />
            Upload
          </Button>
          {/* Notifications */}
          <button className="p-1.5 py-1.5 rounded-full transition-colors relative text-sm cursor-pointer bg-purple-100 ">
            <MessageCircleMore size={25} />
            <span className="absolute -top-1 -right-2 w-4.5 h-4.5 bg-primary rounded-full items-center justify-center text-[15px] ">
              1
            </span>
          </button>
          {/* User Avatar */}
          <button className="w-8 h-8 bg-primary  cursor-pointer rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
