import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Search,
  MessageCircleMore,
  Upload,
  Menu,
  User,
  Mic,
  X,
  SendHorizonal,
  MoreVertical,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MobSearchNav from "./MobSearchNav";
import { AppContext } from "../../context/context";
import TooltipButton from "../TooltipButton";

const Navbar = () => {
  const {
    setSidebarOpen,
    showNotification,
    setShowNotification,
    searchQuery,
    setSearchQuery,
    showingSearchResults,
    setShowingSearchResults,
    user,
    setShowVoiceSearchBox,
  } = useContext(AppContext);

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const inputRef = useRef(null);
  const params = useLocation();
  const navigate = useNavigate();

  // Navbar hide/show on scroll
  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    
  }, [user])
  

  const handleClearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/s/${searchQuery}`);
      setShowingSearchResults(true);
    } else {
      setShowingSearchResults(false);
    }
    inputRef.current?.blur();
  };

  if (showMobileSearch && window.innerWidth < 475) {
    return (
      <header
        className={`bg-white z-20 sticky top-0 left-0 right-0 px-2 sm:px-4 h-12 max-sm:h-10 w-full flex justify-between transition-transform duration-300 ease-in-out ${
          isVisible || searchQuery ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <MobSearchNav
          showMobileSearch={showMobileSearch}
          onClose={() => {
            setShowMobileSearch(false);
            navigate("/");
            setShowingSearchResults(false);
            setSearchQuery("");
          }}
          handleSearch={handleSearch}
        />
      </header>
    );
  }

  return (
    <header
      className={`bg-white z-40 sticky top-0 left-0 right-0 px-2 sm:px-4 h-12 max-sm:h-10 w-full flex justify-between transition-transform duration-300 ease-in-out  ${
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

        <Link
          onClick={() => {
            setShowingSearchResults(false);
            setSearchQuery("");
          }}
          to="/"
          className="flex items-center min-w-fit"
        >
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
          <form onSubmit={handleSearch} className="relative w-full">
            {/* Desktop Search */}
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowingSearchResults(false);
              }}
              className="w-full px-2 sm:px-4 py-1 sm:py-1.5 pl-8 sm:pl-10 pr-10 sm:pr-13 bg-gray-50 text-sm sm:text-base rounded-full focus:outline-none focus:ring-2 max-xs:hidden focus:ring-purple-500 focus:border-transparent"
            />
            {/* Mobile Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowingSearchResults(false);
              }}
              placeholder="...."
              onClick={() => setShowMobileSearch(true)}
              className="xs:hidden w-full px-2 py-1 pl-5 pr-10 bg-gray-50 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            {searchQuery && !showingSearchResults && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-7 sm:right-10 top-1/2 -translate-y-1/2  rounded-full  text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}

            {/* Mic / Send */}
            <div
              className="absolute right-1 max-sm:right-0.5 top-1/2 -translate-y-1/2 max-sm:size-6 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-purple-50 text-gray-500 hover:bg-gray-100 shadow-sm flex items-center justify-center cursor-pointer"
              title={`${searchQuery ? "Send" : "Voice search"}`}
            >
              {searchQuery && !showingSearchResults ? (
                <button type="submit" className="cursor-pointer">
                  <SendHorizonal size={18} />
                </button>
              ) : (
                <Mic
                  onClick={() => {
                    setShowVoiceSearchBox(true);
                  }}
                  size={18}
                />
              )}
            </div>
          </form>
        </div>

        {/* Right Side Icons */}

        {showingSearchResults && searchQuery ? (
          <button className="p-2 rounded-lg transition-colors cursor-pointer ml-1">
            <MoreVertical size={16} className="text-gray-700" />
          </button>
        ) : (
          <div className="flex sm:flex-row-reverse items-center gap-1 sm:gap-2 flex-shrink-0 duration-1000 transition-all ease-in-out">
            <div className="flex items-center rounded-full  bg-purple-50 text-pretty  text-primary">
              <TooltipButton
                tooltipText="Upload Video"
                className={`rounded-full p-1 transition-colors duration-200 
                ${
                  params.pathname === "/upload" &&
                  !showNotification &&
                  "bg-primary text-white"
                }`}
                position="side"
              >
                <Link to="/upload">
                  <Upload size={20} />
                </Link>
              </TooltipButton>

              <TooltipButton
                tooltipText="Notifications"
                className={`rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                  showNotification && "bg-primary text-white"
                }`}
                position="side"
                onClick={() => setShowNotification(!showNotification)}
              >
                <MessageCircleMore size={20} />
              </TooltipButton>
            </div>

            <Link to="/setting">
              <button className="w-7 h-7  border border-gray-400 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer">
                {console.log("aldjfsdf", user)}
                {!user ? (
                  <User
                    size={24}
                    className="text-gray-100 bg-gray-400 h-full w-full rounded-full"
                    fill="#f3f4f6"
                    strokeWidth={2}
                  />
                ) : (
                  <img
                    src={`${user?.avatar}?v=${Date.now()}`}
                    alt="user"
                    className="overflow-hidden rounded-full w-7 h-7 object-cover"
                  />
                )}
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
