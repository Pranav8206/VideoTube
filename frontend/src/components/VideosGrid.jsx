// VideosGrid.jsx
import React from "react";
import VideoCard from "./VideoCard";

const VideosGrid = ({ videos = [], layout = "grid", searchQuery = "" }) => {
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div
        className={
          layout == "grid"
            ? "grid gap-4 s:gap-2 sm:gap-6 grid-cols-1 s:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 "
            : "w-full flex flex-col gap-2  "
        }
      >
        {filteredVideos.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-26 text-xl font-medium">
            Server is not responding.
            <p className="text-sm mt-4"> Please try again later.</p>
          </div>
        ) : (
          filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} layout={layout} />
          ))
        )}
      </div>
    </div>
  );
};

export default VideosGrid;
