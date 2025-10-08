import React from "react";

const ToggleSwitch = ({ checked, onChange, disabled = false }) => {
  const handleKeyDown = (e) => {
    if (!disabled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full 
        transition-colors duration-500 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2
        ${checked ? "bg-primary" : "bg-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span
        className={`
          inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md
          transition-transform duration-300 ease-in
          ${checked ? "translate-x-5.5" : "translate-x-1"}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;
