import React, { useState, useCallback, useMemo } from "react";
import { Play, Shuffle, RotateCcw, Share } from "lucide-react";

const PlaylistHeader = ({
  playlist,
  onPlayAll,
  onShuffle,
  onLoop,
  isLooping,
}) => {
  const [fullDescription, setFullDescription] = useState(false);

  const toggleFullDescription = useCallback(() => {
    setFullDescription((prev) => !prev);
  }, []);

  const shouldShowSeeMore = useMemo(() => {
    return playlist.description && playlist.description.length > 150;
  }, [playlist.description]);

  const videoThumbnails = useMemo(() => {
    return playlist.videos.slice(0, 4);
  }, [playlist.videos]);

  return (
    <section className="bg-white shadow-lg border border-borderColor overflow-hidden rounded-xl">
      <div className="flex flex-col sm:flex-row">
        {/* Mosaic */}
        <div className="sm:w-80 h-64 sm:h-80 relative bg-primary/5 flex-shrink-0 rounded-lg">
          <div className="grid grid-cols-2 gap-1 h-full p-1">
            {videoThumbnails.map((v, i) => (
              <div
                key={v.id || i}
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
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg" />
          <div className="absolute bottom-4 right-4 bg-primary text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
            {playlist.videoCount}{" "}
            {playlist.videoCount === 1 ? "video" : "videos"}
          </div>
        </div>

        {/* Info & Actions */}
        <div className="flex-1 p-4 sm:p-5 lg:p-6">
          <h1
            className="text-xl s:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark mb-3 line-clamp-2"
            title={playlist.title}
          >
            {playlist.title}
          </h1>

          <div className="text-gray-600 text-sm lg:text-base leading-relaxed mb-4">
            <p className={fullDescription ? "" : "line-clamp-2"}>
              {playlist.description}
            </p>
            {shouldShowSeeMore && (
              <button
                onClick={toggleFullDescription}
                type="button"
                className="text-primary font-medium hover:underline text-xs sm:text-sm mt-1 inline-block"
              >
                {fullDescription ? "See less" : "See more"}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onPlayAll}
              type="button"
              className="flex items-center gap-2 bg-primary hover:bg-primary-dull text-white px-5 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Play size={20} />
              <span className="hidden sm:inline">Play all</span>
            </button>

            <button
              onClick={onShuffle}
              type="button"
              className="flex items-center gap-2 border-2 border-primary text-primary bg-white hover:bg-primary/5 px-5 py-2.5 rounded-full font-medium transition-all duration-200"
            >
              <Shuffle size={20} />
              <span className="hidden sm:inline">Shuffle</span>
            </button>

            <button
              onClick={onLoop}
              type="button"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200 cursor-pointer ${
                isLooping
                  ? "bg-primary/10 border border-primary text-primary"
                  : "bg-white border border-gray-200 text-gray-700  "
              }`}
            >
              <RotateCcw size={20} />
              <span className="hidden sm:inline">Loop</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-2 border-2 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 px-3 sm:px-5 py-2.5 rounded-full font-medium transition-all duration-200 cursor-pointer"
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

export default React.memo(PlaylistHeader);
