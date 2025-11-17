import React, { useContext, useEffect } from "react";
import PlaylistContent from "../components/playlist/PlaylistContent";
import { useNavigate, useParams } from "react-router-dom";
import HistoryPage from "../components/playlistPages/HistoryPage";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import LikePage from "../components/playlistPages/LikePage";
import YourPlaylist from "../components/playlistPages/YourPlaylist";

const Playlist = () => {
  const { user } = useContext(AppContext);
  const { playlistId } = useParams();
  const navigate = useNavigate();
  console.log("id",playlistId);
  

  useEffect(() => {
    if (!user) {
      if (playlistId === "history") {
        toast.success("Log in to store watch history");
      } else if (playlistId === "liked") {
        toast.success("Log in to view liked videos");
      } else {
        toast.success("Log in to view your playlists");
      }
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

  if (playlistId === "your-playlists") {
    return <YourPlaylist />;
  }

  return (
    <div>
      <PlaylistContent playlistId={playlistId} />
    </div>
  );
};

export default Playlist;
