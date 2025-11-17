// YourPlaylists.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Loader as LoaderIcon,
  PlusCircle,
  Pencil,
  Trash2,
  PlayCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PlaylistModal from "./PlaylistModal";
import ConfirmModal from "../ConfirmModal";
import Loader from "../Loader";

const YourPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

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
      await axios.delete(`/api/v1/playlists/${id}`, {
        withCredentials: true,
      });
      fetchPlaylists();
    } catch (error) {
      console.error(error?.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
              Your Playlists
            </h1>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center w-full max-sm:self-end border max-sm:max-w-25 gap-2 bg-primary cursor-pointer text-white px-0 sm:px-6 py-2 sm:py-3 rounded-lg font-medium"
          >
            <PlusCircle size={20} />
            <span>
              Create <span className="max-sm:hidden">Playlist</span>
            </span>
          </button>
        </div>
      </div>

      {/* Playlists Grid */}
      {playlists.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((pl) => (
            <div
              key={pl._id}
              className="group bg-white border border-borderColor rounded-xl overflow-hidden"
            >
              {/* Card Content - Clickable */}
              <div
                onClick={() => navigate(`/p/${pl._id}`)}
                className="p-6 cursor-pointer"
              >
                <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                  <PlayCircle className="text-primary" size={48} />
                </div>
                <h3 className="font-bold text-lg text-dark mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {pl.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                  {pl.description || "No description"}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-light rounded-full text-sm text-dark font-medium">
                  <PlayCircle size={14} className="text-primary" />
                  <span>{pl.videos?.length || 0} videos</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-4 flex items-center gap-2 border-t border-borderColor pt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditData(pl);
                    setModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-light hover:bg-gray-200 text-dark rounded-lg transition-colors font-medium text-sm"
                >
                  <Pencil size={16} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => {
                    setConfirmModal({
                      action: () => deletePlaylist(pl._id),
                      message: `Are you sure you want to delete this playlist?`,
                    });
                  }}
                  disabled={deleteLoading === pl._id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading === pl._id ? (
                    <LoaderIcon size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="bg-white border-2 border-dashed border-borderColor rounded-2xl p-5 py-10 text-center">
          <div className="w-20 h-20 bg-light rounded-full flex items-center justify-center mx-auto mb-4">
            <PlayCircle className="text-primary" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-dark mb-2">
            No playlists yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Create your first playlist to start organizing your favorite videos
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dull text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            <PlusCircle size={20} />
            <span>Create First Playlist</span>
          </button>
        </div>
      )}

      {/* Modal */}
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
