import { Play } from "lucide-react";
import React, { useState } from "react";

const UploadPreview = ({ title, description, thumbnailPreview }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Preview
      </label>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition">
          <div className="relative w-40 md:w-1/2 aspect-video rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {thumbnailPreview ? (
              <>
                <img
                  src={thumbnailPreview}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-150"
                />

                {/* Duration Tag */}
                <span className="absolute bg-black/70 text-white rounded font-medium bottom-1 right-1 text-[10px] sm:text-xs px-1.5 py-0.5">
                  0:00
                </span>

                {/* Hover Overlay */}
                {isHovered && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-purple-600 hover:bg-purple-700 transition rounded-full flex items-center justify-center w-10 h-10 shadow-lg">
                      <Play size={20} className="text-white" />
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
          <div className="min-w-1/2 flex-1 h-full pt-1">
            <div className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
              {title || "Untitled Video"}
            </div>
            <div className="text-xs text-gray-500 line-clamp-2">
              {description || "No description provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPreview;
