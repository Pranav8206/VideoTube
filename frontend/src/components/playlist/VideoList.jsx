import React from "react";
import { CircleMinus, GripVertical } from "lucide-react";
import VideoCard from "../VideoCard";

const VideoList = ({
  videos,
  currentVideoId,
  // onVideoPlay,
  onVideoRemove,
}) => {
  return (
    <div className="space-y-2">
      {videos?.map((video, index) => {
        const isPlaying = currentVideoId === video.id;

        return (
          <div
            className={`group flex items-center rounded-xl border transition-all duration-200 ${
              isPlaying
                ? "bg-primary/10 border-primary shadow-md"
                : "bg-white border-borderColor"
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

            <div className="flex-1 scale-y-105 transition-all duration-350">
              <VideoCard video={video} showMoreIcon={false} />

              <button
                className="absolute top-1 right-0 p-0.5 bg-white text-gray-500 cursor-pointer rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onVideoRemove(video._id);
                }}
              >
                <CircleMinus size={20} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(VideoList);
