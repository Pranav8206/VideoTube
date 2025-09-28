import React, { useMemo, useState } from "react";
import VideosGrid from "../components/VideosGrid";
import { trendingVideos } from "../utils/videosData";

const Trending = () => {
  const [active, setActive] = useState("now");

  const trendingVideosList = useMemo(() => trendingVideos, [active]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-800">Trending</h1>
              <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-0.5 s:px-4 md:px-6 pb-8">
        <VideosGrid videos={trendingVideosList} layout="list" />
      </div>
    </div>
  );
};

export default Trending;
