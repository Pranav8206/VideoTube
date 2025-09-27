import React from "react";
import VideoCard from "../VideoCard";

const PlaylistSidebar = ({ playlist, currentVideoId, onVideoSelect }) => {
  if (!playlist)
    return (
      <div className="flex items-center justify-center mx-auto">
        Playlist not exist
      </div>
    );

  return (
    <div className="w-fit md:w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      {/* Playlist Info */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">{playlist.title}</h2>
        <p className="text-sm text-gray-500">{playlist.videos.length} videos</p>
      </div>

      {/* Videos List */}
      <div className="flex-1 overflow-y-auto">
        {playlist.videos.map((video, index) => {
          const isActive = video.id === currentVideoId;

          return (
            <div
              key={video.id}
              onClick={() => onVideoSelect(video)}
              className={`cursor-pointer transition-colors ${
                isActive
                  ? "bg-primary/10 border-l-4 border-primary"
                  : "hover:bg-gray-50"
              }`}
            >
              <VideoCard video={video} layout="list" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlaylistSidebar;
