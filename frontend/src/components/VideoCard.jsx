import React, { useState } from "react";
import { MoreVertical, Play } from "lucide-react";
import Button from "./Button";

const VideoCard = ({ video, layout = "list" }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (layout === "list") {
    return (
      <div className="flex cursor-pointer px-2 py-1 gap-4  bg-white hover:bg-[var(--color-primary-dull)]/3 rounded-xl transition-all duration-200 border border-white hover:border-gray-100">
        <div className="flex gap-4 justify-between w-full">
          <div className="relative flex-shrink-0">
            <div className="aspect-w-16 aspect-h-9 w-52 rounded-lg overflow-hidden bg-gray-50">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-52 h-28 object-cover"
              />
            </div>
            <span className="absolute bottom-1.5 right-1.5 bg-[var(--color-dark)]/90 text-white text-xs px-1.5 py-0.5 rounded-sm font-medium">
              {video.duration}
            </span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
            <h3 className="font-medium text-[var(--color-dark)] line-clamp-2 text-base leading-tight">
              {video.title}
            </h3>
            <p className="text-[var(--color-primary)] text-sm font-medium">
              {video.channel}
            </p>
            <p className="text-[var(--color-primary-dull)] text-xs">
              {video.views} • {video.timestamp}
            </p>
          </div>
          <button className="p-2 w-5 h-5 cursor-pointer rounded-full text-[var(--color-dark)] transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-white hover:border-gray-100 hover:shadow-lg transition-all duration-300 max-w-xs w-full flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 w-full h-32 bg-gray-50">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="absolute bottom-2 right-2 bg-[var(--color-dark)]/90 text-white text-xs px-1.5 py-0.5 rounded-sm font-medium">
          {video.duration}
        </span>
        {isHovered && (
          <div className="absolute inset-0 bg-[var(--color-dark)]/20 flex items-center justify-center backdrop-blur-[1px] transition-all duration-200">
            <Button
              variant="primary"
              size="sm"
              className="rounded-full px-4 py-2 shadow-lg bg-purple-500"
            >
              <Play size={16} className="mr-1" />
              Play
            </Button>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex gap-3 items-start">
          <img
            src={video.channelAvatar}
            alt={video.channel}
            className="w-9 h-9 rounded-full flex-shrink-0 object-cover"
          />
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="font-medium text-[var(--color-dark)] line-clamp-2 text-sm leading-tight">
              {video.title}
            </h3>
            <p className="text-[var(--color-primary)] text-xs font-medium">
              {video.channel}
            </p>
            <p className="text-[var(--color-primary-dull)] text-xs">
              {video.views} • {video.timestamp}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
