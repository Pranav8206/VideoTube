// VideoCard.jsx
import React, { useState } from "react";
import { MoreVertical, Play } from "lucide-react";

const VideoCard = ({ video, layout = "list" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isList = layout === "list";

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 transition-all duration-300 cursor-pointer hover:border-gray-200 hover:shadow-md
        ${isList ? "flex justify-between gap-3 hover:bg-gray-50" : "flex-col w-full group overflow-hidden"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div
        className={`relative ${isList ? "flex-shrink-0 w-36 sm:w-48 h-full" : ""}`}
      >
        <div
          className={`overflow-hidden bg-gray-100 aspect-video ${
            isList ? "rounded-lg shadow-sm" : ""
          }`}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover transition-transform duration-300
              ${isList ? "" : "group-hover:scale-105"}`}
          />
        </div>

        <span
          className={`absolute bg-black/80 text-white rounded font-medium
            ${isList ? "bottom-1 right-1 text-[10px] sm:text-xs px-1.5 py-0.5" : "bottom-2 right-2 text-[10px] sm:text-xs px-2 py-1 backdrop-blur-sm"}`}
        >
          {video.duration}
        </span>

        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
            <div
              className={`bg-white rounded-full flex items-center justify-center shadow-lg 
              ${isList ? "w-8 h-8" : "w-12 h-12"}`}
            >
              <Play size={isList ? 20 : 28} className="fill-primary text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Info + Actions */}
      <div
        className={`flex-1 ${isList ? "flex xs:px-1 py-3 flex-col justify-start" : "p-3 flex gap-3 items-start"}`}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-xs xs:text-sm sm:text-base leading-snug">
            {video.title}
          </h3>
          <p className="text-gray-500 text-[11px] s:text-xs">
            {video.views} • {video.timestamp}
          </p>
        </div>
      </div>

      {/* More button (only in list) */}
      {isList && (
        <button className="rounded-full hover:scale-110 transition">
          <MoreVertical size={20} />
        </button>
      )}
    </div>
  );
};

export default VideoCard;
