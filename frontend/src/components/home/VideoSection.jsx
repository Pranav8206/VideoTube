import React from "react";
import VideosGrid from "../VideosGrid";
import CategoriesSlider from "./CategoriesSlider";

const VideoSection = ({
  videos,
  categories = [],
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="w-full  max-s:px-4 max-sm:px-2 sm:pr-6 sm:pl-1 max-s:py-1 py-2">
      <div className="mb-3 px-1 s:px-2 ">
        {/* Category Filters with Slider */}
        {categories.length > 0 && (
          <div className="w-full">
            <CategoriesSlider
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={onCategoryChange}
            />
          </div>
        )}
      </div>

      {/* Video Grid */}
      <VideosGrid videos={videos} />
    </div>
  );
};

export default VideoSection;
