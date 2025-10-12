// PlaylistPage.jsx
import React, { useState } from "react";
import PlaylistHeader from "./PlaylistHeader";
import PlaylistSettings from "./PlaylistSettings";
import VideoList from "./VideoList";
import { onePlaylist, playlist } from "../../utils/videosData";
import PlaylistSidebar from "./PlaylistSidebar";

const PlaylistPage = () => {
  const [currentVideoId, setCurrentVideoId] = useState(1);
  const [watchedVideos, setWatchedVideos] = useState([1, 2, 3]);
  const [isLooping, setIsLooping] = useState(false);

  const [playlistData, setPlaylistData] = useState(playlist);

  // handlers
  const handlePlayAll = () => setCurrentVideoId(playlistData.videos[0].id);

  const handleShuffle = () =>
    setCurrentVideoId(
      playlistData.videos[
        Math.floor(Math.random() * playlistData.videos.length)
      ].id
    );

  const handleVideoPlay = (id) => setCurrentVideoId(id);

  const handleVideoRemove = (id) =>
    setPlaylistData((prev) => ({
      ...prev,
      videos: prev.videos.filter((v) => v.id !== id),
      videoCount: prev.videoCount - 1,
    }));

  const handlePrivacyToggle = () =>
    setPlaylistData((prev) => ({ ...prev, isPublic: !prev.isPublic }));

  const handleAddVideos = () => console.log("Add videos");
  setWatchedVideos([1, 2, 3]); // delete later
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <main className="xl:col-span-3 space-y-3">
            <PlaylistHeader
              playlist={playlistData}
              onPlayAll={handlePlayAll}
              onShuffle={handleShuffle}
              onLoop={() => setIsLooping((s) => !s)}
              isLooping={isLooping}
            />
            <div className="px-4 sm:px-8 md:px-10 lg:px-56">
              <PlaylistSettings
                playlist={playlistData}
                onPrivacyToggle={handlePrivacyToggle}
                onAddVideos={handleAddVideos}
              />
            </div>

            <section className="px-1 xs:px-2 sm:px-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Videos ({playlistData.videoCount})
                </h2>
                <div className="text-sm text-gray-600">
                  {watchedVideos.length} of {playlistData.videoCount} watched
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
      <PlaylistSidebar
        playlist={onePlaylist}
        currentVideoId={
          onePlaylist.videos?.[currentVideoId]?.id || onePlaylist.videos[0].id
        }
        onVideoSelect=""
      />
    </div>
  );
};

export default PlaylistPage;
