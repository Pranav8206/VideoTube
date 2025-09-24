// VideosGrid.jsx
import React from "react";
import VideoCard from "./VideoCard";

const VideosGrid = ({ videos = [] }) => {
  return (
    <div className="w-full">
      <div className="grid gap-4 s:gap-2 sm:gap-6 grid-cols-1 s:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ">
        {videos.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-16 text-lg font-medium">
            No videos found.
          </div>
        ) : (
          videos.map((video) => (
            <VideoCard key={video.id} video={video} layout="grid" />
          ))
        )}
      </div>
    </div>
  );
};

export default VideosGrid;
