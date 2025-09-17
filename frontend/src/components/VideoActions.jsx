import React, { useState } from "react";
import { Share2, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
import Button from "./Button";

const VideoActions = ({ video }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-4 border-b border-[var(--color-borderColor)] gap-3 sm:gap-0">
      <div className="flex-1">
        <h1 className="text-lg sm:text-xl font-bold text-[var(--color-dark)] mb-1 pr-2 sm:pr-0">
          {video.title}
        </h1>
        <div className="flex items-center gap-2 sm:gap-4 text-[var(--color-primary-dull)] text-xs sm:text-sm font-medium">
          <span>{video.views} views</span>
          <span>•</span>
          <span>{video.timestamp}</span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-1 sm:gap-2 flex-shrink-0">
        <div className="flex items-center bg-[var(--color-light)] rounded-full border border-[var(--color-borderColor)] shadow-sm">
          <button
            onClick={handleLike}
            className={`flex items-center cursor-pointer gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-l-full transition-colors font-semibold text-sm sm:text-base ${
              liked
                ? " text-red-300"
                : " text-primary"
            }`}
            style={{ outline: 'none', border: 'none' }}
          >
            <ThumbsUp size={16} className={`sm:w-5 sm:h-5 ${liked ? "fill-primary text-purple-500" : ""}`} />
            <span className="hidden xs:inline">{video.likes}</span>
          </button>
          <div className="w-px h-4 sm:h-6 bg-[var(--color-borderColor)]"></div>
          <button
            onClick={handleDislike}
            className={`flex items-center cursor-pointer gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-r-full transition-colors font-semibold text-sm sm:text-base ${
              disliked
                ? " text-red-500"
                : "text-[var(--color-primary-dull)]  "
            }`}
            style={{ outline: 'none', border: 'none' }}
          >
            <ThumbsDown size={16} className={`sm:w-5 sm:h-5 ${disliked ? "fill-red-600 text-red-700 " : ""}`} />
          </button>
        </div>
                      
        <Button variant="secondary" size="sm" className="bg-primary border border-[var(--color-borderColor)] text-gray-800 hover:bg-[var(--color-primary)] hover:text-white transition-colors font-semibold px-2 sm:px-4">
          <Share2 size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline ml-1">Share</span>
        </Button>

        <button className="p-1.5 sm:p-2 hover:bg-[var(--color-light)] rounded-full text-[var(--color-dark)] transition-colors">
          <MoreVertical size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default VideoActions;