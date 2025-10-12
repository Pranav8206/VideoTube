import React, { useContext, useEffect, useState } from "react";
import VideosGrid from "../components/VideosGrid";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";

const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { axios } = useContext(AppContext);

  useEffect(() => {
    const fetchTrendingVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "/api/v1/videos?sortBy=views&sortType=desc&limit=10"
        );
        const data = response.data;
        if (data.statusCode === 200) {
          setVideos(data.data || []);
        } else {
          setError(
            `Failed to fetch trending videos: ${
              data.message || "Unknown error"
            }`
          );
        }
      } catch (err) {
        console.error("Fetch error:", err.message, err.response?.data);
        setError(`An error occurred while fetching videos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingVideos();
  }, []);

  if (loading)
    return (
      <div className="relative h-screen">
        <Loader />
      </div>
    );
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!loading && !error && videos.length === 0) {
    return <div className="text-center py-8">No trending videos available</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-800">Trending</h1>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-0.5 s:px-4 md:px-6 pb-8">
        <VideosGrid videos={videos} layout="list" />
      </div>
    </div>
  );
};

export default Trending;
