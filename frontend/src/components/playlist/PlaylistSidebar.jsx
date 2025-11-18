import React, { useEffect, useState, useCallback, useContext } from "react";
import { X, List } from "lucide-react";
import VideoCard from "../VideoCard";
import { AppContext } from "../../context/AppContext";

const PlaylistSidebar = ({
  playlistId,
  currentVideoId,
  onVideoSelect = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [playlistData, setPlaylistData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { playlistSidebarInVideoPlayer, axios } = useContext(AppContext);

  useEffect(() => {
    const fetch = async () => {
      if (playlistSidebarInVideoPlayer.playlistId) {
        try {
          setIsLoading(true);
          const res = await axios.get(
            `/api/v1/playlists/${playlistSidebarInVideoPlayer.playlistId}`,
            {
              withCredentials: true,
            }
          );
          setPlaylistData(res?.data?.data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetch();
  }, [playlistSidebarInVideoPlayer?.playlistId, axios]);

  // ✅ Fixed useEffect with proper dependencies
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency - only runs on mount/unmount

  // ✅ Use useCallback for handlers
  const handleToggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleVideoClick = useCallback(
    (video) => {
      onVideoSelect(video);
    },
    [onVideoSelect]
  );

  if (!playlistSidebarInVideoPlayer?.playlistId) return null;

  const headerHeight = 120;

  return (
    <>
      {/* Mobile open button */}
      {!isOpen && (
        <div className="mb-2">
          <button
            onClick={handleToggleSidebar}
            type="button"
            className="w-50 flex items-center gap-2 justify-center rounded-md text-sm text-gray-700 p-2 mx-auto hover:bg-gray-100 transition-colors"
            aria-label="Show playlist"
          >
            <List size={16} /> Show playlist
          </button>
        </div>
      )}

      <aside
        className={`flex-shrink-0 z-30 pl-2 transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        } w-full`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-borderColor bg-white rounded-t-xl">
          <div className="flex-1 min-w-0">
            <h2
              className="text-sm sm:text-base md:text-lg font-semibold text-dark truncate"
              title={playlist.title}
            >
              {playlist.title}
            </h2>
            <p className="text-xs text-gray-500">
              {playlist.videos.length} videos
            </p>
          </div>

          <button
            onClick={handleToggleSidebar}
            type="button"
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors ml-2"
            aria-label="Hide playlist"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video List */}
        <div
          className="overflow-y-auto bg-white"
          style={{ maxHeight: `calc(100vh - ${headerHeight}px)` }}
        >
          {playlist.videos.map((video) => {
            const isActive = video.id === currentVideoId;

            return (
              <div
                key={video.id}
                role="button"
                tabIndex={0}
                onClick={() => handleVideoClick(video)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleVideoClick(video);
                  }
                }}
                className={`rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary/10 ring-2 ring-primary/40"
                    : "hover:bg-gray-50"
                }`}
              >
                <VideoCard video={video} layout="list" inSidebar={true} />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-borderColor bg-white rounded-b-xl">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium">Playlist</span>
            <span>{playlist.videos.length} items</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default React.memo(PlaylistSidebar);
