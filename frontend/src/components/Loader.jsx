import React from "react";

const Loader = ({className="bg-dark/80"}) => {
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${className} `}>
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
