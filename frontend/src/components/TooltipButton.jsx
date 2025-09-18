import React from "react";

const TooltipButton = ({
  children,
  onClick,
  tooltipText,
  className,
  ariaLabel,
  onDoubleClick,
}) => {
  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        aria-label={ariaLabel || tooltipText}
        className={`peer transition-colors p-1 ${className}`}
      >
        {children}
      </button>

      {tooltipText && (
        <span
          className="
            absolute -top-8 left-1/2 -translate-x-1/2 z-20
            invisible opacity-0 scale-95 pointer-events-none
            transition-all duration-150 ease-out
            peer-hover:visible peer-hover:opacity-100 peer-hover:scale-100
            bg-[var(--color-dark)]/90 text-[var(--color-primary)]
            rounded-md px-2 py-1 text-xs font-medium shadow-md
            whitespace-nowrap
          "
        >
          {tooltipText}
        </span>
      )}
    </div>
  );
};

export default TooltipButton;
