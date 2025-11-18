import React, { useState } from "react";
import { X, Loader } from "lucide-react";
import toast from "react-hot-toast";

const EditVideoModal = ({ video, onUpdate, onClose, axios }) => {
  const [editForm, setEditForm] = useState({
    title: video.title || "",
    description: video.description || "",
    category: video.category || [],
    thumbnail: null,
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdateVideo = async (e) => {
    e.preventDefault();

    if (!editForm.category || editForm.category.length === 0) {
      setError("Please select at least one category");
      toast.error("Please select at least one category");
      return;
    }

    if (editForm.category.length > 5) {
      setError("Please select maximum 5 categories");
      toast.error("Please select maximum 5 categories");
      return;
    }
    setUpdateLoading(true);
    setError("");

    try {
      const formData = new FormData();
      // Always send required fields
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      console.log(editForm.category);

      formData.append("category", JSON.stringify(editForm.category));

      // Only send thumbnail if a new one is selected
      if (editForm.thumbnail) {
        formData.append("thumbnail", editForm.thumbnail);
      }

      const res = await axios.patch(
        `/api/v1/videos/${video._id}/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log(formData);
      console.log(res.data);

      // Use the response data if available, otherwise use form data
      const updatedVideoData = res?.data?.data || {
        ...video,
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        // Only update thumbnail URL if backend returns it, otherwise keep original
        thumbnail: res?.data?.data?.thumbnail || video.thumbnail,
      };

      onUpdate(updatedVideoData);
      toast.success("Video updated successfully");
      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update video";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl w-[90vw] sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-2 sm:p-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 px-2 sm:px-5 pt-1">
            Edit Video
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
            aria-label="Close edit modal"
            disabled={updateLoading}
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleUpdateVideo} className="px-4 sm:px-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs sm:text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-xs sm:text-sm"
              required
              minLength={10}
              disabled={updateLoading}
              aria-required="true"
              placeholder="Enter video title (min 10 characters)"
            />
            <p className="text-xs text-gray-500 mt-1">
              {editForm.title.length}/10 characters minimum
            </p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg  focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-xs sm:text-sm  "
              required
              disabled={updateLoading}
              aria-required="true"
              placeholder="Enter video description"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Categories <span className="text-red-500">*</span> (Select 1-5)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "music", label: "Music" },
                { value: "animals", label: "Animals" },
                { value: "education", label: "Education" },
                { value: "entertainment", label: "Entertainment" },
                { value: "technology", label: "Technology" },
                { value: "news", label: "News" },
                { value: "food", label: "Food" },
              ].map((cat) => {
                const isChecked = editForm.category?.includes(cat.value);
                const isDisabled =
                  updateLoading ||
                  (!isChecked && editForm.category?.length >= 5);

                return (
                  <label
                    key={cat.value}
                    className={`flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all text-xs sm:text-sm ${
                      isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={cat.value}
                      checked={isChecked}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEditForm({
                          ...editForm,
                          category: e.target.checked
                            ? [...(editForm.category || []), value]
                            : editForm.category.filter((c) => c !== value),
                        });
                      }}
                      className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
                      disabled={isDisabled}
                    />
                    <span>{cat.label}</span>
                  </label>
                );
              })}
            </div>
            {editForm.category?.length === 0 && (
              <p className="text-red-500 text-xs mt-1">
                Select at least one category
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {editForm.category?.length || 0}/5 categories selected
            </p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Thumbnail (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditForm({ ...editForm, thumbnail: e.target.files[0] })
              }
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all text-xs sm:text-sm file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed "
              disabled={updateLoading}
            />
            {editForm.thumbnail && (
              <div className="mt-2 p-2 bg-purple-50 rounded-lg flex items-center justify-between">
                <p className="text-xs text-purple-700 truncate flex-1">
                  {editForm.thumbnail.name}
                </p>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, thumbnail: null })}
                  className="ml-2 text-purple-700 hover:text-purple-900"
                  disabled={updateLoading}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-3 pb-6 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-gray-700 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={updateLoading}
              aria-label="Cancel edit"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white rounded-lg hover:bg-primary/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium cursor-pointer"
              disabled={updateLoading}
              aria-label="Update video"
            >
              {updateLoading ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Video"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVideoModal;
