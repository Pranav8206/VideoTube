// VideoCard.jsx
import React, { useState } from "react";
import { Download, Flag, Clock, Minus, MoreVertical, Play } from "lucide-react";

const VideoCard = ({ video, layout = "list", onRemove, inSubscription }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const isList = layout === "list";

  return (
    <div
      className={`bg-white w-full rounded-xl border border-gray-100 transition-all duration-300 cursor-pointer hover:border-gray-200 hover:shadow-md
        ${
          isList
            ? "flex justify-between gap-4 hover:bg-gray-50 my-1"
            : "flex-col w-full group overflow-hidden"
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowOptions(false);
      }}
    >
      {/* Thumbnail */}
      <div
        className={`relative ${
          isList
            ? "flex-shrink-0 w-40 sm:w-56 md:w-64 lg:w-75 h-full max-xs:max-w-[50%]"
            : ""
        }`}
      >
        <div
          className={`overflow-hidden bg-gray-100 aspect-video ${
            isList ? "rounded-l-lg shadow-sm" : ""
          }`}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isList ? "" : "group-hover:scale-105"
            }`}
          />
        </div>

        {/* Duration overlay */}
        <span
          className={`absolute bg-black/80 text-white rounded font-medium text-[10px] sm:text-xs
            ${
              isList
                ? "bottom-1 right-1 px-1.5 py-0.5"
                : "bottom-2 right-2 px-2 py-1 backdrop-blur-sm"
            }`}
        >
          {video.duration}
        </span>

        {/* Play overlay on hover */}
        {isHovered && (
          <div
            className={`absolute inset-0 bg-black/20 flex items-center justify-center ${
              isList ? "rounded-l-lg" : "rounded-t-lg"
            } `}
          >
            <div
              className={`bg-white rounded-full flex items-center justify-center shadow-lg 
              ${isList ? "w-8 h-8" : "w-12 h-12"}`}
            >
              <Play
                size={isList ? 20 : 28}
                className="fill-primary text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Info + Actions */}
      <div
        className={`flex-1 ${
          isList
            ? "flex xs:px-2 sm:px-3 pt-2 justify-between"
            : "p-2 sm:p-3 flex items-start gap-3"
        }`}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <h3
            className={`font-semibold text-gray-900 line-clamp-2 leading-snug
              text-xs s:text-sm sm:text-base md:text-lg `}
          >
            {video.title}
          </h3>
          <div className="flex items-start justify-start gap-2">
            {/* Wrap avatar in a group */}
            <div className="group">
              <img
                src={video.channelAvatar}
                alt={video.channel}
                className="rounded-full w-6 h-6 sm:w-8 sm:h-8 cursor-pointer"
              />
            </div>

            <div className="flex flex-col items-start content-start">
              <p
                className={`text-primary font-medium md:font-semibold text-xs sm:text-sm cursor-pointer transition-colors duration-300 
        ${isList ? "md:text-base" : ""} 
        group-hover:text-purple-600`}
              >
                {inSubscription ? video.channel?.name : video.channel}
              </p>
              <p
                className={`text-gray-500 text-[11px] sm:text-xs flex flex-wrap   gap-x-1 tracking-tighter  
        ${isList ? "md:text-sm" : ""}`}
              >
                <span>{video.views}</span>
                <span>•</span>
                <span>{video.timestamp}</span>
              </p>
            </div>
          </div>
        </div>

        {/* More button (only in list) */}
        <div
          className={`flex ${isList ? "items-start" : "items-center"} gap-1`}
        >
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions((s) => !s);
              }}
              className="sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100"
              aria-label="More"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </button>

            {showOptions && (
              <div
                className={`absolute right-0 ${
                  isList ? "top-8" : "bottom-6"
                } bg-white shadow-lg border border-gray-200 rounded-lg mx-1 z-10 w-40 sm:w-48`}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2">
                  <Clock size={16} />
                  Watch later
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Download size={16} />
                  Download
                </button>
                <hr className="text-gray-300" />
                <button className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-gray-50 rounded-b-lg flex items-center gap-2">
                  <Flag size={16} />
                  Report
                </button>
                {onRemove && <hr className="my-1" />}
                {onRemove && (
                  <button
                    onClick={() => onRemove(video.id)}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Minus size={16} />
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
