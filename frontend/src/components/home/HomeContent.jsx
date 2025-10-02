import React, { useState } from "react";
import { videos } from "../../utils/videosData";

import VideosGrid from "../VideosGrid";
import CategoriesSlider from "./CategoriesSlider";

const HomeContent = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All" },
    { id: "tech", label: "Technology" },
    { id: "gaming", label: "Gaming" },
    { id: "music", label: "Music" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "education", label: "Education" },
    { id: "entertainment", label: "Entertainment" },
    { id: "sports", label: "Sports" },
    { id: "news", label: "News" },
    { id: "science", label: "Science" },
  ];

  return (
    <div className="w-full min-h-screen py-0.5 s:py-2">
      <div className="mb-3 px-2 s:px-2 ">
        {/* Category Filters with Slider */}
        {categories.length > 0 && (
          <div className="w-full">
            <CategoriesSlider
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        )}
      </div>

      {/* Video Grid */}
      <VideosGrid videos={videos} layout="grid" />
    </div>
  );
};

export default HomeContent;
