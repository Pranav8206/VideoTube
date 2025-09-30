import React, { useState } from "react";
import { User, ThumbsUp, ThumbsDown, ChevronDown } from "lucide-react";
import { sampleComments } from "../utils/videosData";

const CommentsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    console.log("New comment:", newComment);
    setNewComment("");
  };

  return (
    <section className="lg:min-w-[70vh] w-full overflow-hidden">
      {/* Comment Form */}
      <div className="px-4 sm:px-6 md:px-10 py-3 sm:py-4 shadow-xs">
        <div className="flex gap-3 sm:gap-5 items-start">
          {/* Avatar */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center shadow-md cursor-pointer">
            <User size={20} className="text-white sm:text-white " />
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={2}
              className="w-full p-1 sm:p-2 md:p-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-white/80 text-dark text-sm sm:text-base transition-all border border-primary"
            />
            <div className="flex justify-end ">
              <button
                onClick={handlePostComment}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-full hover:bg-primary-dull transition-colors duration-150 font-semibold shadow-md text-sm sm:text-base cursor-pointer"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="px-4 sm:px-6 md:px-10 py-6 space-y-4">
        {(showAll ? sampleComments : sampleComments.slice(0, 2)).map(
          (comment) => (
            <Comment key={comment.id} data={comment} />
          )
        )}

        {sampleComments.length > 2 && (
          <div className="text-center mt-7">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 mx-auto text-primary font-semibold text-sm sm:text-base  cursor-pointer"
            >
              {showAll ? "Show Less" : "Show More Comments"}
              <ChevronDown
                size={18}
                className={`transition-transform duration-150 ${
                  showAll ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const Comment = ({ data }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(data.likes || 0);

  const handleLike = () => {
    setLikes((prev) => prev + (liked ? -1 : 1));
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) {
      setLiked(false);
      setLikes((prev) => prev - 1);
    }
  };

  return (
    <div className="flex gap-3 sm:gap-5 items-start sm:p-2 ">
      <img
        src={data.avatar}
        alt={data.author}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full  object-cover cursor-pointer"
      />
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm sm:text-base text-dark cursor-pointer">
            {data.author}
          </span>
          <span className="text-xs sm:text-sm text-primary-dull">
            {data.timestamp}
          </span>
        </div>
        <p className="mb-2 text-sm sm:text-base text-dark">{data.text}</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2">
            <ThumbsUp
              size={18}
              className={`cursor-pointer transition-colors duration-150 text-primary ${
                liked ? "fill-primary stroke-1 stroke-purple-700" : ""
              }`}
              onClick={handleLike}
            />
            <span className="text-xs sm:text-sm font-semibold   text-primary w-7">
              {likes}
            </span>
          </span>
          <ThumbsDown
            size={18}
            className={`cursor-pointer transition-colors duration-150 text-primary ${
              disliked ? "fill-red-400 stroke-1 stroke-red-500" : ""
            }`}
            onClick={handleDislike}
          />
          <button className="text-xs sm:text-sm font-medium text-gray-600 cursor-pointer ">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
