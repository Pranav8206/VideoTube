import React, { useState, useCallback, useMemo, useContext } from "react";
import { Play, Shuffle, Share2, ListVideo, Check } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const PlaylistHeader = ({ playlist, onPlayAll, onShuffle }) => {
  const [fullDescription, setFullDescription] = useState(false);
  const { timeAgo } = useContext(AppContext);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleFullDescription = useCallback(() => {
    setFullDescription((prev) => !prev);
  }, []);

  const shouldShowSeeMore = useMemo(() => {
    return playlist?.description && playlist.description.length > 150;
  }, [playlist?.description]);

  const thumbnails = useMemo(() => {
    return playlist?.videos?.slice(0, 4) || [];
  }, [playlist?.videos]);

  const videoCount = playlist?.videos?.length || 0;

  return (
    <section className="overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Mosaic Thumbnail */}
        <div className="relative w-full lg:w-96 h-64 lg:h-96 bg-gradient-to-br from-purple-50 to-gray-50 rounded-xl">
          {videoCount === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No videos yet</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1 p-1.5 h-full">
              {thumbnails.map((video, i) => (
                <div
                  key={video._id || i}
                  className="rounded-xl overflow-hidden bg-gray-100 shadow-inner"
                >
                  <img
                    src={video.thumbnail || "/empty-playlist.png"}
                    alt={video.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
              {/* Fill empty slots */}
              {Array.from({ length: 4 - thumbnails.length }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-gray-200 rounded-xl" />
              ))}
            </div>
          )}

          {/* Video Count Badge */}
          <div className="absolute bottom-4 right-4 bg-primary/40 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
            <ListVideo size={16} className="fill-white" />
            {videoCount} {videoCount === 1 ? "video" : "videos"}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl lg:text-5xl font-black text-gray-900 mb-3 leading-tight">
              {playlist?.name || "Untitled Playlist"}
            </h1>

            {playlist?.description ? (
              <div className="text-gray-600 text-base lg:text-lg leading-relaxed mb-6">
                <p
                  className={`${
                    fullDescription ? "" : "line-clamp-2"
                  } transition-all duration-300`}
                >
                  {playlist.description}
                </p>
                {shouldShowSeeMore && (
                  <button
                    onClick={toggleFullDescription}
                    className="text-primary font-semibold hover:underline text-sm mt-2 inline-block"
                  >
                    {fullDescription ? "Show less" : "See more"}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-400 italic mb-6">No description</p>
            )}

            <div className="text-sm text-gray-500 mb-6">
              Playlist Created by:{" "}
              <div className="flex gap-3">
                <img
                  src={playlist?.owner?.avatar}
                  alt={playlist?.owner?.username}
                  className="w-10 h-10 rounded-full border-primary border cursor-pointer"
                  onClick={() => navigate("/c/" + playlist?.owner?.username)}
                />
                <div className="flex flex-col gap-0">
                  <span className="font-medium text-gray-700">
                    {playlist?.owner?.username || "Unknown"}
                  </span>
                  <span>{timeAgo(playlist?.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onPlayAll}
              disabled={videoCount === 0}
              className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-full font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Play size={22} className="fill-white" />
              Play All
            </button>

            <button
              onClick={onShuffle}
              disabled={!videoCount}
              className="flex items-center gap-3 border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-6 py-3.5 rounded-full font-bold transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              <Shuffle size={20} />
              Shuffle
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3.5 rounded-full font-bold transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={20} className="text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={20} />
                  Share
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(PlaylistHeader);
