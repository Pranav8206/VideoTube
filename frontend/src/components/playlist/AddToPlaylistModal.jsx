import React, { useContext, useState, useEffect, useCallback } from "react";
import { Plus, X, Loader2, BookmarkPlus } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddToPlaylistModal = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(null);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const { showAddToPlaylistModal, setShowAddToPlaylistModal, axios } =
    useContext(AppContext);

  const fetchPlaylists = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/playlists", {
        withCredentials: true,
      });
      console.log("res in add to playlist modal", res.data);

      setPlaylists(res?.data.data?.userPlaylist || []);
    } catch (err) {
      console.error(
        err?.response?.data?.message || "Failed to fetch playlists"
      );
    } finally {
      setLoading(false);
    }
  }, [showAddToPlaylistModal]);

  const addToPlaylist = async (playlistId) => {
    try {
      setAdding(playlistId);
      const res = await axios.patch(
        `/api/v1/playlists/add/${playlistId}/${showAddToPlaylistModal.videoId}`,
        {},
        {
          withCredentials: true,
        }
      );
      setShowAddToPlaylistModal({
        show: false,
        videoId: null,
      });
      toast.success(res.data?.data.message || "Added to playlist");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to add video to playlist"
      );
    } finally {
      setAdding(null);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      setCreating(true);
      const res = await axios.post(
        "/api/v1/playlists",
        { name: newPlaylistName, description: newPlaylistDescription },
        {
          withCredentials: true,
        }
      );
      console.log("in create plasldkfjs", res);

      if (res.data.success) {
        setNewPlaylistName("");
        setNewPlaylistDescription("");
        setShowCreateNew(false);
        fetchPlaylists();
        toast.success("Playlist created successfully");
      }
    } catch (err) {
      console.error(
        err?.response?.data?.message || "Failed to create playlist"
      );
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (showAddToPlaylistModal) {
      fetchPlaylists();
    }
  }, [showAddToPlaylistModal]);

  if (!showAddToPlaylistModal.show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 ">
      {/* Backdrop */}
      <div
        onClick={(e) => {
          setShowAddToPlaylistModal({ show: false, videoId: null });
          e.stopPropagation();
        }}
        className="absolute inset-0 bg-black/10 cursor-pointer"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden z-10 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <div className="flex  gap-2 items-center ">
            <h2 className="text-xl font-semibold text-gray-900">
              Save to playlist
            </h2>
            {!showCreateNew && (
              <button
                onClick={() => setShowCreateNew(true)}
                className=" w-22 flex items-center justify-center p-1 gap-2 bg-primary text-white  rounded-full cursor-pointer"
              >
                <Plus
                  size={20}
                  className="border-2 border-white rounded-full "
                />
                <span className="font-semibold">New</span>
              </button>
            )}
          </div>
          <button
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
            onClick={() => setShowAddToPlaylistModal({ show: false, videoId: null })}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-primary-500" size={32} />
            </div>
          ) : (
            <>
              {showCreateNew && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Playlist name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createPlaylist}
                      disabled={!newPlaylistName.trim() || creating}
                      className="flex-1 px-4 py-2 cursor-pointer bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {creating ? "Creating..." : "Create"}
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateNew(false);
                        setNewPlaylistName("");
                      }}
                      className="px-4 py-2 bg-gray-200 cursor-pointer text-gray-700 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Playlist List */}
              {playlists.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">No playlists yet</p>
                  <p className="text-sm">Create your first playlist above</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist._id}
                      onClick={() => addToPlaylist(playlist._id)}
                      disabled={adding === playlist._id}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group duration-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-light to-light rounded flex items-center justify-center text-dark font-semibold group-hover:from-primary/10 group-hover:to-primary-dull/10 group-hover:text-primary transition-all duration-300">
                          {playlist.name?.[0]?.toUpperCase() || "P"}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">
                            {playlist.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {playlist.videos?.length || 0} videos
                          </p>
                        </div>
                      </div>
                      {adding === playlist._id ? (
                        <Loader2
                          className="animate-spin text-primary"
                          size={20}
                        />
                      ) :
                      <BookmarkPlus size={20} className="group-hover:text-primary/60 transition-all duration-300" />}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
