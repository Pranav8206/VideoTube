// VideoCard.jsx
import React, { useState } from "react";
import { MoreVertical, Play } from "lucide-react";

const VideoCard = ({ video, layout = "list" }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (layout === "list") {
    return (
      <div className="flex cursor-pointer px-3 py-3 gap-3 bg-white hover:bg-gray-50 rounded-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:shadow-md">
        <div className="flex gap-3 justify-between w-full">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0 w-40 md:w-48">
            <div className="rounded-lg overflow-hidden bg-gray-100 shadow-sm aspect-video">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover aspect-16/9"
              />
            </div>
            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
              {video.duration}
            </span>
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm sm:text-base leading-snug hover:text-purple-600 transition-colors">
              {video.title}
            </h3>
            <p className="text-purple-600 text-xs sm:text-sm font-medium">
              {video.channel}
            </p>
            <p className="text-gray-500 text-xs">
              {video.views} • {video.timestamp}
            </p>
          </div>
          <button className="p-1.5 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex-shrink-0">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 w-full flex flex-col cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative">
        <div className="w-full bg-gray-100 overflow-hidden aspect-video">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">
          {video.duration}
        </span>

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[2px] transition-all duration-300">
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium transition-all duration-200 flex items-center gap-2 px-4 py-2 text-sm rounded-lg transform hover:scale-105 shadow-lg">
              <Play size={14} className="fill-current" />
              Play
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex gap-3 items-start">
        <img
          src={video.channelAvatar}
          alt={video.channel}
          className="w-9 h-9 rounded-full flex-shrink-0 object-cover ring-2 ring-gray-100"
        />
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-snug hover:text-purple-600 transition-colors">
            {video.title}
          </h3>
          <p className="text-purple-600 text-xs font-medium">{video.channel}</p>
          <p className="text-gray-500 text-xs">
            {video.views} • {video.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
