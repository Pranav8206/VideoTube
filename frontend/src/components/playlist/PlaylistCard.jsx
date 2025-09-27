import { MoreVertical, Play } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PlaylistCard = ({ playlist, layout = "list", video, index, isPlaying,  onPlay, onRemove, showOptions }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isList = layout === "list";
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white w-full rounded-xl border border-gray-100 transition-all duration-300 cursor-pointer hover:border-gray-200 hover:shadow-md
        ${
          isList
            ? "flex justify-between gap-3 hover:bg-gray-50"
            : "flex-col w-full group overflow-hidden"
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/playlist/${playlist.id}`)}
    >
      {/* Playlist Thumbnail */}
      <div
        className={`relative ${
          isList ? "flex-shrink-0 w-36 sm:w-48 h-full" : ""
        }`}
      >
        <div
          className={`overflow-hidden bg-gray-100 aspect-video ${
            isList ? "rounded-lg shadow-sm" : ""
          }`}
        >
          <img
            src={playlist.thumbnail}
            alt={playlist.title}
            className={`w-full h-full object-cover transition-transform duration-300
              ${isList ? "" : "group-hover:scale-105"}`}
          />
        </div>

        <span
          className={`absolute bg-black/80 text-white rounded font-medium
            ${
              isList
                ? "bottom-1 right-1 text-[10px] sm:text-xs px-1.5 py-0.5"
                : "bottom-2 right-2 text-[10px] sm:text-xs px-2 py-1 backdrop-blur-sm"
            }`}
        >
          {playlist.videoCount} videos
        </span>

        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
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

      {/* Info */}
      {/* Info + Actions */}
      <div
        className={`flex-1 ${
          isList
            ? "flex xs:px-1 py-3 flex-col justify-start"
            : "p-3 flex gap-3 items-start"
        }`}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-xs xs:text-sm sm:text-base leading-snug">
            {playlist.title}
          </h3>
          <p className="text-gray-500 text-[11px] s:text-xs">
            {playlist.videoCount} • {playlist.views}
          </p>
        </div>
      </div>

      {/* More button (only in list) */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
        <div className="relative">
          <button
            onClick={() => setShowOptions((s) => !s)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
            aria-label="More"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {showOptions && (
            <div className="absolute right-0 top-10 bg-white shadow-lg border border-gray-200 rounded-lg py-2 z-10 w-44">
              <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Add to favorites
              </button>
              <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download All
              </button>
              <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Report
              </button>
              <hr className="my-1" />
              <button
                onClick={() => onRemove(video.id)}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Minus className="w-4 h-4" />
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
