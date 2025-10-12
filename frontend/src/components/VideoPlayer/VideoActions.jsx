import React, { useContext, useState, useEffect, useRef } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Share2,
  Download,
  BookmarkPlus,
  Loader,
  User,
} from "lucide-react";
import { AppContext } from "../../context/context";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VideoActions = ({ video }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [subscribing, setSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [animateStars, setAnimateStars] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [actionCooldown, setActionCooldown] = useState(false);
  const navigate = useNavigate();

  const {
    timeAgo,
    user,
    getUserAllSubscribedChannels,
    toggleSubscribeChannel,
  } = useContext(AppContext);

  const moreRef = useRef();

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const { data } = await axios.get(`/api/v1/likes/video/${video._id}`);
        setLikeCount(data?.data?.like || 0);
      } catch (err) {
        console.error("Error fetching like count:", err);
      }
    };
    if (video?._id) fetchLikeCount();
  }, [video?._id]);

  // ✅ Detect outside click to close the popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Fetch subscription status
  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) return;
      try {
        const subs = await getUserAllSubscribedChannels();
        const subscribed = subs.some(
          (sub) => sub.channel._id === video.owner._id
        );
        setIsSubscribed(subscribed);
      } catch (err) {
        console.error("Error fetching subscription:", err);
      }
    };
    fetchStatus();
  }, [user, video.owner?._id, getUserAllSubscribedChannels]);

  // ✅ Like / Unlike
  const handleLike = async () => {
    if (!user) return toast.error("Please login to like videos");
    if (actionCooldown) return;

    setActionCooldown(true);
    if (disliked) setDisliked(false);

    try {
      const { data } = await axios.post(
        `/api/v1/likes/video/${video._id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (data.message.includes("unliked")) {
        setLiked(false);
        setLikeCount((prev) => Math.max(prev - 1, 0));
      } else {
        setLiked(true);
        setDisliked(false);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      toast.error("Something went wrong while toggling like");
    } finally {
      setActionCooldown(false);
    }
  };

  // ✅ Dislike
  const handleDislike = async () => {
    if (!user) return toast.error("Please login to dislike videos");
    setActionCooldown(true);

    setDisliked((prev) => !prev);
    if (liked) {
      await axios.post(
        `/api/v1/likes/video/${video._id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    }
    setActionCooldown(false)
  };

  // ✅ Subscribe
  const handleSubscribe = async () => {
    if (!user) return toast.error("Please login to subscribe");
    if (user._id === video.owner._id)
      return toast.error("You can't subscribe to yourself");
    if (actionCooldown) return;

    setSubscribing(true);

    const subscribed = await toggleSubscribeChannel(video.owner._id);
    if (subscribed === null) return setSubscribing(false);
    setIsSubscribed(subscribed);

    if (subscribed) {
      setAnimateStars(true);
      setTimeout(() => setAnimateStars(false), 700);
    }
    setSubscribing(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => toast.success("Video saved to playlist");
  const handleDownload = () => toast.success("Preparing download...");

  const formatCount = (count) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="flex flex-col border-b border-gray-200 pb-3 mx-2 sm:mx-4">
      {/* Title */}
      <div className="mb-3 sm:px-4">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 line-clamp-2">
          {video.title || "Loading..."}
        </h1>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:px-4 gap-3">
        {/* Channel + Subscribe */}
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          <button
            className="rounded-full w-8 h-8 sm:w-10 sm:h-10 border border-primary object-cover relative cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/c/${video.owner?.username}`);
            }}
          >
            {video.owner?.avatar ? (
              <img
                src={video.owner?.avatar}
                alt={video.owner?.username}
                className="rounded-full object-cover h-full w-full"
              />
            ) : (
              <User
                size={14}
                className="bg-gray-400 border-gray-400 h-full w-full object-cover rounded-full text-white fill-white"
              />
            )}
          </button>

          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-gray-900 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
              {video.owner?.fullName ||
                video.owner?.username ||
                " Channel Name"}
            </span>
            <span className="text-xs text-gray-500">
              @{video.owner?.username || "username"}
            </span>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={subscribing}
            className={`ml-auto sm:ml-3 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-semibold text-sm sm:text-base transition-all shadow relative flex-shrink-0 cursor-pointer ${
              isSubscribed
                ? "bg-gray-200 text-gray-800 "
                : "bg-primary text-white"
            } ${subscribing && "opacity-30 "}`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
            {animateStars && (
              <Sparkles className="absolute top-0 right-0 text-yellow-400 w-4 h-4 animate-ping" />
            )}
          </button>
        </div>

        {/* Like / Dislike / More */}
        <div className="flex flex-wrap justify-between sm:justify-end items-center gap-2 w-full sm:w-auto">
          {/* Like / Dislike */}
          <div
            className={`flex items-center rounded-full bg-gray-100 overflow-hidden relative ${
              actionCooldown && "opacity-60 "
            }`}
          >
            <button
              onClick={handleLike}
              disabled={actionCooldown}
              className={`flex items-center gap-1.5 sm:gap-2 mx-1 px-2 sm:px-4 py-2 text-sm font-medium transition-all  ${
                liked ? "text-purple-600" : "text-gray-700"
              } ${actionCooldown ? "opacity-60 " : "cursor-pointer"}`}
            >
              <ThumbsUp
                size={18}
                className={`transition-transform ${
                  liked ? "fill-purple-600 scale-110" : ""
                }`}
              />
              <span className="hidden xs:inline">{formatCount(likeCount)}</span>
            </button>

            <div className="w-px h-5 bg-gray-300" />

            <button
              onClick={handleDislike}
              disabled={actionCooldown}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                disliked ? "text-red-600" : "text-gray-700"
              } ${actionCooldown ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <ThumbsDown
                size={18}
                className={`transition-transform ${
                  disliked ? "fill-red-600 scale-110" : ""
                }`}
              />
            </button>
          </div>

          {/* More menu */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setShowMoreMenu((p) => !p)}
              className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all cursor-pointer"
            >
              <MoreVertical size={18} />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-primary z-50">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                >
                  <Share2 size={16} />
                  {copied ? "Copied!" : "Share"}
                </button>
                <button
                  onClick={handleSave}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                >
                  <BookmarkPlus size={16} />
                  Save
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {video.description ? (
        <div className="mt-3 sm:px-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>{video.views} views</span>
            <span className="text-gray-400">•</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>
          <button
            onClick={() => setShowDescription((prev) => !prev)}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 cursor-pointer"
          >
            {showDescription ? (
              <>
                Hide description <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show description <ChevronDown size={16} />
              </>
            )}
          </button>

          {showDescription && (
            <p className="mt-2 text-sm sm:text-base text-gray-700 whitespace-pre-line leading-relaxed">
              {video.description}
            </p>
          )}
        </div>
      ) : (
        <div className="w-full text-primary flex items-center justify-center">
          <Loader size={40} className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default VideoActions;
