// PlaylistHeader.jsx
import React, { useState } from "react";
import { Play, Shuffle, RotateCcw, Share } from "lucide-react";

const PlaylistHeader = ({
  playlist,
  onPlayAll,
  onShuffle,
  onLoop,
  isLooping,
}) => {
  const [fullDescription, setFullDescription] = useState(false);

  const toggleFullDescription = () => {
    setFullDescription(!fullDescription);
  };

  return (
    <section className="bg-white shadow-lg border border-gray-100 overflow-hidden ">
      <div className="flex flex-col sm:flex-row">
        {/* Mosaic */}
        <div className="sm:w-80 h-64 sm:h-80 relative bg-indigo-50 flex-shrink-0 rounded-lg">
          <div className="grid grid-cols-2 gap-1 h-full">
            {playlist.videos.slice(0, 4).map((v, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden bg-white shadow-sm"
              >
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent rounded-lg" />
          <div className="absolute bottom-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
            {playlist.videoCount} {playlist.videoCount > 1 ? "videos" : "video"}
          </div>
        </div>

        {/* Info & Actions */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6">
          <h1
            className="text-xl s:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 line-clamp-2"
            title={playlist.title}
          >
            {playlist.title}
          </h1>
          <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-3">
            <span className={fullDescription ? "" : "line-clamp-2"}>
              {playlist.description}
              {playlist.description}
            </span>
            <button
              onClick={toggleFullDescription}
              aria-expanded={fullDescription}
              className={` ${
                fullDescription ? "ml-1" : ""
              } text-primary font-medium hover:underline text-xs sm:text-sm cursor-pointer`}
            >
              {fullDescription ? "See less" : "See more"}
            </button>
          </p>

          <div className="flex flex-wrap gap-3 justify-items-end border">
            <button
              onClick={onPlayAll}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-indigo-600 
               text-white px-5 py-2 rounded-full font-medium shadow hover:opacity-90 cursor-pointer "
            >
              <Play size={20} />
              <span className="hidden sm:inline">Play all</span>
            </button>

            <button
              onClick={onShuffle}
              className="flex items-center gap-2 border border-primary text-primary 
               bg-white px-5 py-2 rounded-full font-medium cursor-pointer "
            >
              <Shuffle size={20} />
              <span className="hidden sm:inline">Shuffle</span>
            </button>

            <button
              onClick={onLoop}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition cursor-pointer  ${
                isLooping
                  ? "bg-primary/10 border border-primary text-primary"
                  : "bg-white border border-gray-200 text-gray-700  "
              }`}
            >
              <RotateCcw size={20} />
              <span className="hidden sm:inline">Loop</span>
            </button>

            <button
              className="flex items-center gap-2 border border-gray-200 text-gray-700 
               bg-white px-2 sm:px-5 py-2 rounded-full font-medium cursor-pointer "
            >
              <Share size={20} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaylistHeader;
