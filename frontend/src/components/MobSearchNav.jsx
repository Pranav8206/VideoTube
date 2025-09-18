import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Search, Mic, X } from "lucide-react";

const MobSearchNav = ({ isVisible, onClose, initialQuery = "" }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const inputRef = useRef(null);

  // Auto-focus the input when component becomes visible
  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  // Handle escape key to close search
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose]);

  const handleClearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log("Searching for:", searchQuery);
      // You can add your search logic here
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-10 flex items-center px-2 sm:hiddensm:px-4 w-full  justify-between">
      {/* Back Arrow */}
      <button
        onClick={onClose}
        className="p-2 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer mr-1"
        aria-label="Go back"
      >
        <ArrowLeft size={16} className="text-gray-700" />
      </button>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex-1 relative">
        <div className="relative">
          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-20 bg-gray-50 border border-purple-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          
          {/* Search Icon (left) */}
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          
          {/* Right side icons container */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Clear button - only show when there's text */}
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            
            {/* Mic Icon */}
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-purple-50 text-gray-500 hover:bg-gray-100 shadow-sm cursor-pointer"
              title="Voice search"
              aria-label="Voice search"
            >
              <Mic size={18} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MobSearchNav;