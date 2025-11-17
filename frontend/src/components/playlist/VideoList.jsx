import React from "react";
import { GripVertical } from "lucide-react";
import VideoCard from "../VideoCard";

const VideoList = ({
  videos,
  currentVideoId,
  // watchedVideos,
  // onVideoPlay,
  // onVideoRemove,
}) => {
  return (
    <div className="space-y-2">
      {videos.map((video, index) => {
        const isPlaying = currentVideoId === video.id;

        return (
          <div
            className={`group flex items-center rounded-xl border transition-all duration-200 ${
              isPlaying
                ? "bg-primary/10 border-primary shadow-md"
                : "bg-white border-borderColor hover:shadow-sm"
            }`}
            key={video.id}
          >
            <div className="flex max-s:flex-col-reverse items-center">
              <GripVertical
                size={18}
                className="text-gray-300 opacity-0 group-hover:opacity-100 hover:scale-125 transition-all duration-200 cursor-grab"
              />
              <span
                className={`font-semibold text-sm sm:mr-1 text-center ${
                  isPlaying ? "text-primary" : "text-gray-600"
                }`}
              >
                {index + 1}
              </span>
            </div>

            <div className="flex-1 scale-y-110 hover:scale-y-105 transition-all duration-350">
              <VideoCard video={video} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(VideoList);
