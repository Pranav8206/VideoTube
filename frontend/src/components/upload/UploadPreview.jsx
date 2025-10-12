import {
  Play,
  Edit,
  Trash2,
  MoreHorizontal,
  MoreVertical,
  User,
} from "lucide-react";
import React, { useState } from "react";

const UploadPreview = ({ title, description, thumbnailPreview }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Preview*
      </label>

      <div className="flex flex-col gap-4">
        {/* Thumbnail Card */}
        <div
          className="relative bg-white rounded-xl border border-gray-200 shadow-sm flex items-start gap-1 sm:gap-4 hover:shadow-md transition-all"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Thumbnail */}
          <div className="relative w-28 xs:w-35 s:w-40 sm:w-48 aspect-video rounded-l-xl overflow-hidden bg-gray-100 ">
            {thumbnailPreview ? (
              <>
                <img
                  src={thumbnailPreview}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Duration Tag */}
                <span className="absolute bottom-2 right-2 bg-black/70 text-white rounded font-medium text-xs sm:text-sm px-2 py-1">
                  0:00
                </span>
                {/* Hover Overlay */}
                {isHovered && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-purple-600 hover:bg-purple-700 transition rounded-full flex items-center justify-center w-8 h-8 shadow-md">
                      <Play size={16} className="text-white" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No Thumbnail
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="flex-1 space-y-1 sm:space-y-3 px-1">
            <div className="font-semibold text-gray-900 line-clamp-2 leading-tight text-sm sm:text-base mt-1">
              {title || "Untitled Video"}
            </div>
            <div className="max-s:hidden text-xs sm:text-sm text-gray-500 line-clamp-1">
              {description || "No description provided."}
            </div>

            <div className="flex items-start gap-1 sm:gap-2">
              <div className="shrink-0">
                <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br bg-gray-400 border border-primary">
                  <User className="h-full w-full fill-white text-white" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-semibold text-primary cursor-pointer line-clamp-1 text-xs sm:text-sm">
                  Your channel name
                </p>
                <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-1 leading-tight whitespace-nowrap">
                  <span>0 views</span>
                  <span>•</span>
                  <span>0 sec ago</span>
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-2 right-2 flex gap-2 cursor-pointer hover:bg-gray-200 rounded-full p-0.5">
            <MoreVertical size={16} className="text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPreview;
