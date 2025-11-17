import React, { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import VideoCard from "../VideoCard";
import EditVideoModal from "./EditVideoModal";
import {
  Edit,
  Eye,
  EyeOff,
  Loader,
  Trash,
  Info,
  FilePenLine,
} from "lucide-react";
import ConfirmModal from "../ConfirmModal";
import toast from "react-hot-toast";

const UserVideo = () => {
  const { user, axios } = useContext(AppContext);

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [showMenu, setShowMenu] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  const fetchVideos = useCallback(
    async (signal) => {
      try {
        const res = await axios.get(`/api/v1/videos?userId=${user._id}`, {
          signal,
        });
        const payload = res?.data?.data ?? [];
        setVideos(Array.isArray(payload) ? payload : []);
        setError("");
      } catch (err) {
        if (err?.name === "CanceledError" || err?.message === "canceled")
          return;
        setError(
          err.response?.data?.message || err.message || "Failed to fetch videos"
        );
      }
    },
    [axios, user?._id]
  );

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const initializeData = async () => {
      setLoading(true);
      try {
        await fetchVideos(controller.signal);
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    return () => controller.abort();
  }, [user?._id, fetchVideos]);

  const setVideoLoading = (videoId, val) =>
    setActionLoading((prev) => ({ ...prev, [videoId]: val }));

  const handleDelete = async (videoId) => {
    const prev = videos;
    setVideos((p) => p.filter((v) => v._id !== videoId));
    setVideoLoading(videoId, true);

    try {
      await axios.delete(`/api/v1/videos/${videoId}`, {
        withCredentials: true,
      });
      toast.success("Video deleted successfully");
    } catch (err) {
      setVideos(prev);
      toast.error(err.response?.data?.message || "Failed to delete video");
    } finally {
      setVideoLoading(videoId, false);
    }
  };

  const handleTogglePublish = async (videoId) => {
    const video = videos.find((v) => v._id === videoId);
    setVideoLoading(videoId, true);
    setVideos((prev) =>
      prev.map((v) =>
        v._id === videoId ? { ...v, isPublished: !v.isPublished } : v
      )
    );

    try {
      await axios.patch(
        `/api/v1/videos/${videoId}`,
        {},
        { withCredentials: true }
      );
      toast.success(`Video is now ${video.isPublished ? "private" : "public"}`);
    } catch (err) {
      // Revert on error
      setVideos((prev) =>
        prev.map((v) =>
          v._id === videoId ? { ...v, isPublished: video.isPublished } : v
        )
      );
      toast.error(err.response?.data?.message || "Failed to update video");
    } finally {
      setVideoLoading(videoId, false);
    }
  };

  const handleEdit = (video) => {
    setShowMenu(null);
    setEditModal(video);
  };

  const handleUpdateVideo = (updatedVideo) => {
    setVideos((prev) =>
      prev.map((v) => (v._id === updatedVideo._id ? updatedVideo : v))
    );
    setEditModal(null);
    toast.success("Video updated successfully");
  };

  const toggleMenu = (videoId) => {
    setShowMenu(showMenu === videoId ? null : videoId);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[50vh] w-full">
        <Loader className="w-12 h-12 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto sm:bg-gray-50 sm:rounded-tl-3xl p-2 sm:p-5 ">
      <h1 className="text-xl sm:text-2xl px-1 font-bold text-gray-900 mb-3 tracking-tight">
        Your Videos
      </h1>

      {error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <Info size={20} />
          {error}
        </div>
      ) : videos.length === 0 ? (
        <p className="text-gray-600 text-lg">You have no videos yet.</p>
      ) : (
        <div className="space-y-3">
          {videos.map((video) => (
            <div
              key={video._id}
              className="relative group"
              onMouseLeave={() => setShowMenu(null)}
            >
              <div className="relative">
                <VideoCard
                  video={video}
                  showMoreIcon={false}
                  disabled={!!actionLoading[video._id]}
                />

                <div
                  className={`absolute top-0.5 left-0.5 sm:top-2 sm:left-2 px-1.5 py-0.5 text-[11px] s:text-xs font-semibold rounded-full shadow-md border transition-all duration-200 ${
                    video.isPublished
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-yellow-100 text-yellow-700 border-yellow-300"
                  }`}
                >
                  {video.isPublished ? "Public" : "Private"}
                </div>

                {actionLoading[video._id] && (
                  <div className="absolute inset-0 bg-gray-200 bg-opacity-30 flex items-center justify-center rounded-lg">
                    <Loader className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}
              </div>

              {/* Mobile menu */}
              <div className="absolute bottom-1 right-1 sm:hidden">
                <button
                  onClick={() => toggleMenu(video._id)}
                  className="p-1 rounded-full bg-gray-100 cursor-pointer"
                  disabled={!!actionLoading[video._id]}
                  aria-label="Video options"
                >
                  <FilePenLine size={15} className="text-gray-700" />
                </button>

                {showMenu === video._id && (
                  <div className="absolute top-0 right-full w-35 bg-white rounded-lg shadow-xl  z-10 animate-fade-in border border-primary">
                    <button
                      onClick={() => handleEdit(video)}
                      className="w-full px-5 py-2 text-left cursor-pointer  flex items-center gap-3 text-sm "
                      aria-label="Edit video"
                    >
                      <Edit size={16} />
                      Edit Video
                    </button>
                    <button
                      onClick={() =>
                        setConfirmModal({
                          action: () => handleTogglePublish(video._id),
                          message: `Are you sure you want to make this video ${
                            video.isPublished ? "private" : "public"
                          } ?`,
                        })
                      }
                      className="w-full px-5 py-2 text-left cursor-pointer flex items-center gap-3 text-sm "
                      aria-label={
                        video.isPublished
                          ? "Make video private"
                          : "Make video public"
                      }
                    >
                      {video.isPublished ? (
                        <>
                          <EyeOff size={16} className="text-yellow-500" />
                          Make Private
                        </>
                      ) : (
                        <>
                          <Eye size={16} className="text-green-500" />
                          Make Public
                        </>
                      )}
                    </button>
                    <hr className="text-gray-300" />
                    <button
                      onClick={() =>
                        setConfirmModal({
                          action: () => handleDelete(video._id),
                          message: "Delete this video? This cannot be undone.",
                        })
                      }
                      className="w-full px-5 py-2 text-left cursor-pointer  flex items-center gap-3 text-sm text-red-600 "
                      aria-label="Delete video"
                    >
                      <Trash size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="hidden sm:flex absolute bottom-1 right-1 gap-2">
                <button
                  onClick={() => handleEdit(video)}
                  className="p-1.5 rounded-full hover:bg-gray-50   cursor-pointer"
                  disabled={!!actionLoading[video._id]}
                  aria-label="Edit video"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() =>
                    setConfirmModal({
                      action: () => handleTogglePublish(video._id),
                      message: `Are you sure you want to make this video ${
                        video.isPublished ? "private" : "public"
                      } ?`,
                    })
                  }
                  className="p-1.5 rounded-full hover:bg-gray-100   cursor-pointer"
                  disabled={!!actionLoading[video._id]}
                  aria-label={
                    video.isPublished
                      ? "Make video private"
                      : "Make video public"
                  }
                >
                  {video.isPublished ? (
                    <EyeOff size={16} className="text-yellow-600" />
                  ) : (
                    <Eye size={16} className="text-green-500" />
                  )}
                </button>
                <button
                  onClick={() =>
                    setConfirmModal({
                      action: () => handleDelete(video._id),
                      message: "Delete this video? This cannot be undone.",
                    })
                  }
                  className="p-1.5 rounded-full hover:bg-red-50   cursor-pointer"
                  disabled={!!actionLoading[video._id]}
                  aria-label="Delete video"
                >
                  <Trash size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editModal && (
        <EditVideoModal
          video={editModal}
          onUpdate={handleUpdateVideo}
          onClose={() => setEditModal(null)}
          axios={axios}
          user={user}
        />
      )}

      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={confirmModal.action}
          onClose={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
};

export default UserVideo;
