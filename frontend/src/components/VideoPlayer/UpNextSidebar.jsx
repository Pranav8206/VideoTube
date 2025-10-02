import React from "react";

const UpNextSidebar = ({ videos }) => {
  return (
    <div className="w-[320px] bg-white rounded-l-2xl p-6 shadow-lg flex-shrink-0">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Up Next</h3>
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-3">
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">
                  {video.title}
                </h4>
                <p className="text-purple-600 text-xs font-medium mb-1">
                  {video.channel}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{video.subscribers}</span>
                  <span>•</span>
                  <span>{video.views}</span>
                </div>

                {/* Avatar */}
                <div className="mt-2">
                  <img
                    src={video.channelAvatar}
                    alt={video.channel}
                    className="w-6 h-6 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpNextSidebar;
