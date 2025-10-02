// VideoCard.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Download, Flag, Clock, Minus, MoreVertical, Play } from "lucide-react";

const VideoCard = ({ video, layout = "list", onRemove, inSubscription }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [width, setWidth] = useState(0);
  const rootRef = useRef(null);
  const isList = layout === "list";

  // Measure width of the root so we can scale fonts appropriately
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const setMeasuredWidth = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      setWidth(w);
    };

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => setMeasuredWidth());
      ro.observe(el);
      setMeasuredWidth();
      return () => ro.disconnect();
    }

    // fallback
    setMeasuredWidth();
    const onResize = () => setMeasuredWidth();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Decide bucket from width
  const sizeBucket = useMemo(() => {
    if (width <= 220) return "xs";
    if (width <= 300) return "sm";
    if (width <= 420) return "md";
    return "lg";
  }, [width]);

  // Map bucket to Tailwind text classes
  const titleClass = useMemo(() => {
    switch (sizeBucket) {
      case "xs":
        return "text-xs"; // very compact
      case "sm":
        return "text-sm"; // small cards
      case "md":
        return "text-base"; // medium cards
      default:
        return "text-lg"; // large / full width
    }
  }, [sizeBucket]);

  const metaClass = useMemo(() => {
    switch (sizeBucket) {
      case "xs":
        return "text-[10px]";
      case "sm":
        return "text-xs";
      case "md":
        return "text-sm";
      default:
        return "text-base";
    }
  }, [sizeBucket]);

  return (
    <div
      ref={rootRef}
      className={`bg-white w-full rounded-xl border border-gray-100 transition-all duration-300 cursor-pointer hover:border-gray-200 hover:shadow-md
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
    >
      {/* Thumbnail */}
      <div
        className={`relative ${
          isList ? "flex-shrink-0 w-[40%] max-w-[320px]" : ""
        }`}
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
          {video.duration ? video.duration : "0:00"}
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
          isList
            ? "flex pt-1 justify-between"
            : "p-2 sm:p-3 flex items-start gap-3"
        }`}
      >
        <div className="min-w-0 flex-1 space-y-1">
          <h3
            className={`font-medium text-gray-900 line-clamp-2 min-h-10 leading-tight ${titleClass}`}
          >
            {video.title}
          </h3>

          <div className="flex items-start justify-start s:gap-2">
            <div className="group">
              <img
                src={video.channelAvatar}
                alt={video.channel}
                className="rounded-full w-6 h-6 sm:w-8 sm:h-8 cursor-pointer"
              />
            </div>

            <div className="flex flex-col items-start content-start">
              <p
                className={`text-primary font-medium cursor-pointer transition-colors duration-300 line-clamp-1 ${metaClass} group-hover:text-purple-600`}
              >
                {inSubscription ? video.channel?.name : video.channel}
              </p>
              <p
                className={`text-gray-500 ${metaClass} flex flex-wrap gap-x-1 tracking-tighter leading-none`}
              >
                <span>{video.views}</span>
                <span>•</span>
                <span>{video.timestamp}</span>
              </p>
            </div>
          </div>
        </div>

        {/* More button (only in list) */}
        <div
          className={`flex ${isList ? "items-start" : "items-center"} gap-1`}
        >
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions((s) => !s);
              }}
              className="sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100"
              aria-label="More"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </button>

            {showOptions && (
              <div
                className={`absolute right-0 ${
                  isList ? "top-8" : "bottom-6"
                } bg-white shadow-lg border border-gray-200 rounded-lg mx-1 z-10 w-40 sm:w-48`}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center gap-2">
                  <Clock size={16} />
                  Watch later
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Download size={16} />
                  Download
                </button>
                <hr className="text-gray-300" />
                <button className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-gray-50 rounded-b-lg flex items-center gap-2">
                  <Flag size={16} />
                  Report
                </button>
                {onRemove && <hr className="my-1" />}
                {onRemove && (
                  <button
                    onClick={() => onRemove(video.id)}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
