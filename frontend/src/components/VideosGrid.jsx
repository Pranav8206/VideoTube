// VideosGrid.jsx
import React from "react";
import VideoCard from "./VideoCard";
import { Link } from "react-router-dom";

const VideosGrid = ({ videos = [], layout = "grid", searchQuery = "", forChannelPage=false}) => {
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
        {filteredVideos ? (
          filteredVideos.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-6 text-xl font-medium">
              Video not uploaded yet.
            </div>
          ) : (
            filteredVideos.map((video, i) => (
              <VideoCard key={video.id || i} video={video} layout={layout} forChannelPage={forChannelPage}/>
            ))
          )
        ) : (
          <div className="col-span-full text-center text-gray-500 py-26 text-xl font-medium">
            Server is not responding.
            <p className="text-sm mt-4 gap-2">
              {" "}
              <span> Please</span>
              <Link to="/" className="text-blue-500 hover:underline px-1">
                retry
              </Link>
              <span>again later.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosGrid;
