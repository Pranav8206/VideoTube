// VideoCard.jsx
import React, { useState, useRef, useContext } from "react";
import {
  Download,
  Flag,
  Clock,
  Minus,
  MoreVertical,
  Play,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const VideoCard = ({
  video,
  layout = "list",
  onRemove,
  inSubscription,
  inSidebar = false,
  forChannelPage = false,
  showMoreIcon = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const nameRef = useRef(null);
  const { timeAgo } = useContext(AppContext);

  const isList = layout === "list";

  const handleDuration = (duration) => {
    if (duration == null || isNaN(duration)) return "0:00";
    const totalSeconds = Math.floor(Number(duration));

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let formatted = "";

    if (hours > 0) {
      formatted = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    return formatted;
  };

  const showNameRefUnderline = () => {
    if (nameRef.current) {
      nameRef.current.style.textDecoration = "underline";
      nameRef.current.style.transform = "scale(1.05)";
      nameRef.current.style.paddingLeft = "0.25rem";
      nameRef.current.style.paddingRight = "0.25rem";
      nameRef.current.style.transition =
        "transform 0.2s ease, padding 0.2s ease, text-decoration 0.2s ease";
    }
  };

  const hideNameRefUnderline = () => {
    if (nameRef.current) {
      nameRef.current.style.textDecoration = "none";
      nameRef.current.style.transform = "scale(1)";
      nameRef.current.style.paddingLeft = "";
      nameRef.current.style.paddingRight = "";
    }
  };

  const handleClick = () => {
    navigate(`/v/${video._id}`);
  };

  return (
    <div
      className={`bg-white w-full rounded-xl border border-gray-100 transition-all duration-300 cursor-pointer h-full max-w-full overflow-hidden hover:border-gray-200 hover:shadow-md
        ${
          isList
            ? "flex justify-between gap-2 hover:bg-gray-50 my-1"
            : "flex-col w-full group overflow-hidden"
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowOptions(false);
      }}
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div
        className={`relative ${
          isList
            ? "flex-shrink-0 w-[38%] s:w-[42%] sm:w-[50%] max-w-[320px]"
            : ""
        }  `}
      >
        <div
          className={`overflow-hidden bg-gray-100 aspect-video ${
            isList ? "rounded-l-lg shadow-sm" : ""
          }`}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isList ? "" : "group-hover:scale-105"
            }`}
          />
        </div>

        {/* Duration overlay */}
        <span
          className={`absolute bg-black/80 text-white rounded text-xs ${
            isList
              ? "bottom-1 right-1 px-0.5 "
              : "bottom-2 right-2 px-2 py-1 backdrop-blur-sm"
          }`}
        >
          {video.duration ? handleDuration(video.duration) : "0:00"}
        </span>

        {/* Play overlay on hover */}
        {isHovered && (
          <div
            className={`absolute inset-0 bg-black/20 flex items-center justify-center ${
              isList ? "rounded-l-lg" : "rounded-t-lg"
            }`}
          >
            <div
              className={`bg-white rounded-full flex items-center justify-center shadow-lg ${
                isList ? "w-8 h-8" : "w-12 h-12"
              }`}
            >
              <Play
                size={isList ? 20 : 28}
                className="fill-primary text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Info + Actions */}
      <div
        className={`flex-1 ${
          isList ? "flex s:pt-1 justify-between" : "p-1 flex justify-between "
        }`}
      >
        <div className="flex-col justify-between s:pl-1 overflow-hidden">
          <h3
            className={`font-semibold text-gray-900 line-clamp-2 overflow-ellipsis leading-tight ${
              forChannelPage && "min-h-8"
            } ${inSidebar ? "text-base " : "text-sm sm:text-base"} `}
          >
            {video.title?.charAt(0).toUpperCase() + video.title?.slice(1)}
          </h3>
          {isList && (
            <h2 className="hidden sm:flex min-h-0 text-gray-600 text-xs sm:text-sm leading-snug line-clamp-2 text-ellipsis tracking-tight max-h-10">
              {video.description || ""}
            </h2>
          )}

          <div className="flex items-start gap-2 sm:gap-3 h-full">
            <div className="shrink-0">
              <button
                className={`rounded-full w-7 h-7  border border-primary object-cover relative cursor-pointer ${
                  inSidebar ? "" : " sm:w-9 sm:h-9"
                }`}
                onMouseEnter={showNameRefUnderline}
                onMouseLeave={hideNameRefUnderline}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/c/${video.owner?.username}`);
                }}
              >
                {video.owner?.avatar ? (
                  <img
                    src={video.owner?.avatar}
                    alt={video.owner?.username}
                    className="rounded-full  object-cover h-full w-full"
                  />
                ) : (
                  <User
                    size={14}
                    className="bg-gray-400 border-gray-400 h-full w-full object-cover rounded-full text-white fill-white"
                  />
                )}
              </button>
            </div>

            <div className="flex flex-col justify-center">
              <p
                ref={nameRef}
                className={`font-semibold text-primary cursor-pointer line-clamp-1 leading-tight ${
                  inSidebar ? "text-xs" : "text-xs sm:text-sm"
                } `}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {inSubscription
                  ? video.channel?.name
                  : video.owner.username}
              </p>

              <p
                className={`text-gray-500 ${
                  inSidebar ? "text-xs" : "text-xs sm:text-sm"
                } flex items-center gap-1 leading-tight whitespace-nowrap overflow-ellipsis`}
              >
                <span>{video.views} views</span>
                <span>•</span>
                <span>{timeAgo(video.createdAt)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* More button */}
        <div
          className={`flex ${isList ? "items-start" : "items-end"} ${
            !showMoreIcon && "hidden"
          } gap-1`}
        >
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions((s) => !s);
              }}
              className="sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 p-1"
              aria-label="More"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </button>

            {showOptions && showMoreIcon && (
              <div
                className={`absolute right-4 ${
                  isList ? "top-0" : "bottom-6"
                } bg-white  shadow-lg border border-primary rounded-lg mx-1 z-10 w-40 sm:w-48 cursor-pointer`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success("Saved in watch later");
                  }}
                >
                  <Clock size={16} />
                  Watch later
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    //downolad video
                  }}
                >
                  <Download size={16} />
                  Download
                </button>
                <hr className="text-gray-300" />
                <button
                  className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-gray-50 rounded-b-lg flex items-center gap-2 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();

                    const t1 = toast.loading("Analyzing the video...");

                    setTimeout(() => {
                      toast.dismiss(t1);
                      toast.success("Video looks fine");
                      setTimeout(() => {
                        toast.error("Report dismissed 🗑️");
                      }, 1000);
                    }, 5000);
                  }}
                >
                  <Flag size={16} />
                  Report
                </button>
                {onRemove && <hr className="my-1" />}
                {onRemove && (
                  <button
                    onClick={() => onRemove(video._id)}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Minus size={16} />
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
