import React, { useState, useRef, useEffect } from "react";

const CommentsSection = ({ comments }) => {
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState("top");

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {comments.length} Comments
        </h3>
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600">
          Sort by {sortBy}
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 pb-2 focus:outline-none focus:border-purple-500"
          />
          {newComment && (
            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNewComment("")}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm">
                Comment
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img
              src={comment.avatar}
              alt={comment.author}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  {comment.author}
                </span>
                <span className="text-gray-500 text-xs">
                  {comment.timestamp}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {comment.text}
              </p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-purple-600">
                  <ThumbsUp size={14} />
                  {comment.likes}
                </button>
                <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-600">
                  <ThumbsDown size={14} />
                </button>
                <button className="text-gray-600 dark:text-gray-400 hover:text-purple-600 text-sm">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
