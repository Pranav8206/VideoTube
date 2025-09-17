import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
  Captions,
  PictureInPicture,
  Repeat1,
} from "lucide-react";
import Loader from "./Loader";

const VideoPlayer = ({
  src,
  sources,
  poster,
  onTheaterModeChange,
  subtitles,
}) => {
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
  const [previewTime, setPreviewTime] = useState(null);
  const [previewPercent, setPreviewPercent] = useState(null);
  const [isLoop, setIsLoop] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [error, setError] = useState(null);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);

  // Skip animation states
  const [skipAnimation, setSkipAnimation] = useState(null); // 'forward' | 'backward' | null
  const [skipTimeoutRef, setSkipTimeoutRef] = useState(null);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const seekbarRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const volumeTimeoutRef = useRef(null);

  const effectiveSources = useMemo(() => {
    if (sources) {
      return Array.isArray(sources)
        ? sources
        : [{ src: sources, type: "video/mp4", label: "Default" }];
    }
    return [{ src, type: "video/mp4", label: "Default" }];
  }, [sources, src]);

  const effectiveSubtitles = useMemo(() => {
    if (!subtitles) return [];
    if (typeof subtitles === "string") {
      return [{ src: subtitles, label: "English", srcLang: "en" }];
    }
    return subtitles;
  }, [subtitles]);

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
        const buffered = videoRef.current.buffered.end(
          videoRef.current.buffered.length - 1
        );
        setBufferedTime(buffered);
      }
    }
  }, [isDragging]);

  // Set initial source
  useEffect(() => {
    const video = videoRef.current;
    if (video && effectiveSources.length > 0) {
      video.src = effectiveSources[0].src;
    }
  }, [effectiveSources]);

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
    const handleError = (e) => setError(video.error?.message || "Video error");
    const handleEnded = () => setIsPlaying(false);
    const handleEnterPiP = () => setIsPiP(true);
    const handleLeavePiP = () => setIsPiP(false);

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ratechange", handleRateChange);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("enterpictureinpicture", handleEnterPiP);
    video.addEventListener("leavepictureinpicture", handleLeavePiP);

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
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("enterpictureinpicture", handleEnterPiP);
      video.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, [updateProgress]);

  // Handle loop
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loop = isLoop;
    }
  }, [isLoop]);

  // Handle subtitles tracks
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.textTracks) {
      for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].mode =
          i === currentTrackIndex ? "showing" : "hidden";
      }
    }
  }, [currentTrackIndex]);

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
      if (skipTimeoutRef) {
        clearTimeout(skipTimeoutRef);
      }
    };
  }, [skipTimeoutRef]);

  // Show skip animation
  const showSkipAnimation = useCallback(
    (direction) => {
      setSkipAnimation(direction);

      // Clear existing timeout
      if (skipTimeoutRef) {
        clearTimeout(skipTimeoutRef);
      }

      // Hide animation after 800ms
      const timeout = setTimeout(() => {
        setSkipAnimation(null);
      }, 800);

      setSkipTimeoutRef(timeout);
    },
    [skipTimeoutRef]
  );

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
    [handleSetPreview]
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
    [handleSetPreview]
  );

  const handleSeekbarMouseUp = useCallback(() => {
    if (isDragging) {
      seek(dragTime);
      setIsDragging(false);
      setPreviewTime(null);
      setPreviewPercent(null);
    }
  }, [isDragging, dragTime]);

  // Global mouse/touch events for dragging
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

  const skipTime = (seconds) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    seek(newTime);

    // Show skip animation
    if (seconds > 0) {
      showSkipAnimation("forward");
    } else {
      showSkipAnimation("backward");
    }
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

  const handleChangeQuality = useCallback(
    (newIndex) => {
      if (newIndex === currentSourceIndex) return;
      const video = videoRef.current;
      if (video) {
        const wasPlaying = isPlaying;
        const time = currentTime;
        setIsLoading(true);
        setError(null);
        video.src = effectiveSources[newIndex].src;
        video.load();
        setCurrentSourceIndex(newIndex);

        const handleLoaded = () => {
          video.currentTime = time;
          if (wasPlaying) video.play().catch(console.error);
          setIsLoading(false);
          video.removeEventListener("loadedmetadata", handleLoaded);
        };
        video.addEventListener("loadedmetadata", handleLoaded);
      }
    },
    [currentSourceIndex, effectiveSources, isPlaying, currentTime]
  );

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPiP) {
      try {
        await document.exitPictureInPicture();
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        await video.requestPictureInPicture();
      } catch (err) {
        console.error(err);
      }
    }
  }, [isPiP]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "KeyM":
          toggleMute();
          break;
        case "KeyF":
          toggleFullscreen();
          break;
        case "KeyT":
          toggleCinemaMode();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipTime(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skipTime(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          break;
        case "ArrowDown":
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          break;
        case "Comma":
          if (e.shiftKey) {
            e.preventDefault();
            skipTime(-1);
          }
          break;
        case "Period":
          if (e.shiftKey) {
            e.preventDefault();
            skipTime(1);
          }
          break;
        case "KeyL":
          setIsLoop((prev) => !prev);
          break;
        case "KeyC":
          const numTracks = effectiveSubtitles.length;
          if (numTracks > 0) {
            setCurrentTrackIndex((prev) => ((prev + 1) % (numTracks + 1)) - 1);
          }
          break;
        case "KeyP":
          togglePiP();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, volume, currentTime, duration, effectiveSubtitles, togglePiP]);

  const displayTime = isDragging ? dragTime : currentTime;
  const progressPercent = duration ? (displayTime / duration) * 100 : 0;
  const bufferPercent = duration ? (bufferedTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative  bg-[var(--color-dark)] overflow-hidden group select-none transition-all duration-300 ease-in-out 
    ${
      isFullscreen
        ? "fixed inset-0 rounded-none"
        : isCinemaMode
        ? "w-full max-w-[100vw] max-lg:h-fit sm:border sm:border-yellow-700 h-[50vh] sm:h-[75vh] lg:h-[80vh] rounded-none mx-auto"
        : "w-[98vw] sm:w-[90vw] lg:w-[60vw] max-w-[1280px] h-fit max-h-[70vh] rounded-xl shadow-lg mt-2 sm:ml-1 sm:mr-1 max-sm:mx-auto"
    }`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isDragging && setShowControls(false)}
    >
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full cursor-pointer border-yellow-400 bg-[var(--color-dark)]"
      >
        {effectiveSubtitles.map((track, i) => (
          <track
            key={i}
            kind="subtitles"
            src={track.src}
            label={track.label}
            srcLang={track.srcLang}
            default={false}
          />
        ))}
        Your browser does not support the video tag.
      </video>

      {/* Error display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-dark)]/90">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={() => {
                setError(null);
                if (videoRef.current) videoRef.current.load();
              }}
              className="bg-[var(--color-primary)] text-white px-4 py-1 rounded text-sm cursor-pointer"
            >
              Retry kar
            </button>
          </div>
        </div>
      )}

      {/* Loading spinner */}
      {!error && isLoading && <Loader />}

      {/* Skip Animation */}
      {skipAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div
            className={`flex items-center justify-center  rounded-full p-4 ease-in transform transition-all duration-300 ${
              skipAnimation === "forward"
                ? "animate-pulse "
                : "animate-pulse "
            }`}
          >
            <div className="flex items-center justify-center text-[var(--color-primary)]">
              {skipAnimation === "forward" ? (
                <div className="relative items-center justify-center left-25 md:left-35 bg-black/60 rounded-xl p-1.5">
                  <RotateCw size={20} className="mx-auto" />
                  <span className="text-sm font-semibold">+10s</span>
                </div>
              ) : (
                <div className="relative items-center justify-center right-25 md:right-35 bg-black/60 rounded-xl p-1.5">
                  <RotateCcw size={20} className="mx-auto"/>
                  <span className="text-sm font-semibold">-10s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)]/80 via-transparent to-transparent" />

        {/* Center play button */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="sm:w-16 w-10 sm:h-16 h-10 bg-[var(--color-dark)]/70 rounded-full flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-dark)]/90 transition-colors cursor-pointer"
            >
              <Play size={32} className="ml-1" />
            </button>
          </div>
        )}

        {/* Overlay for double-click fullscreen and single-click play/pause  */}
        <div className="absolute flex inset-0 cursor-pointer z-10 h-full w-full ">
          <div
            className="relative w-1/3 "
            onDoubleClickCapture={() => {
              skipTime(-10);
            }}
            onClickCapture={() => {
              if (window.innerWidth > 640) {
                togglePlay();
              } else {
                showControls ? setShowControls(false) : setShowControls(true);
              }
            }}
          ></div>
          <div
            className="relative w-1/3 "
            onDoubleClick={toggleFullscreen}
            onClick={() => {
              if (window.innerWidth > 640) {
                togglePlay();
              } else {
                showControls ? setShowControls(false) : setShowControls(true);
              }
            }}
          ></div>
          <div
            className="relative w-1/3 "
            onDoubleClick={() => {
              skipTime(10);
            }}
            onClickCapture={() => {
              if (window.innerWidth > 640) {
                togglePlay();
              } else {
                showControls ? setShowControls(false) : setShowControls(true);
              }
            }}
          ></div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4  ">
          {/* Seekbar */}
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
                className="absolute inset-y-0 left-0 bg-[var(--color-primary)] rounded-full  "
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

          <div className="flex  items-center justify-between gap-2 text-purple-100 ">
            <div className="flex justify-around items-center gap-4 z-10 ">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="hover:text-[var(--color-primary)] transition-colors p-1 cursor-pointer"
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              {/* Skip buttons */}
              <button
                onClick={() => skipTime(-10)}
                className="hover:text-[var(--color-primary)] transition-colors p-1 cursor-pointer"
                title="Rewind 10s (←)"
              >
                <RotateCcw size={20} />
              </button>

              <button
                onClick={() => skipTime(10)}
                className="hover:text-[var(--color-primary)] transition-colors p-1 cursor-pointer"
                title="Forward 10s (→)"
              >
                <RotateCw size={20} />
              </button>

              {/* Volume */}
              <div className="flex items-center justify-center gap-0">
                <div
                  className="flex items-center justify-center"
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
                  <button
                    onClick={toggleMute}
                    className="hover:text-[var(--color-primary)] transition-colors p-1 cursor-pointer"
                    title={isMuted ? "Unmute (M)" : "Mute (M)"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX size={20} />
                    ) : (
                      <Volume2 size={20} />
                    )}
                  </button>
                </div>

                {/* Volume Slider */}
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
                  <div className="">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={(e) =>
                        handleVolumeChange(parseFloat(e.target.value))
                      }
                      className="w-15 lg:w-20 h-2 bg-[var(--color-borderColor)]/90 rounded-full appearance-none  cursor-pointer text-amber-700"
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

              {/* Time display */}
              <div className="text-sm font-mono">
                {formatTime(displayTime)} / {formatTime(duration)}
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 z-10 ">
              {/* Playback rate */}
              <button
                onClick={changePlaybackRate}
                className="hover:text-[var(--color-primary)] transition-colors px-2 py-1 text-sm font-medium cursor-pointer"
                title="Playback speed"
              >
                {playbackRate}x
              </button>

              {/* Subtitles selector */}
              {effectiveSubtitles.length > 0 && (
                <select
                  value={currentTrackIndex}
                  onChange={(e) =>
                    setCurrentTrackIndex(parseInt(e.target.value))
                  }
                  className="bg-[var(--color-dark)]/80 text-white rounded px-2 py-1 text-sm hover:bg-[var(--color-dark)] transition-colors cursor-pointer"
                  title="Subtitles"
                >
                  <option value={-1}>Off</option>
                  {effectiveSubtitles.map((t, i) => (
                    <option key={i} value={i}>
                      {t.label}
                    </option>
                  ))}
                </select>
              )}

              {/* Quality selector */}
              {effectiveSources.length > 1 && (
                <select
                  value={currentSourceIndex}
                  onChange={(e) =>
                    handleChangeQuality(parseInt(e.target.value))
                  }
                  className="bg-[var(--color-dark)]/80 text-white rounded px-2 py-1 text-sm hover:bg-[var(--color-dark)] transition-colors cursor-pointer"
                  title="Quality"
                >
                  {effectiveSources.map((s, i) => (
                    <option key={i} value={i}>
                      {s.label}
                    </option>
                  ))}
                </select>
              )}

              {/* Loop */}
              <button
                onClick={() => setIsLoop(!isLoop)}
                className={`hover:text-[var(--color-primary)] transition-colors p-1 cursor-pointer ${
                  isLoop ? "text-[var(--color-primary)]" : ""
                }`}
                title={`${isLoop ? "Repeat Mode (L)" : "Non repeat mode (L)"}`}
              >
                {" "}
                {!isLoop ? <Repeat size={20} /> : <Repeat1 size={20} />}
              </button>

              {/* PiP */}
              {document.pictureInPictureEnabled && (
                <button
                  onClick={togglePiP}
                  onDoubleClick={() => {}}
                  className={`hover:text-[var(--color-primary)] transition-colors p-1 cursor-pointer ${
                    isPiP ? "text-[var(--color-primary)]" : ""
                  }`}
                  title="Picture-in-Picture (P)"
                >
                  <PictureInPicture size={20} />
                </button>
              )}

              {/* Cinema Mode */}
              <button
                onClick={toggleCinemaMode}
                className="hover:text-[var(--color-primary)] transition-colors p-1 cursor-pointer"
                title={isCinemaMode ? "Default view (T)" : "Cinema mode (T)"}
              >
                {isCinemaMode ? (
                  <Monitor size={20} />
                ) : (
                  <RectangleHorizontal size={20} />
                )}
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="hover:text-[var(--color-primary)] transition-colors p-1 cursor-pointer z-10"
                title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
