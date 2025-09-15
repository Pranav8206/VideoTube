import React, { useState, useRef, useEffect, useCallback } from "react";
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
} from "lucide-react";

const VideoPlayer = ({ src, poster, onTheaterModeChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const seekbarRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const volumeTimeoutRef = useRef(null);

  // Format time helper function
  const formatTime = useCallback((time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  // Update video time and buffer progress
  const updateProgress = useCallback(() => {
    if (videoRef.current && !isDragging) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Update buffered progress
      if (videoRef.current.buffered.length > 0) {
        const buffered = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        setBufferedTime(buffered);
      }
    }
  }, [isDragging]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = updateProgress;
    const handleProgress = updateProgress;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleRateChange = () => setPlaybackRate(video.playbackRate);

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ratechange", handleRateChange);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ratechange", handleRateChange);
    };
  }, [updateProgress]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setShowControls(true);
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  // Handle mouse movement for controls
  const handleMouseMove = useCallback(() => {
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, [handleMouseMove]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleVolumeChange = (newVolume) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error("Error attempting to exit fullscreen:", err);
      }
    }
  };

  const toggleCinemaMode = () => {
    const newCinemaMode = !isCinemaMode;
    setIsCinemaMode(newCinemaMode);
    if (onTheaterModeChange) {
      onTheaterModeChange(newCinemaMode);
    }
  };

  const seek = (time) => {
    if (videoRef.current && time >= 0 && time <= duration) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSeekbarClick = (e) => {
    if (!seekbarRef.current || !duration) return;
    
    const rect = seekbarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seek(newTime);
  };

  const handleSeekbarMouseDown = (e) => {
    setIsDragging(true);
    handleSeekbarMouseMove(e);
  };

  const handleSeekbarMouseMove = (e) => {
    if (!isDragging || !seekbarRef.current || !duration) return;
    
    const rect = seekbarRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * duration;
    setDragTime(newTime);
  };

  const handleSeekbarMouseUp = () => {
    if (isDragging) {
      seek(dragTime);
      setIsDragging(false);
    }
  };

  // Global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e) => handleSeekbarMouseMove(e);
      const handleGlobalMouseUp = () => handleSeekbarMouseUp();

      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragTime, duration]);

  const skipTime = (seconds) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    seek(newTime);
  };

  const changePlaybackRate = () => {
    const rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
      setPlaybackRate(nextRate);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        case 'KeyT':
          toggleCinemaMode();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          break;
        case 'Comma':
          if (e.shiftKey) {
            e.preventDefault();
            skipTime(-1);
          }
          break;
        case 'Period':
          if (e.shiftKey) {
            e.preventDefault();
            skipTime(1);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, currentTime, duration]);

  const displayTime = isDragging ? dragTime : currentTime;
  const progressPercent = duration ? (displayTime / duration) * 100 : 0;
  const bufferPercent = duration ? (bufferedTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative bg-[var(--color-dark)] rounded-xl overflow-hidden group select-none
        ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""} 
        ${isCinemaMode ? "cinema-mode" : ""}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isDragging && setShowControls(false)}
    >
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full cursor-pointer bg-[var(--color-dark)]"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-dark)]/80">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)]/80 via-transparent to-transparent" />
        
        {/* Center play button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-[var(--color-dark)]/70 rounded-full flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-dark)]/90 transition-colors"
            >
              <Play size={32} className="ml-1" />
            </button>
          </div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Seekbar */}
          <div className="mb-4">
            <div
              ref={seekbarRef}
              className="h-2 bg-[var(--color-borderColor)]/60 rounded-full cursor-pointer group/seekbar relative"
              onMouseDown={handleSeekbarMouseDown}
              onClick={handleSeekbarClick}
            >
              {/* Buffer progress */}
              <div
                className="absolute inset-y-0 left-0 bg-[var(--color-borderColor)]/80 rounded-full"
                style={{ width: `${bufferPercent}%` }}
              />
              {/* Progress */}
              <div
                className="absolute inset-y-0 left-0 bg-[var(--color-primary)] rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
              {/* Scrubber */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--color-primary)] rounded-full shadow-lg border-2 border-white opacity-0 group-hover/seekbar:opacity-100 transition-opacity"
                style={{ left: `calc(${progressPercent}% - 8px)` }}
              />
              {/* Hover preview */}
              <div className="absolute -top-8 left-0 bg-[var(--color-dark)]/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/seekbar:opacity-100 transition-opacity pointer-events-none">
                {formatTime(isDragging ? dragTime : currentTime)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[var(--color-dark)] dark:text-white">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="hover:text-[var(--color-primary)] transition-colors p-1"
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {/* Skip buttons */}
            <button
              onClick={() => skipTime(-10)}
              className="hover:text-[var(--color-primary)] transition-colors p-1"
              title="Rewind 10s (←)"
            >
              <RotateCcw size={20} />
            </button>

            <button
              onClick={() => skipTime(10)}
              className="hover:text-[var(--color-primary)] transition-colors p-1"
              title="Forward 10s (→)"
            >
              <RotateCw size={20} />
            </button>

            {/* Volume */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => {
                setShowVolumeSlider(true);
                if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
              }}
              onMouseLeave={() => {
                volumeTimeoutRef.current = setTimeout(() => {
                  setShowVolumeSlider(false);
                }, 1000);
              }}
            >
              <button
                onClick={toggleMute}
                className="hover:text-[var(--color-primary)] transition-colors p-1"
                title={isMuted ? "Unmute (M)" : "Mute (M)"}
              >
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              
              {showVolumeSlider && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 rounded-lg p-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>
              )}
            </div>

            {/* Time display */}
            <div className="text-sm font-mono">
              {formatTime(displayTime)} / {formatTime(duration)}
            </div>

            <div className="flex-1" />

            {/* Playback rate */}
            <button
              onClick={changePlaybackRate}
              className="hover:text-[var(--color-primary)] transition-colors px-2 py-1 text-sm font-medium"
              title="Playback speed"
            >
              {playbackRate}x
            </button>

            {/* Cinema Mode */}
            <button
              onClick={toggleCinemaMode}
              className="hover:text-[var(--color-primary)] transition-colors p-1"
              title={isCinemaMode ? "Default view (T)" : "Cinema mode (T)"}
            >
              {isCinemaMode ? <Monitor size={20} /> : <RectangleHorizontal size={20} />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="hover:text-[var(--color-primary)] transition-colors p-1"
              title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;