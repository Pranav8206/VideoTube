import React from "react";

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
    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {video.title}
        </h1>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <span>{video.views} views</span>
          <span>•</span>
          <span>{video.timestamp}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-l-full transition-colors ${
              liked
                ? "text-purple-600"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <ThumbsUp size={20} className={liked ? "fill-current" : ""} />
            {video.likes}
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
          <button
            onClick={handleDislike}
            className={`flex items-center gap-2 px-4 py-2 rounded-r-full transition-colors ${
              disliked
                ? "text-red-600"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <ThumbsDown size={20} className={disliked ? "fill-current" : ""} />
          </button>
        </div>

        <Button variant="secondary" size="md">
          <Share2 size={16} />
          Share
        </Button>

        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default VideoActions;
