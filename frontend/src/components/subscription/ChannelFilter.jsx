import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import TooltipButton from "../TooltipButton";

const ChannelFilter = ({ channels, activeFilter, setActiveFilter }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 2
      );
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, [channels]);

  return (
    <div className="relative flex items-end gap-2 mx-2 sm:mx-10 md:mx-15 md:px-5  ">
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute my-2 -left-2 z-10 px-1 py-3 rounded-full bg-gray-200 border border-purple-400 shadow-2xl hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          <ChevronLeft size={16} className="text-gray-800" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-end gap-2 overflow-x-auto scrollbar-hide scroll-smooth [scrollbar-width:none] [ms-overflow-style:none] sm:px-6  h-26"
      >
        {/* All Subscriptions Button */}
        <span className="flex flex-col gap-1 items-center">
          <span
            className={`border-primary h-fit w-fit rounded-full cursor-pointer flex items-center justify-center transition-all duration-100  ${
              activeFilter === "all" ? "border-4" : "border-2"
            }`}
          >
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex items-center justify-center rounded-full border transition-all duration-300 shadow-sm cursor-pointer ${
                activeFilter === "all"
                  ? "p-3 bg-purple-600 text-white border-purple-600 shadow-md"
                  : "p-2 m-1 bg-white text-gray-700 border-gray-200 hover:shadow"
              }`}
            >
              <span
                className={`text-sm font-medium transition-all duration-300 ${
                  activeFilter === "all" ? "text-white" : "text-gray-700"
                }`}
              >
                <span className="md:hidden ">ALL</span>
                <span className="max-md:hidden">All Subscription</span>
              </span>
            </button>
          </span>
          <div
            className={`h-1 w-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300  ${
              activeFilter === "all" ? "" : "hidden"
            }`}
          ></div>
        </span>

        {/* Channel Avatars */}
        {channels.map((channel) => (
          <TooltipButton
            tooltipText={channel.name}
            key={channel.id}
            className="flex flex-col items-center gap-1 "
          >
            <span
              key={channel.id}
              className={`${
                activeFilter === channel.id ? "border-4" : "border-2"
              } border-purple-600 transition-all duration-100 rounded-full flex  flex-shrink-0`}
            >
              <button
                onClick={() => setActiveFilter(channel.id)}
                className={`relative w-10 h-10 rounded-full transition-all duration-300 cursor-pointer ${
                  activeFilter === channel.id
                    ? "w-13 h-13 border-purple-600"
                    : "m-1 border-transparent"
                }`}
              >
                <img
                  src={channel.avatar}
                  alt={channel.name}
                  className="w-full h-full object-cover rounded-full"
                />
                {channel.newVideos > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                    {channel.newVideos}
                  </span>
                )}
              </button>
            </span>
            <div
              className={`h-1 w-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full  ${
                activeFilter === channel.id ? "" : "hidden"
              }`}
            ></div>
          </TooltipButton>
        ))}

        {/* More Dropdown */}
        {/* {channels.length > 6 && (
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300"
            >
              <Filter className="w-4 h-4" />
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="absolute top-12 right-0 bg-white shadow-lg border border-gray-200 rounded-lg py-2 z-20 w-48 max-h-64 overflow-y-auto">
                {channels?.slice(8, -1).map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setActiveFilter(channel.id);
                      setIsOpen(false);
                    }}
                    className="relative w-full flex items-center gap-3 px-4 py-2 hover:bg-purple-50 transition-colors duration-300"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={channel.avatar}
                        alt={channel.name}
                        className="w-full h-full object-cover"
                      />
                      {channel.newVideos > 0 && (
                        <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                          {channel.newVideos}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )} */}
      </div>

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute my-2 -right-2 z-10 flex-shrink-0 px-1 py-3 rounded-full bg-gray-200 border border-purple-400 shadow-2xl hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          <ChevronRight size={16} className="text-black" />
        </button>
      )}
    </div>
  );
};

export default ChannelFilter;
