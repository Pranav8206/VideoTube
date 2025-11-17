import React from "react";
import { Plus } from "lucide-react";

const PlaylistSettings = ({ playlist, onPrivacyToggle, onAddVideos }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
        Playlist Settings
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Privacy</p>
            <p className="text-xs sm:text-sm text-gray-600">
              {playlist.isPublic
                ? "Anyone can view this playlist"
                : "Only you can view this playlist"}
            </p>
          </div>

          <button
            onClick={onPrivacyToggle}
            type="button"
            aria-label={`Make playlist ${playlist.isPublic ? "private" : "public"}`}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              playlist.isPublic ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200 ${
                playlist.isPublic ? "left-6" : "left-0.5"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Add Videos</p>
            <p className="text-xs sm:text-sm text-gray-600">
              Search and add new videos to this playlist
            </p>
          </div>
          <button
            onClick={onAddVideos}
            type="button"
            className="bg-primary hover:bg-primary-dull text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium shadow-md hover:shadow-lg"
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlaylistSettings);
