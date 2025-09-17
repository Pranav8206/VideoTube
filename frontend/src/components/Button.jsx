import React, { useState, useRef, useEffect } from "react";

// Base Button Component
const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50";

  const variants = {
    primary: "bg-purple-400 hover:bg-purple-500 text-white",
    secondary: "bg-purple-100 hover:bg-purple-200 text-black",
    ghost: "hover:bg-purple-100  text-purple-700 ",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    info: " hover:bg-purple-50 text-primary ",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-xl",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
