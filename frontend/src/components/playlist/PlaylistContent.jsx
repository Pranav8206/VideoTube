import React, { useState, useCallback, useEffect, useContext } from "react";
import PlaylistHeader from "./PlaylistHeader";
import VideoList from "./VideoList";
import { AppContext } from "../../context/AppContext";
import Loader from "../Loader";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PlaySquare } from "lucide-react";

const formatTotalDuration = (videos = []) => {
  const totalSeconds = videos.reduce((sum, v) => sum + (v.duration || 0), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const PlaylistPage = () => {
  const [currentVideoId, setCurrentVideoId] = useState(1);
  const [playlistData, setPlaylistData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { axios } = useContext(AppContext);
  const { playlistId } = useParams();

  const handlePlayAll = useCallback(() => {
    if (playlistData?.videos.length > 0) {
      setCurrentVideoId(playlistData?.videos[0].id);
    }
  }, [playlistData?.videos]);

  const handleShuffle = useCallback(() => {
    if (playlistData?.videos?.length > 0) {
      const randomIdx = Math.floor(Math.random() * playlistData.videos.length);
      setCurrentVideoId(playlistData.videos[randomIdx]._id);
    }
  }, [playlistData?.videos]);

  const handleVideoPlay = useCallback((id) => {
    setCurrentVideoId(id);
  }, []);

  const handleVideoRemove = useCallback(async (id) => {
    try {
      console.log(playlistId, "videoid", id);

      const res = await axios.patch(
        `/api/v1/playlists/remove/${playlistId}/${id}`,
        {},
        { withCredentials: true }
      );
      fetchData();
      console.log("Video remove from playlist:", res.data);
      toast.success(res?.data?.message || "Video remove from playlist");
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
      toast.error(
        error?.response?.data?.message || "Failed to remove video from playlist"
      );
    }
  }, []);

  const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/api/v1/playlists/${playlistId}`, {
          withCredentials: true,
        });

        const fetchedPlaylist = res?.data?.data;
        setPlaylistData(fetchedPlaylist || null);
      } catch (error) {
        console.error("Error fetching playlist:", error);
        setPlaylistData(null);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    if (playlistId) fetchData();
  }, [playlistId, axios]);

  const totalDuration = formatTotalDuration(playlistData?.videos);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main className=" space-y-3 min-h-screen max-w-7xl mx-auto gap-6">
      <PlaylistHeader
        playlist={playlistData}
        onPlayAll={handlePlayAll}
        onShuffle={handleShuffle}
      />
      {console.log("in the comp", playlistData)}
      {/* All videos in playlist */}
      <section className="px-0.5 sm:px-6 mt-4 mb-10">
        <div className="flex items-center justify-between mb-4 px-5 sm:px-20">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Videos ({playlistData?.videos?.length})
          </h2>
          <div className="text-sm text-gray-600">
            Total Duration: {totalDuration}
          </div>
        </div>

        <VideoList
          videos={playlistData?.videos}
          currentVideoId={currentVideoId}
          onVideoPlay={handleVideoPlay}
          onVideoRemove={handleVideoRemove}
        />
      </section>
    </main>
  );
};

export default PlaylistPage;
