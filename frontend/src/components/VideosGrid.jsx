import React from "react";
import VideoCard from "./VideoCard";


const VideosGrid = ({ videos = [] }) => {
  return (
  <div className="w-[90%] max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2 sm:p-4">
      {videos.length === 0 ? (
        <div className="col-span-full text-center text-[var(--color-primary-dull)] py-10 text-lg font-medium">No videos found.</div>
      ) : (
        videos.map((video) => (
          <div key={video.id} className="flex justify-center">
            {/* Replace with <VideoCard video={video} /> in real usage */}
            <VideoCard video={video} layout="grid"/>
          </div>
        ))
      )}
    </div>
  );
};

export default VideosGrid;
