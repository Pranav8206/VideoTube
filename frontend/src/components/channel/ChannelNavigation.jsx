import React, { useEffect } from "react";
import { Search, Grid, List } from "lucide-react";

const ChannelNavigation = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}) => {
  const tabs = ["Videos", "Playlists", "About"];

  // ✅ Force viewMode to "list" if screen is below custom "s" breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 550) {
        // assuming "s" breakpoint is 640px
        onViewModeChange("list");
      }
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onViewModeChange]);

  return (
    <div className="px-4 sm:px-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center justify-center md:justify-start flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-3 max-s:py-1 py-2 mx-1 font-semibold transition-all duration-300 relative cursor-pointer ${
                activeTab === tab ? "text-gray-800" : "text-gray-500"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Search and View Controls */}
        <div className="flex items-center gap-3 max-sm:mx-11 max-md:mx-20 md:w-auto ">
          {/* Search */}
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search channel videos"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3 py-2 pl-9 bg-gray-50 text-sm rounded-full border border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* View Mode Toggle (hidden below `s`) */}
          <button
            onClick={() =>
              onViewModeChange(viewMode === "grid" ? "list" : "grid")
            }
            className="hidden s:block p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            {viewMode === "grid" ? (
              <List className="w-5 h-5 text-gray-600" />
            ) : (
              <Grid className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelNavigation;
