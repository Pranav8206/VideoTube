import React, { useContext, useEffect, useState } from "react";
import VideosGrid from "../VideosGrid";
import CategoriesSlider from "./CategoriesSlider";
import { AppContext } from "../../context/AppContext";
import SkeletonCard from "./SkeletonCard";

const HomeContent = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { fetchAllVideos } = useContext(AppContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { id: "all", label: "All" },
    { id: "technology", label: "Technology" },
    { id: "music", label: "Music" },
    { id: "animals", label: "Animals" },
    { id: "education", label: "Education" },
    { id: "entertainment", label: "Entertainment" },
    { id: "news", label: "News" },
    { id: "food", label: "Food" },
  ];

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      setError("");
      try {
        const allVideos = await fetchAllVideos();
        setVideos(allVideos);
        console.log("vides", allVideos);
      } catch (error) {
        setError("Failed to load videos. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, [fetchAllVideos]);
  
  const filteredVideos =
    activeCategory === "all"
      ? videos
      : videos.filter(
          (video) => video.category && video.category.includes(activeCategory)
        );

  return (
    <div className="w-full min-h-screen py-0.5 s:py-2">
      <div className="mb-3 px-2 s:px-2 ">
        {/* Category Filters with Slider */}
        {categories.length > 0 && (
          <div className="w-full">
            <CategoriesSlider
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>
        )}
      </div>
      {/* Video Grid */}
      {loading && (
        <div className="w-full grid gap-4 s:gap-2 sm:gap-6 grid-cols-1 s:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ">
          {[...Array(12)].map((_, i) => (
            <div key={`skeleton-${i}`}>
              <SkeletonCard />
            </div>
          ))}
        </div>
      )}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}
      {!loading && !error && filteredVideos.length != 0 && (
        <VideosGrid videos={filteredVideos} layout="grid" />
      )}

      {!loading && !error && filteredVideos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No videos found in this category
        </div>
      )}
    </div>
  );
};

export default HomeContent;
