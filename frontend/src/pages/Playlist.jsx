import React, { useContext, useEffect } from "react";
import PlaylistContent from "../components/playlist/PlaylistContent";
import { useNavigate, useParams } from "react-router-dom";
import HistoryPage from "../components/HistoryPage";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Playlist = () => {
  const { user } = useContext(AppContext);
  const { playlistId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.success("Log in to view watch history");
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null;

  if (playlistId === "history") {
    return <HistoryPage />;
  }

  if (playlistId === "liked") {
    return <LikePage />;
  }

  return (
    <div>
      <PlaylistContent />
    </div>
  );
};

export default Playlist;
