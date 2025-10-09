import React from "react";

const SkeletonCard = () => {
  return (
    <div className="w-full rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-200 animate-pulse rounded-t-xl relative overflow-hidden">
        <div className="absolute bottom-2 right-2 h-4 w-10 bg-gray-300 rounded animate-pulse"></div>
      </div>

      {/* Info section */}
      <div className="p-1 flex justify-between">
        {/* Left side - avatar + text */}
        <div className="flex-col justify-between pl-1 w-full flex gap-1">
          <div className="space-y-1">
            <div className="h-4 w-4/5 bg-gray-300 animate-pulse rounded"> </div>
            <div className="h-4 w-4/5 bg-gray-300 animate-pulse rounded"> </div>
          </div>
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-300 animate-pulse shrink-0"></div>
            <div className="flex flex-col justify-center gap-1 justify-self-end h-full">
              <div className="h-3 w-36 bg-gray-300 animate-pulse rounded"></div>
              <div className="h-2 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>

        {/* Right side - menu button */}
        <div className="w-6 h-6 bg-gray-300 animate-pulse rounded-full self-end"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
