import React, { useState, useEffect, useRef, useContext } from "react";
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
  Repeat1,
  PictureInPicture,
  MoreHorizontal,
} from "lucide-react";
import Seekbar from "./Seekbar";
import TooltipButton from "../TooltipButton";
import { AppContext } from "../../context/AppContext";

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
  isFullscreen,
  // effectiveSources,
  // currentSourceIndex,
  togglePlay,
  toggleMute,
  handleVolumeChange,
  skipTime,
  seek,
  formatTime,
  changePlaybackRate,
  // handleChangeQuality,
  togglePiP,
  toggleCinemaMode,
  toggleFullscreen,
  setIsLoop,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const volumeTimeoutRef = useRef(null);
  const { isCinemaMode } = useContext(AppContext);

  useEffect(() => {
    return () => {
      if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    };
  }, []);

  const handleVolumeHover = (enter) => {
    if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    if (enter) setShowVolumeSlider(true);
    else
      volumeTimeoutRef.current = setTimeout(() => {
        setShowVolumeSlider(false);
      }, 1000);
  };

  // auto-hide after 2 seconds when it’s true
  useEffect(() => {
    if (showVolumeSlider) {
      const timer = setTimeout(() => setShowVolumeSlider(false), 2000);
      return () => clearTimeout(timer); // cleanup on unmount or reset
    }
  }, [showVolumeSlider]);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 z-20">
      {/* Seekbar */}
      <Seekbar
        currentTime={currentTime}
        duration={duration}
        bufferedTime={bufferedTime}
        seek={seek}
        formatTime={formatTime}
      />

      {/* Controls */}
      <div className="flex items-center justify-between sm:gap-3 text-purple-100 max-w-full box-border">
        {/* Left controls */}
        <div className="flex items-center sm:gap-3 sm:ml-2">
          <TooltipButton
            onClick={togglePlay}
            tooltipText={isPlaying ? "Pause (__)" : "Play (__)"}
            className="hover:text-primary p-1 cursor-pointer"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </TooltipButton>

          <TooltipButton
            onClick={() => skipTime(-10)}
            tooltipText="Rewind 10s (←)"
            className="hover:text-primary p-1 cursor-pointer hidden sm:inline-block"
          >
            <RotateCcw size={18} />
          </TooltipButton>

          <TooltipButton
            onClick={() => skipTime(10)}
            tooltipText="Forward 10s (→)"
            className="hover:text-primary p-1 cursor-pointer hidden sm:inline-block"
          >
            <RotateCw size={18} />
          </TooltipButton>

          {/* Volume */}
          <div
            className="relative flex items-center px-1"
            onTouchStart={() => handleVolumeHover(true)}
          >
            <TooltipButton
              tooltipText={isMuted ? "Unmute (M)" : "Mute (M)"}
              className="hover:text-primary p-1 cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX
                  size={18}
                  onClick={toggleMute}
                  onMouseEnter={() => handleVolumeHover(true)}
                />
              ) : (
                <Volume2
                  size={18}
                  onClick={toggleMute}
                  onMouseEnter={() => handleVolumeHover(true)}
                />
              )}
            </TooltipButton>
            {showVolumeSlider && (
              <div className="w-14 s:w-16 sm:w-20 p-1  rounded shadow-md flex items-center justify-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) =>
                    handleVolumeChange(parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-borderColor/80 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) ${
                      (isMuted ? 0 : volume) * 100
                    }%, var(--color-borderColor) ${
                      (isMuted ? 0 : volume) * 100
                    }%)`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Time */}
          <div className="text-xs font-mono tracking-tighter">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3 mr-1 sm:mr-2">
          {/* Show main controls on medium+ screens */}
          <div className="hidden sm:flex items-center gap-2">
            <TooltipButton
              onClick={changePlaybackRate}
              tooltipText="Playback speed"
              className="hover:text-primary px-2 py-1 text-xs font-medium cursor-pointer"
            >
              {playbackRate}x
            </TooltipButton>

            <TooltipButton
              onClick={() => setIsLoop(!isLoop)}
              tooltipText={isLoop ? "Repeat Mode (L)" : "Non repeat mode (L)"}
              className={`hover:text-primary p-1 cursor-pointer ${
                isLoop ? "text-primary" : ""
              }`}
            >
              {!isLoop ? <Repeat size={18} /> : <Repeat1 size={18} />}
            </TooltipButton>

            {document.pictureInPictureEnabled && (
              <TooltipButton
                onClick={togglePiP}
                tooltipText="Picture-in-Picture (P)"
                className={`hover:text-primary p-1 cursor-pointer ${
                  isPiP ? "text-primary" : ""
                }`}
              >
                <PictureInPicture size={18} />
              </TooltipButton>
            )}
          </div>

          {/* More menu for small screens */}
          <div
            className={`sm:hidden relative flex items-center ${
              showMoreMenu && "text-primary"
            }`}
          >
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="hover:text-primary cursor-pointer"
            >
              <MoreHorizontal size={18} />
            </button>

            {showMoreMenu && (
              <div className="absolute -right-18 bottom-10 w-28 items-center justify-center bg-dark rounded shadow-lg flex p-1 gap-1 z-50 text-white">
                <TooltipButton
                  onClick={changePlaybackRate}
                  tooltipText="Playback speed"
                  className="py-1 w-10 cursor-pointer hover:text-primary  text-xs font-medium"
                >
                  {playbackRate}x
                </TooltipButton>
                <TooltipButton
                  onClick={() => setIsLoop(!isLoop)}
                  tooltipText="Repeat mode"
                  className="p-1 cursor-pointer"
                >
                  {isLoop ? <Repeat1 size={18} /> : <Repeat size={18} />}
                </TooltipButton>
                {document.pictureInPictureEnabled && (
                  <TooltipButton
                    onClick={togglePiP}
                    tooltipText="PiP"
                    className="p-1 cursor-pointer"
                  >
                    <PictureInPicture size={18} />
                  </TooltipButton>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TooltipButton
              onClick={toggleCinemaMode}
              tooltipText={
                isCinemaMode ? "Default view (T)" : "Cinema mode (T)"
              }
              className="hover:text-primary p-1 cursor-pointer"
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
              className="hover:text-primary p-1 cursor-pointer"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </TooltipButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
