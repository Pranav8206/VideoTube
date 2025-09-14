import React, { useState } from "react";
import { User, ThumbsUp, ThumbsDown, ChevronDown } from "lucide-react";

// Sample comments data
const sampleComments = [
  {
    id: 1,
    author: "John Doe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    timestamp: "2 hours ago",
    text: "This is a great post! Thanks for sharing your insights.",
    likes: 12
  },
  {
    id: 2,
    author: "Jane Smith",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    timestamp: "4 hours ago",
    text: "I found this really helpful. Looking forward to more content like this.",
    likes: 8
  },
  {
    id: 3,
    author: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    timestamp: "1 day ago",
    text: "Excellent explanation! This clarified a lot of things for me.",
    likes: 15
  }
];

// Main Comments Section Component
function CommentsSection() {
  const [showAllComments, setShowAllComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Here you would typically add the comment to your state or send to API
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

  return (
    <section className="w-full px-0 sm:px-0">
      <div className="w-full bg-[var(--color-light)] rounded-2xl shadow-lg overflow-hidden border border-[var(--color-borderColor)]">
        {/* Header */}
  <div className="p-6 sm:p-10 border-b border-transparent bg-[var(--color-light)]">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-dark)] mb-1 tracking-tight">
            Comments <span className="text-[var(--color-primary)]">({sampleComments.length})</span>
          </h2>
          <p className="text-[var(--color-primary-dull)] text-base sm:text-lg">
            Join the discussion and share your thoughts
          </p>
        </div>

        {/* Comment Form */}
  <div className="p-6 sm:p-10 border-b border-transparent bg-transparent">
          <div className="flex gap-3 sm:gap-5 items-start">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-md">
              <User size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 sm:p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white/80 text-[var(--color-dark)] text-base shadow-none transition-all border-none"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSubmitComment}
                  className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dull)] transition-colors duration-150 font-semibold shadow-md"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
  <div className="p-6 sm:p-10">
          <div className="space-y-5">
            {sampleComments
              .slice(0, showAllComments ? sampleComments.length : 2)
              .map((comment) => (
                <InteractiveComment key={comment.id} comment={comment} />
              ))}
          </div>

          {sampleComments.length > 2 && (
            <div className="text-center mt-7">
              <button
                onClick={() => setShowAllComments(!showAllComments)}
                className="flex items-center gap-2 mx-auto text-[var(--color-primary)] hover:text-[var(--color-primary-dull)] transition-colors duration-150 font-semibold"
              >
                {showAllComments ? "Show Less" : "Show More Comments"}
                <ChevronDown
                  size={18}
                  className={`transform transition-transform duration-150 ${
                    showAllComments ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Interactive comment component for like/dislike
function InteractiveComment({ comment }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(comment.likes || 0);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
    } else {
      setLiked(true);
      setLikes(likes + (disliked ? 2 : 1));
      if (disliked) setDisliked(false);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
      setLikes(likes + 1);
    } else {
      setDisliked(true);
      setLiked(false);
      setLikes(likes - (liked ? 2 : 1));
    }
  };

  return (
  <div className="flex gap-3 sm:gap-5 items-start p-4 sm:p-5 rounded-xl bg-white/90 shadow border border-[var(--color-borderColor)]">
      <img
        src={comment.avatar}
        alt={comment.author}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[var(--color-primary)] shadow object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-base sm:text-lg text-[var(--color-dark)]">
            {comment.author}
          </span>
          <span className="text-xs sm:text-sm text-[var(--color-primary-dull)]">
            {comment.timestamp}
          </span>
        </div>
        <p className="mb-2 text-sm sm:text-base text-[var(--color-dark)]">
          {comment.text}
        </p>
        <div className="flex items-center gap-4 mt-1">
          <button
            className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-150 rounded-full px-3 py-1 ${
              liked 
                ? 'bg-[var(--color-primary)] text-white' 
                : 'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] hover:text-white border border-[var(--color-primary)]'
            }`}
            onClick={handleLike}
            aria-pressed={liked}
          >
            <ThumbsUp size={15} />
            {likes}
          </button>
          <button
            className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-150 rounded-full px-3 py-1 ${
              disliked 
                ? 'bg-[var(--color-primary-dull)] text-white' 
                : 'bg-transparent text-[var(--color-primary-dull)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-primary-dull)]'
            }`}
            onClick={handleDislike}
            aria-pressed={disliked}
          >
            <ThumbsDown size={15} />
          </button>
          <button className="text-sm font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors duration-150 px-2 py-1 rounded-full">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentsSection;