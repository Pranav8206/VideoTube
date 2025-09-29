import React from "react";

const TooltipButton = ({
  children,
  onClick,
  tooltipText,
  className,
  ariaLabel,
  onDoubleClick,
  position = "top"
}) => {
  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        aria-label={ariaLabel || tooltipText}
        className={`peer transition-colors p-0.5 ${className}`}
      >
        {children}
      </button>

      {tooltipText && (
        <span
          className={`
            absolute ${position === "top" ? "-top-7 left-1/2" : " top-0 -left-[230%] "}  -translate-x-1/2 z-40 invisible opacity-0 scale-95 pointer-events-none transition-all -150 ease-out peer-hover:visible peer-hover:opacity-100 peer-hover:scale-100 bg-dark/90 text-primary rounded-md px-2 py-1 text-xs font-medium shadow-md whitespace-nowrap `}
        >
          {tooltipText}
        </span>
      )}
    </div>
  );
};

export default TooltipButton;
