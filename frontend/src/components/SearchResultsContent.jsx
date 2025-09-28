import React, { useState } from "react";
import VideoCard from "./VideoCard";
import PlaylistCard from "./playlist/PlaylistCard";
import { searchData } from "../utils/videosData";

const SearchResultsContent = () => {
  return (
    <div className={`p-4 py-10 min-h-screen bg-gray-50 text-gray-800`}>
      {/* Search Results */}
      <div className="grid gap-2">
        {searchData.playlists.map((playlist, index) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
        {searchData.videos.map((video, index) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default SearchResultsContent;
