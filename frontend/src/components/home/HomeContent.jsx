import React, { useState } from "react";
import VideoSection from "./VideoSection";
import {videos} from "../../utils/videosData"

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
    <div className="min-h-screen">
      <VideoSection
        videos={videos}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
    </div>
  );
};

export default HomeContent;
