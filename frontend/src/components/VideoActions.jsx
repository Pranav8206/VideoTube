import React, { useState } from "react";
import { Share2, MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
import Button from "./Button";

const VideoActions = ( {video} ) => {
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
    <div className="flex items-center justify-between py-4 border-b border-[var(--color-borderColor)]">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-dark)] mb-1">
          {video.title}
        </h1>
        <div className="flex items-center gap-4 text-[var(--color-primary-dull)] text-sm font-medium">
          <span>{video.views} views</span>
          <span>•</span>
          <span>{video.timestamp}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[var(--color-light)] rounded-full border border-[var(--color-borderColor)] shadow-sm">
          <button
            onClick={handleLike}
            className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-l-full transition-colors font-semibold text-base ${
              liked
                ? " text-primary"
                : "text-[var(--color-primary)] "
            }`}
            style={{ outline: 'none', border: 'none' }}
          >
            <ThumbsUp size={20} className={`${liked ? "fill-current" : ""}`} />
            {video.likes}
          </button>
          <div className="w-px h-6 bg-[var(--color-borderColor)]"></div>
          <button
            onClick={handleDislike}
            className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-r-full transition-colors font-semibold text-base ${
              disliked
                ? " text-red-500"
                : "text-[var(--color-primary-dull)]  "
            }`}
            style={{ outline: 'none', border: 'none' }}
          >
            <ThumbsDown size={20} className={` ${disliked ? "fill-current" : ""}`} />
          </button>
        </div>

            
        <Button variant="secondary" size="md" className="bg-primary border border-[var(--color-borderColor)] text-gray-800  hover:bg-[var(--color-primary)] hover:text-white transition-colors font-semibold">
          <Share2 size={16} />
          Share
        </Button>

        <button className="p-2 hover:bg-[var(--color-light)] rounded-full text-[var(--color-dark)] transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default VideoActions;
