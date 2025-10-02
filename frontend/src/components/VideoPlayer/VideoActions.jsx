import React, { useState } from "react";
import { Share2, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
import Button from "../Button";

const VideoActions = ({ video }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    setLiked((prev) => !prev);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked((prev) => !prev);
    if (liked) setLiked(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className=" flex flex-col border-b border-gray-200 pb-2 mx-2">
      {/* Video Title + Meta */}
      <div className="mb-3 md-plus:px-1 sm:px-10 ">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {video.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">{video.views} views</span>
          <span className="text-gray-400">•</span>
          <span>{video.timestamp}</span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center gap-2 flex-wrap justify-between  md-plus:px-1 sm:px-10 ">
        {/* Like / Dislike Group */}
        <div className="flex items-center rounded-full bg-gray-100  transition-colors overflow-hidden">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
              liked ? "text-purple-600" : "text-gray-700"
            }`}
          >
            <ThumbsUp
              size={20}
              className={`transition-transform ${
                liked ? "fill-purple-600 scale-110" : ""
              }`}
            />
            <span className="hidden sm:inline">
              {formatCount(video.likes + (liked ? 1 : 0))}
            </span>
          </button>

          <div className="w-px h-6 bg-gray-300" />

          <button
            onClick={handleDislike}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
              disliked ? "text-red-600" : "text-gray-700"
            }`}
          >
            <ThumbsDown
              size={20}
              className={`transition-transform ${
                disliked ? "fill-red-600 scale-110" : ""
              }`}
            />
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100  text-gray-700 rounded-full font-medium text-sm transition-all cursor-pointer"
        >
          <Share2 size={20} />
          <span className="hidden sm:inline">
            {copied ? "Copied!" : "Share"}
          </span>
        </button>

        {/* More Options */}
        <button className="p-2.5 rounded-full bg-gray-100 cursor-pointer text-gray-700 transition-all">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default VideoActions;
