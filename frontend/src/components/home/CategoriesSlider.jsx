import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoriesSlider = ({ categories, activeCategory, onCategoryChange }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 2
      );
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200; // a bit wider for smoother snap
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, [categories]);

  return (
    <div className="relative flex  items-center gap-2">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 z-10 flex-shrink-0 p-1.5 rounded-full bg-gray-200 border border-purple-400 shadow-2xl hover:shadow-md hover:bg-gray-300 transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft size={16} className="text-gray-800" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth px-6 [scrollbar-width:none] [ms-overflow-style:none] "
        // style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex-shrink-0 px-2 sm:px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap snap-center my-0.5 ${
              activeCategory === category.id
                ? "bg-gradient-to-r from-primary to-purple-500 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-sm"
            } cursor-pointer`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 z-10 flex-shrink-0 p-1.5 rounded-full bg-gray-200 border border-purple-400 shadow-2xl hover:shadow-md hover:bg-gray-300 transition-all duration-200 cursor-pointer"
        >
          <ChevronRight size={16} className="text-black" />
        </button>
      )}
    </div>
  );
};

export default CategoriesSlider;
