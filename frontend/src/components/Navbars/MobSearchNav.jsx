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

  const handleClearSearch = () => {
    setSearchQuery("");
    showMobileSearch = true;
    inputRef.current?.focus();
  };

  if (!showMobileSearch) return null;

  return (
    <div
      className={`fixed mb-10 top-0 left-0 right-0 z-50 bg-white h-10 flex items-center px-2 sm:hidden sm:px-4 w-full  justify-between transform transition-all duration-300 ease-in-out`}
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
      <form
        onSubmit={(e) => {
          e.preventDefault(); // prevent page reload
          handleSearch(e); // call search function
          inputRef.current?.blur(); // remove focus from input
        }}
        className="flex-1 relative"
      >
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
          <div
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-purple-50 text-gray-500 hover:bg-gray-100 shadow-sm flex items-center justify-center cursor-pointer"
            title={`${searchQuery ? "Send" : "Voice search"}`}
          >
            {searchQuery && !showingSearchResults ? (
              <button type="submit" className="cursor-pointer">
                <SendHorizonal onClick={handleSearch} size={18} />
              </button>
            ) : (
              <Mic size={18} />
            )}
          </div>
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
