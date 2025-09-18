import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RectangleHorizontal,
  Monitor,
  RotateCcw,
  RotateCw,
  Repeat,
  PictureInPicture,
  Repeat1,
} from "lucide-react";
import Seekbar from "./Seekbar";
import TooltipButton from "../TooltipButton";

const Controls = ({
  isPlaying,
  isMuted,
  volume,
  currentTime,
  duration,
  bufferedTime,
  playbackRate,
  isLoop,
  isPiP,
  isCinemaMode,
  isFullscreen,
  effectiveSources,
  currentSourceIndex,
  togglePlay,
  toggleMute,
  handleVolumeChange,
  skipTime,
  seek,
  formatTime,
  changePlaybackRate,
  handleChangeQuality,
  togglePiP,
  toggleCinemaMode,
  toggleFullscreen,
  setIsLoop,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <Seekbar
        currentTime={currentTime}
        duration={duration}
        bufferedTime={bufferedTime}
        seek={seek}
        formatTime={formatTime}
      />

      <div className="flex items-center justify-between gap-2 sm:gap-3 text-purple-100 max-w-full box-border">
        <div className="flex justify-start items-center gap-2 sm:gap-3 ml-2 z-10">
          <TooltipButton
            onClick={togglePlay}
            tooltipText={isPlaying ? "Pause (Space)" : "Play (Space)"}
            className="hover:text-[var(--color-primary)] p-1 cursor-pointer"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </TooltipButton>
          <TooltipButton
            onClick={() => skipTime(-10)}
            tooltipText="Rewind 10s (←)"
            className="hover:text-[var(--color-primary)] p-1 cursor-pointer"
          >
            <RotateCcw size={18} />
          </TooltipButton>
          <TooltipButton
            onClick={() => skipTime(10)}
            tooltipText="Forward 10s (→)"
            className="hover:text-[var(--color-primary)] p-1 cursor-pointer"
          >
            <RotateCw size={18} />
          </TooltipButton>
          <div
            className="flex items-center justify-center gap-0"
            onMouseEnter={() => {
              setShowVolumeSlider(true);
              if (volumeTimeoutRef.current)
                clearTimeout(volumeTimeoutRef.current);
            }}
            onMouseLeave={() => {
              volumeTimeoutRef.current = setTimeout(() => {
                setShowVolumeSlider(false);
              }, 200);
            }}
          >
            <TooltipButton
              onClick={toggleMute}
              tooltipText={isMuted ? "Unmute (M)" : "Mute (M)"}
              className="hover:text-[var(--color-primary)] p-1 cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </TooltipButton>
            <div
              className={`flex items-center justify-center transition-all duration-900 ease-in ${
                showVolumeSlider
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-25 pointer-events-none hidden"
              }`}
              onMouseEnter={() => {
                setShowVolumeSlider(true);
                if (volumeTimeoutRef.current)
                  clearTimeout(volumeTimeoutRef.current);
              }}
              onMouseLeave={() => {
                volumeTimeoutRef.current = setTimeout(() => {
                  setShowVolumeSlider(false);
                }, 500);
              }}
            >
              <div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) =>
                    handleVolumeChange(parseFloat(e.target.value))
                  }
                  className="w-12 sm:w-16 h-2 bg-[var(--color-borderColor)]/90 rounded-full appearance-none cursor-pointer text-amber-700"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) ${
                      (isMuted ? 0 : volume) * 100
                    }%, var(--color-borderColor) ${
                      (isMuted ? 0 : volume) * 100
                    }%)`,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="text-xs font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        <div className="flex justify-end items-center gap-2 sm:gap-3 mr-2 z-10">
          <TooltipButton
            onClick={changePlaybackRate}
            tooltipText="Playback speed"
            className="hover:text-[var(--color-primary)] px-2 py-1 text-xs font-medium cursor-pointer"
          >
            {playbackRate}x
          </TooltipButton>
          {effectiveSources.length > 1 && (
            <select
              value={currentSourceIndex}
              onChange={(e) => handleChangeQuality(parseInt(e.target.value))}
              className="bg-[var(--color-dark)]/80 text-white rounded px-1 sm:px-2 py-1 text-xs hover:bg-[var(--color-dark)] transition-colors cursor-pointer"
              title="Quality"
            >
              {effectiveSources.map((s, i) => (
                <option key={i} value={i}>
                  {s.label}
                </option>
              ))}
            </select>
          )}
          <TooltipButton
            onClick={() => setIsLoop(!isLoop)}
            tooltipText={isLoop ? "Repeat Mode (L)" : "Non repeat mode (L)"}
            className={`hover:text-[var(--color-primary)] p-1 cursor-pointer ${
              isLoop ? "text-[var(--color-primary)]" : ""
            }`}
          >
            {!isLoop ? <Repeat size={18} /> : <Repeat1 size={18} />}
          </TooltipButton>
          {document.pictureInPictureEnabled && (
            <TooltipButton
              onClick={togglePiP}
              onDoubleClick={() => {}}
              tooltipText="Picture-in-Picture (P)"
              className={`hover:text-[var(--color-primary)] p-1 cursor-pointer ${
                isPiP ? "text-[var(--color-primary)]" : ""
              }`}
            >
              <PictureInPicture size={18} />
            </TooltipButton>
          )}
          <TooltipButton
            onClick={toggleCinemaMode}
            tooltipText={isCinemaMode ? "Default view (T)" : "Cinema mode (T)"}
            className="hover:text-[var(--color-primary)] p-1 cursor-pointer"
          >
            {isCinemaMode ? (
              <Monitor size={18} />
            ) : (
              <RectangleHorizontal size={18} />
            )}
          </TooltipButton>
          <TooltipButton
            onClick={toggleFullscreen}
            tooltipText={
              isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"
            }
            className="hover:text-[var(--color-primary)] p-1 cursor-pointer"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </TooltipButton>
        </div>
      </div>
    </div>
  );
};

export default Controls;
