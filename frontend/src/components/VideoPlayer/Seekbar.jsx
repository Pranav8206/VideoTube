import React, { useRef, useState, useEffect, useCallback } from "react";

const Seekbar = ({ currentTime, duration, bufferedTime, seek, formatTime }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [previewTime, setPreviewTime] = useState(null);
  const [previewPercent, setPreviewPercent] = useState(null);
  const seekbarRef = useRef(null);

  const handleSetPreview = useCallback(
    (e) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const rect = seekbarRef.current?.getBoundingClientRect();
      if (rect && duration) {
        let percent = (clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent));
        setPreviewTime(percent * duration);
        setPreviewPercent(percent);
        return percent;
      }
      return null;
    },
    [duration]
  );

  const handleDragMove = useCallback(
    (e) => {
      const percent = handleSetPreview(e);
      if (percent !== null) {
        setDragTime(percent * duration);
      }
    },
    [handleSetPreview, duration]
  );

  const handleHoverMove = useCallback(
    (e) => {
      if (isDragging) return;
      handleSetPreview(e);
    },
    [handleSetPreview, isDragging]
  );

  const handleStart = useCallback(
    (e) => {
      setIsDragging(true);
      const percent = handleSetPreview(e);
      if (percent !== null) {
        setDragTime(percent * duration);
      }
    },
    [handleSetPreview, duration]
  );

  const handleSeekbarMouseUp = useCallback(() => {
    if (isDragging) {
      seek(dragTime);
      setIsDragging(false);
      setPreviewTime(null);
      setPreviewPercent(null);
    }
  }, [isDragging, dragTime, seek]);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handleDragMove(e);
      const handleTouchMove = (e) => {
        handleDragMove(e);
        e.preventDefault();
      };
      const handleUp = handleSeekbarMouseUp;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleUp);
      document.addEventListener("touchend", handleUp);
      document.addEventListener("touchcancel", handleUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("mouseup", handleUp);
        document.removeEventListener("touchend", handleUp);
        document.removeEventListener("touchcancel", handleUp);
      };
    }
  }, [isDragging, handleDragMove, handleSeekbarMouseUp]);

  const displayTime = isDragging ? dragTime : currentTime;
  const progressPercent = duration ? (displayTime / duration) * 100 : 0;
  const bufferPercent = duration ? (bufferedTime / duration) * 100 : 0;

  return (
    <div className="relative mb-4 z-10">
      <div
        ref={seekbarRef}
        className="h-2 bg-[var(--color-borderColor)]/60 rounded-full cursor-pointer group/seekbar relative"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onTouchMove={(e) => {
          if (isDragging) {
            e.preventDefault();
            handleDragMove(e);
          }
        }}
        onMouseMove={handleHoverMove}
        onMouseLeave={() => {
          if (!isDragging) {
            setPreviewTime(null);
            setPreviewPercent(null);
          }
        }}
      >
        {/* Buffer progress */}
        <div
          className="absolute inset-y-0 left-0 bg-[var(--color-borderColor)]/80 rounded-full"
          style={{ width: `${bufferPercent}%` }}
        />
        {/* Progress */}
        <div
          className="absolute inset-y-0 left-0 bg-[var(--color-primary)] rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
        {/* Scrubber */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--color-primary)] rounded-full shadow-lg border-2 border-white opacity-0 group-hover/seekbar:opacity-100 transition-opacity"
          style={{ left: `calc(${progressPercent}% - 8px)` }}
        />
        {/* Time preview */}
        {previewTime !== null && (
          <div
            className="absolute -top-8 bg-[var(--color-dark)]/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10"
            style={{
              left: `${previewPercent * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            {formatTime(previewTime)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Seekbar;
