import React from "react";

const Loader = ({
  className = "bg-black/60 backdrop-blur-sm",
  size = "default", // "small", "default", "large"
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <div className={`absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 border-[3px] border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-[3px] border-transparent border-t-primary border-r-primary/70 rounded-full animate-spin"></div>
        <div className="absolute inset-[6px] border-[2px] border-transparent border-b-primary/50 border-l-primary/30 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
      </div>
    </div>
  );
};

export default Loader;
