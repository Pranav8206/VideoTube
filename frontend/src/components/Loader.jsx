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
    <div
      className={`absolute inset-0 z-30 flex flex-col items-center bg-white justify-center gap-4 ${className}`}
    >
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 border-[4px] rounded-full border-dashed border-l-primary border-b-primary/60 border-r-primary/30 border-t-white animate-[spin_2s_ease-in-out_infinite] "/>
        <div className="absolute inset-[12px] border-[3px] border-transparent border-l-primary/50 border-r-primary/50 rounded-full animate-[spin_1s_ease-in-out_infinite_alternate] "/>
      </div>
    </div>
  );
};

export default Loader;
