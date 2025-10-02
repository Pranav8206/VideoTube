import React, { useEffect, useState } from "react";
import { X, List } from "lucide-react";
import VideoCard from "../VideoCard"; // your final component (unchanged)

const PlaylistSidebar = ({
  playlist,
  currentVideoId,
  onVideoSelect = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!playlist)
    return (
      <div className="flex items-center justify-center p-4 text-sm text-gray-500">
        Playlist does not exist
      </div>
    );

  const headerHeight = 120; // adjust if header/footer sizes change

  return (
    <>
      {/* Mobile open button when collapsed */}
      {!isOpen && (
        <div className="mb-2">
          <button
            onClick={() => setIsOpen(true)}
            className="w-50 flex items-center gap-2 justify-center rounded-md text-sm text-gray-700 cursor-pointer p-1 mx-auto"
            aria-label="Show playlist"
          >
            <List size={16} /> Show playlist
          </button>
        </div>
      )}

      <aside
        className={`flex-shrink-0 z-30 pl-2 ${
          isOpen ? "block" : "hidden"
        } w-full`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-1 border-b border-gray-200">
          <div>
            <h2
              className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate"
              title={playlist.title}
            >
              {playlist.title}
            </h2>
            <p className="text-xs text-gray-500">
              {playlist.videos.length} videos
            </p>
          </div>

          {/* Mobile close */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div
          className="flex-1 "
          style={{ maxHeight: `calc(100vh - ${headerHeight}px)` }}
        >
          {playlist.videos.map((video) => {
            const isActive = video.id === currentVideoId;

            return (
              <div
                key={video.id}
                role="button"
                tabIndex={0}
                onClick={() => onVideoSelect(video)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onVideoSelect(video);
                  }
                }}
                className={`rounded-lg transition-colors ${
                  isActive ? "bg-primary/10 ring-1 ring-primary/40" : ""
                }`}
              >
                <VideoCard video={video} layout="list" />
              </div>
            );
          })}
        </div>

        {/* Footer small info */}
        <div className="p-3 sm:p-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Playlist</span>
            <span className="hidden sm:inline">
              {playlist.videos.length} items
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PlaylistSidebar;
