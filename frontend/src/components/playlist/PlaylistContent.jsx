import React, { useState, useCallback, useMemo } from "react";
import PlaylistHeader from "./PlaylistHeader";
import PlaylistSettings from "./PlaylistSettings";
import VideoList from "./VideoList";
import { onePlaylist, playlist } from "../../utils/videosData";
import PlaylistSidebar from "./PlaylistSidebar";

const PlaylistPage = ({ playlistId }) => {
  const [currentVideoId, setCurrentVideoId] = useState(1);
  const [watchedVideos] = useState([1, 2, 3]); // Removed setter if not used
  const [isLooping, setIsLooping] = useState(false);
  const [playlistData, setPlaylistData] = useState(playlist);

  // ✅ Use useCallback to memoize handlers
  const handlePlayAll = useCallback(() => {
    if (playlistData.videos.length > 0) {
      setCurrentVideoId(playlistData.videos[0].id);
    }
  }, [playlistData.videos]);

  const handleShuffle = useCallback(() => {
    if (playlistData.videos.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * playlistData.videos.length
      );
      setCurrentVideoId(playlistData.videos[randomIndex].id);
    }
  }, [playlistData.videos]);

  const handleVideoPlay = useCallback((id) => {
    setCurrentVideoId(id);
  }, []);

  const handleVideoRemove = useCallback((id) => {
    setPlaylistData((prev) => ({
      ...prev,
      videos: prev.videos.filter((v) => v.id !== id),
      videoCount: prev.videoCount - 1,
    }));
  }, []);

  const handlePrivacyToggle = useCallback(() => {
    setPlaylistData((prev) => ({ ...prev, isPublic: !prev.isPublic }));
  }, []);

  const handleLoopToggle = useCallback(() => {
    setIsLooping((s) => !s);
  }, []);

  const handleAddVideos = useCallback(() => {
    console.log("Add videos");
  }, []);

  const watchedCount = useMemo(() => watchedVideos.length, [watchedVideos]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <main className="xl:col-span-3 space-y-3">
            <PlaylistHeader
              playlist={playlistData}
              onPlayAll={handlePlayAll}
              onShuffle={handleShuffle}
              onLoop={handleLoopToggle}
              isLooping={isLooping}
            />
            <div className="px-4 sm:px-8 md:px-10 lg:px-56">
              <PlaylistSettings
                playlist={playlistData}
                onPrivacyToggle={handlePrivacyToggle}
                onAddVideos={handleAddVideos}
              />
            </div>

            {/* All videos in playlist */}
            <section className="px-0.5 sm:px-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Videos ({playlistData.videoCount})
                </h2>
                <div className="text-sm text-gray-600">
                  {watchedCount} of {playlistData.videoCount} watched
                </div>
              </div>

              <VideoList
                videos={playlistData.videos}
                currentVideoId={currentVideoId}
                watchedVideos={watchedVideos}
                onVideoPlay={handleVideoPlay}
                onVideoRemove={handleVideoRemove}
              />
            </section>
          </main>
        </div>
      </div>
      {/* <PlaylistSidebar
        playlist={onePlaylist}
        currentVideoId={currentVideoId}
        onVideoSelect={handleVideoPlay}
      /> */}
    </div>
  );
};

export default PlaylistPage;
