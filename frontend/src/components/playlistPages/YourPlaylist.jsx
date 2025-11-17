import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Loader as LoaderIcon,
  PlusCircle,
  PlayCircle,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PlaylistModal from "./PlaylistModal";
import ConfirmModal from "../ConfirmModal";
import Loader from "../Loader";
import PlaylistCard from "../playlist/PlaylistCard";

const YourPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null); // tracks which card's menu is open
  const navigate = useNavigate();

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/playlists", {
        withCredentials: true,
      });
      setPlaylists(res.data.data.userPlaylist || []);
    } catch (err) {
      console.error(err?.response?.data?.message || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const deletePlaylist = async (id) => {
    try {
      setDeleteLoading(id);
      await axios.delete(`/api/v1/playlists/${id}`, { withCredentials: true });
      fetchPlaylists();
      setMenuOpen(null);
    } catch (error) {
      console.error(error?.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Playlists</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition"
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline">Create Playlist</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {console.log(playlists)}

      {/* Grid */}
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 s:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((pl) => {
            const isMenuOpen = menuOpen === pl._id;
            return (
              <div
                key={pl._id}
                className="relative bg-white border border-gray-200 rounded-xl "
              >
                <div
                  onClick={() => navigate(`/p/${pl._id}`)}
                  className="cursor-pointer"
                >
                  <PlaylistCard
                    playlist={pl}
                    layout="grid"
                    hideMoreOptions={true}
                  />
                </div>

                <div className="absolute bottom-1 right-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(isMenuOpen ? null : pl._id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
                  >
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-9 bottom-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditData(pl);
                          setModalOpen(true);
                          setMenuOpen(null);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-sm"
                      >
                        <Pencil size={16} /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmModal({
                            action: () => deletePlaylist(pl._id),
                            message: "Delete this playlist permanently?",
                          });
                          setMenuOpen(null);
                        }}
                        disabled={deleteLoading === pl._id}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm disabled:opacity-50"
                      >
                        {deleteLoading === pl._id ? (
                          <LoaderIcon size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlayCircle size={40} className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
          <p className="text-gray-600 mb-6">Create your first playlist</p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium"
          >
            <PlusCircle size={20} /> Create Playlist
          </button>
        </div>
      )}

      {/* Modals */}
      {modalOpen && (
        <PlaylistModal
          close={() => {
            setModalOpen(false);
            setEditData(null);
          }}
          refresh={fetchPlaylists}
          editData={editData}
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

export default YourPlaylists;
