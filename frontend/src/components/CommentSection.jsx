import React, { useState, useContext, useEffect } from "react";
import { User, ChevronDown } from "lucide-react";
import CommentCard from "./CommentCard";
import { AppContext } from "../context/AppContext";

const CommentsSection = ({ videoId }) => {
  const { axios, user } = useContext(AppContext);

  const [showAll, setShowAll] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 7;

  // Fetch comments
  const fetchComments = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `/api/v1/comments/${videoId}?page=${pageNum}&limit=${limit}`
      );

      setComments(response.data.data.comments);
      setTotalComments(response.data.data.totalComments);
      setTotalPages(response.data.data.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch comments");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (videoId) {
      fetchComments(1);
    }
  }, [videoId]);

  // Post new comment
  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      setError("");
      const response = await axios.post(`/api/v1/comments/${videoId}`, {
        content: newComment,
      });

      // Add new comment to the beginning
      setComments([response.data.data, ...comments]);
      setTotalComments(totalComments + 1);
      setNewComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post comment");
      console.error("Error posting comment:", err);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/v1/comments/c/${commentId}`, {
        withCredentials: true,
      });
      setComments(comments.filter((c) => c._id !== commentId));
      setTotalComments(totalComments - 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete comment");
      console.error("Error deleting comment:", err);
    }
  };

  // Update comment
  const handleUpdateComment = async (commentId, newContent) => {
    try {
      const response = await axios.patch(
        `/api/v1/comments/c/${commentId}`,
        {
          content: newContent,
        },
        {
          withCredentials: true,
        }
      );

      setComments(
        comments.map((c) => (c._id === commentId ? response.data.data : c))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update comment");
      console.error("Error updating comment:", err);
    }
  };

  const displayComments = showAll ? comments : comments.slice(0, 2);

  return (
    <section className="lg:min-w-[70vh] w-full overflow-hidden">
      {/* Comment Form */}
      <div className="px-4 sm:px-6 md:px-10 py-3 sm:py-4 shadow-xs">
        <div className="flex gap-3 sm:gap-5 items-start">
          {/* Avatar */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full  flex items-center justify-center cursor-pointer">
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt="user"
                className="overflow-hidden h-full w-full rounded-full object-cover border border-gray-300"
              />
            ) : (
              <User
                size={14}
                className="bg-gray-400 border-gray-400 h-full w-full object-cover rounded-full text-white fill-white"
              />
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={2}
              className="w-full p-1 sm:p-2 md:p-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-white/80 text-dark text-sm sm:text-base transition-all border border-primary"
            />
            <div className="flex justify-end">
              <button
                onClick={handlePostComment}
                disabled={loading || !newComment.trim()}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-full hover:bg-primary-dull disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 font-semibold shadow-md text-sm sm:text-base cursor-pointer"
              >
                {loading ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-2 px-14">{error}</p>}
      </div>

      {/* Comments List */}
      <div className="px-4 sm:px-6 md:px-10 py-6 space-y-4">
        {loading && comments.length === 0 ? (
          <p className="text-center text-dark text-sm">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-dark text-sm">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <>
            {displayComments.map((comment) => (
              <CommentCard
                key={comment._id}
                data={comment}
                onDelete={() => handleDeleteComment(comment._id)}
                onUpdate={(newContent) =>
                  handleUpdateComment(comment._id, newContent)
                }
              />
            ))}
          </>
        )}

        {comments.length > 2 && (
          <div className="text-center mt-7">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 mx-auto text-primary font-semibold text-sm sm:text-base cursor-pointer"
            >
              {showAll
                ? "Show Less"
                : `Show More Comments (${totalComments - 2})`}
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

export default CommentsSection;
