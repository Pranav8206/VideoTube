import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { X, Loader } from "lucide-react";

const PlaylistModal = ({ close, refresh, editData }) => {
  const [name, setName] = useState(editData?.name || "");
  const [description, setDescription] = useState(editData?.description || "");
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(editData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Playlist name is required");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await axios.patch(
          `/api/v1/playlists/${editData._id}`,
          { name: name.trim(), description: description.trim() },
          { withCredentials: true }
        );
        toast.success("Playlist updated successfully");
      } else {
        await axios.post(
          "/api/v1/playlists",
          { name: name.trim(), description: description.trim() },
          { withCredentials: true }
        );
        toast.success("Playlist created successfully");
      }

      refresh();
      close();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-borderColor">
          <div>
            <h2 className="text-2xl font-bold text-dark">
              {isEdit ? "Edit Playlist" : "Create New Playlist"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isEdit
                ? "Update your playlist details"
                : "Add a new playlist to organize your videos"}
            </p>
          </div>
          <button
            onClick={close}
            className="p-2 hover:bg-light cursor-pointer rounded-full transition-colors"
            disabled={loading}
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Playlist Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="e.g., My Favorite Videos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {name.length}/100 characters
            </p>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 border border-borderColor rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              placeholder="Describe what this playlist is about..."
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-borderColor text-dark rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 px-6 py-3 bg-primary cursor-pointer text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span>{isEdit ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <span>{isEdit ? "Update Playlist" : "Create Playlist"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaylistModal;
