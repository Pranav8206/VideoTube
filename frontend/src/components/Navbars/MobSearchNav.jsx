import React, { useState, useEffect, useRef, useContext } from "react";
import {
  ArrowLeft,
  Search,
  Mic,
  X,
  SendHorizonal,
  MoreVertical,
} from "lucide-react";
import { AppContext } from "../../context/context";

const MobSearchNav = ({ showMobileSearch, onClose, handleSearch }) => {
  const {
    searchQuery,
    setSearchQuery,
    showingSearchResults,
    setShowingSearchResults,
  } = useContext(AppContext);
  const inputRef = useRef(null);

  // Auto-focus the input when component becomes visible
  useEffect(() => {
    if (showMobileSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showMobileSearch]);

  // Handle escape key to close search
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && showMobileSearch) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showMobileSearch, onClose]);

  const handleClearSearch = () => {
    setSearchQuery("");
    showMobileSearch = true;
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

  if (!showMobileSearch) return null;

  return (
    <div
      className={`fixed mb-10 top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-10 flex items-center px-2 sm:hidden sm:px-4 w-full  justify-between transform transition-all duration-300 ease-in-out`}
    >
      {/* Back Arrow */}
      <button
        onClick={onClose}
        className="p-2 rounded-lg transition-colors cursor-pointer mr-1"
        aria-label="Go back"
      >
        <ArrowLeft size={16} className="text-gray-700" />
      </button>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex-1 relative">
        <div className="border relative flex bg-purple-100 border-purple-100 rounded-full px-[0.1rem] py-[0.05rem]">
          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowingSearchResults(false);
            }}
            className={`w-full px-2 py-1 pl-6 ${
              showingSearchResults ? "pr-8" : "pr-12"
            } bg-gray-50 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          />

          {/* Search Icon (left) */}
          <Search
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />

          {/* Clear button */}
          {searchQuery && !showingSearchResults && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full  text-gray-500 flex items-center justify-center transition-colors cursor-pointer "
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {/* Mic Icon */}
          <button
            type="button"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-purple-50 text-gray-500 hover:bg-gray-100 shadow-sm flex items-center justify-center cursor-pointer"
            title={`${searchQuery ? "Send" : "Voice search"}`}
          >
            {searchQuery && !showingSearchResults ? (
              <SendHorizonal onClick={handleSearch} size={18} />
            ) : (
              <Mic size={18} />
            )}
          </button>
        </div>
      </form>
      {showingSearchResults && (
        <button className="p-2 rounded-lg transition-colors cursor-pointer ml-1">
          <MoreVertical size={16} className="text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default MobSearchNav;
