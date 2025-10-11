import React, { useState, useContext } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import { AppContext } from "../context/context";
import { Link } from "react-router-dom";

const CommentCard = ({ data, onDelete, onUpdate }) => {
  const { user, timeAgo } = useContext(AppContext);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(data.likes || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(data.content);
  const [showMenu, setShowMenu] = useState(false);

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

  const handleSaveEdit = () => {
    if (editedContent.trim() && editedContent !== data.content) {
      onUpdate(editedContent);
      setIsEditing(false);
    }
  };

  const isOwner = user?._id === data.owner._id;

  return (
    <div className="flex gap-3 sm:gap-5 items-start sm:p-2 relative">
      <Link to={`/c/${data.owner.username}`}>
        <img
          src={data.owner.avatar}
          alt={data.owner.username}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover cursor-pointer border border-gray-300"
        />
      </Link>
      <div className="flex-1" onMouseLeave={() => setShowMenu(false)}>
        <div className="flex items-center gap-3 justify-between ">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm sm:text-base text-dark cursor-pointer">
              {data.owner.username}
            </span>
            <span className="text-xs sm:text-sm text-primary-dull">
              {timeAgo(data.createdAt)}
            </span>
          </div>

          {isOwner && (
            <div className="relative">
              <MoreVertical
                size={18}
                className="cursor-pointer text-dark hover:text-primary"
                onClick={() => setShowMenu(!showMenu)}
              />
              {showMenu && (
                <div className="absolute right-4 top-0  w-32 bg-white border border-primary rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary/10 text-dark cursor-pointer"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-100 text-red-600 rounded-b-lg cursor-pointer"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="my-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 rounded-lg border border-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              rows={2}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-primary text-white rounded-full text-xs hover:bg-primary/70 transition-colors cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(data.content);
                }}
                className="px-3 py-1 bg-gray-200 text-dark rounded-full text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mb-2 text-sm sm:text-base text-dark">{data.content}</p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2">
            <ThumbsUp
              size={18}
              className={`cursor-pointer transition-colors duration-150 text-primary ${
                liked ? "fill-primary stroke-1 stroke-purple-700" : ""
              }`}
              onClick={handleLike}
            />
            <span className="text-xs sm:text-sm font-semibold text-primary w-7">
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
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
