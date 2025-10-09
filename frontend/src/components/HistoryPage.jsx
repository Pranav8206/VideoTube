import React, {  useEffect, useState } from "react";
import axios from "axios";
import VideosGrid from "./VideosGrid"; // adjust path as needed
import toast from "react-hot-toast";

const HistoryPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/v1/users/history"); // adjust endpoint
        setVideos(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load watch history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading watch history...
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-semibold mb-4">Watch History</h2>
      {videos.length ? (
        <VideosGrid videos={videos} layout="grid" />
      ) : (
        <div className="col-span-full text-center text-gray-500 py-6 text-xl font-medium">
          Please watch video to update history
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
