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
import MobSearchNav from "./MobSearchNav";

const Navbar = ({ setSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleSearchClick = () => {
    setShowMobileSearch(true);
  };

  const handleCloseMobileSearch = () => {
    setShowMobileSearch(false);
  };

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when at the top of the page
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide navbar when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  if (showMobileSearch) {
    return (
      <MobSearchNav
        isVisible={showMobileSearch}
        onClose={handleCloseMobileSearch}
        initialQuery={searchQuery}
      />
    );
  }

  return (
    <>
      <header 
        className={`bg-white border-b z-1000 sticky top-0 border-gray-200 px-2 sm:px-4 h-12 w-full flex justify-between max-sm:h-10 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-1.5 sm:p-2 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* logo + text */}
            <div className="flex items-center justify-center min-w-fit">
              <img
                className="w-5 h-5 sm:w-7 sm:h-7 cursor-pointer"
                src="/favicon.webp"
                alt="VideoTube Logo"
              />
              <div className="flex justify-center items-end cursor-pointer text-base sm:text-xl ml-1">
                <span className="logo-video z-10">
                  V
                  <span className="logo-video hidden xs:inline ">
                    ideo
                  </span>
                </span>
                <span className="logo-tube max-sm:-ml-[1px]">
                  T
                  <span className="logo-tube hidden xs:inline ">
                    ube
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between flex-1 gap-1 sm:gap-2 max-w-full overflow-hidden  md:ml-10 ml-2">
          {/* Search Bar */}
          <div className="flex-1 max-w-[4rem] xs:max-w-xs sm:max-w-xl lg:max-w-[55%] sm:mx-8 border bg-purple-100 border-purple-100 rounded-full px-[0.1rem] py-[0.05rem] shadow-sm w-1/2 container mx-auto">
            <div className="relative w-full">
              {/* Above Mobile */}
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2 sm:px-4 py-1 sm:py-1.5 pl-8 sm:pl-10 pr-10 sm:pr-12 bg-gray-50 text-sm sm:text-base rounded-full focus:outline-none focus:ring-2 max-xs:hidden  focus:ring-purple-500"
              />
              {/* For Mobile */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={handleSearchClick}
                className="xs:hidden w-full px-2 py-1  sm:pr-12 bg-gray-50 text-sm rounded-full focus:outline-none focus:ring-2   focus:ring-purple-500"
              />
              {/*[above mobile] Search Icon (left) */}
              <Search
                className="max-xs:hidden xs:absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400  "
                size={18}
              />
              {/* [Mobile search icon] */}
              <Search
                className="xs:hidden max-xs:absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={15}
                onClick={handleSearchClick}
              />
              {/* Mic Icon (right) */}
              <button
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-purple-50 text-gray-500 hover:bg-gray-100 shadow-sm cursor-pointer"
                title="Voice search"
              >
                <Mic size={14} className="sm:w-4.5 sm:h-4.5" />
              </button>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Button
              variant="info"
              size="sm"
              className="flex items-center bg-purple-50 transition-colors"
            >
              <Upload size={14} className="sm:w-4 sm:h-4" />
              <span className="ml-1 hidden  md:inline">Upload</span>
            </Button>

            {/* Notifications */}
            <button className="p-1 sm:p-1.5 rounded-full transition-colors relative cursor-pointer bg-purple-50">
              <MessageCircleMore size={16} className="sm:w-5 sm:h-5" />
              <span className="absolute -top-0.5 -right-1 w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 bg-primary rounded-full flex items-center justify-center text-xs sm:text-sm text-white">
                1
              </span>
            </button>

            {/* User Avatar */}
            <button className="w-6 h-6 sm:w-8 sm:h-8 bg-primary cursor-pointer rounded-full flex items-center justify-center flex-shrink-0">
              <User size={14} className="sm:w-4.5 sm:h-4.5 text-white" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;