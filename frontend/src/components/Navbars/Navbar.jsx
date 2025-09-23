import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Play,
  Search,
  MessageCircleMore,
  Upload,
  Menu,
  User,
  Mic,
  Sun,
  Moon,
  X,
  SendHorizonal,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import MobSearchNav from "./MobSearchNav";
import { AppContext } from "../../context/context";
import TooltipButton from "../TooltipButton";

const Navbar = () => {
  const { setSidebarOpen, showNotification, setShowNotification } =
    useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const inputRef = useRef(null);

  const params = useLocation();

  // Navbar hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleClearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  if (showMobileSearch) {
    return (
      <MobSearchNav
        isVisible={showMobileSearch}
        onClose={() => setShowMobileSearch(false)}
        initialQuery={searchQuery}
      />
    );
  }

  const printLog = () => {
    console.log("Hello from printLog");
    console.log(params);
  };

  return (
    <header
      className={`bg-white border-b z-20 sticky top-0 left-0 right-0 border-gray-200 px-2 sm:px-4 h-12 max-sm:h-10 w-full flex justify-between transition-transform duration-300 ease-in-out  ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Left: Sidebar + Logo */}
      <div className="flex items-center gap-1 sm:gap-4">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-1.5 sm:p-2 cursor-ew-resize"
        >
          <Menu size={18} className="sm:w-5 sm:h-5" />
        </button>

        <Link to="/" className="flex items-center min-w-fit">
          <img
            className="w-5 h-5 sm:w-7 sm:h-7"
            src="/favicon.webp"
            alt="VideoTube Logo"
          />
          <div className="flex items-end text-base sm:text-xl ml-1">
            <span className="logo-video z-10">
              V<span className="hidden xs:inline">ideo</span>
            </span>
            <span className="logo-tube max-sm:-ml-[1px]">
              T<span className="hidden xs:inline">ube</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Middle: Search */}
      <div className="flex-1 flex items-center gap-1 sm:gap-2 max-w-full overflow-hidden md:ml-10 max-sm:ml-7 max-xs:ml-5  justify-end">
        <div className="flex-1 max-w-full xs:max-w-xs sm:max-w-xl lg:max-w-[55%] sm:mx-8 border bg-purple-100 border-purple-100 rounded-full px-[0.1rem] py-[0.05rem] shadow-sm">
          <div className="relative w-full  ">
            {/* Desktop Search */}
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2 sm:px-4 py-1 sm:py-1.5 pl-8 sm:pl-10 pr-10 sm:pr-12 bg-gray-50 text-sm sm:text-base rounded-full focus:outline-none focus:ring-2 max-xs:hidden focus:ring-purple-500"
            />
            {/* Mobile Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={() => setShowMobileSearch(true)}
              className="xs:hidden w-full px-2 py-1 sm:pr-12 bg-gray-50 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {/* Search Icons */}
            <Search
              className="max-xs:hidden xs:absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Search
              className="xs:hidden max-xs:absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
              onClick={() => setShowMobileSearch(true)}
            />

            {/* Clear Search */}
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-8 sm:right-10 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}

            {/* Mic / Send */}
            <button
              type="button"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-purple-50 text-gray-500 hover:bg-gray-100 shadow-sm flex items-center justify-center"
              title={`${searchQuery ? "Send" : "Voice search"}`}
            >
              {searchQuery ? <SendHorizonal size={18} /> : <Mic size={18} />}
            </button>
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex sm:flex-row-reverse items-center gap-1 sm:gap-2 flex-shrink-0 duration-1000 transition-all ease-in-out">
          <div className="flex items-center rounded-full  bg-purple-50 text-pretty  text-primary">
            <TooltipButton
              tooltipText="Upload Video"
              className={`rounded-full p-1.5 transition-colors duration-200 
                ${params.pathname === "/upload" &&  !showNotification  && "bg-primary text-white"}`}
              position="side"
            >
              <Link to="/upload">
                <Upload size={22} />
              </Link>
            </TooltipButton>
            <TooltipButton
              tooltipText="Notifications (1)"
              className={`rounded-full p-1.5 transition-colors duration-200 cursor-pointer ${
                showNotification && "bg-primary text-white"
              }`}
              position="side"
              onClick={() => setShowNotification(!showNotification)}
            >
              <MessageCircleMore size={22} />
            </TooltipButton>
          </div>

          <Link to="/settings">
            <button className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer">
              <User size={24} className="text-white " />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
