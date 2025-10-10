import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { Pin, PinOff, Play } from "lucide-react";
import Loader from "../Loader";
import SkipAnimation from "./SkipAnimation";
import Controls from "./Controls";
import { AppContext } from "../../context/context";
import useIsTouchDevice from "../../hooks/useIsTouchDevice";

const VideoPlayer = ({ src, sources, poster, onTheaterModeChange }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoop, setIsLoop] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [error, setError] = useState(null);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [skipAnimation, setSkipAnimation] = useState(null);
  const [pin, setPin] = useState(false);

  const { isCinemaMode, setIsCinemaMode } = useContext(AppContext);

  const isTouch = useIsTouchDevice();

  // Prepare sources
  const effectiveSources = useMemo(() => {
    if (!sources) return [{ src, type: "video/mp4" }];
    return Array.isArray(sources)
      ? sources
      : [{ src: sources, type: "video/mp4" }];
  }, [sources, src]);

  // Utils
  const formatTime = useCallback((time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const seek = useCallback((time) => {
    if (videoRef.current) videoRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const skipTime = useCallback(
    (s) => {
      const newTime = Math.max(0, Math.min(duration, currentTime + s));
      seek(newTime);
      setSkipAnimation(s > 0 ? "forward" : "backward");
    },
    [currentTime, duration, seek]
  );

  // Player actions
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);

  const handleVolumeChange = useCallback((v) => {
    if (!videoRef.current) return;
    videoRef.current.volume = v;
    videoRef.current.muted = v === 0;
    setVolume(v);
    setIsMuted(v === 0);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement)
      await containerRef.current.requestFullscreen();
    else await document.exitFullscreen();
  }, []);

  const toggleCinemaMode = useCallback(() => {
    const mode = !isCinemaMode;
    setIsCinemaMode(mode);
    onTheaterModeChange?.(mode);
  }, [isCinemaMode, onTheaterModeChange]);

  const togglePiP = useCallback(async () => {
    if (!videoRef.current) return;
    isPiP
      ? await document.exitPictureInPicture()
      : await videoRef.current.requestPictureInPicture();
  }, [isPiP]);

  const changePlaybackRate = useCallback(() => {
    const rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const idx = rates.indexOf(playbackRate);
    const nextRate = rates[(idx + 1) % rates.length];
    if (videoRef.current) videoRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  }, [playbackRate]);

  const handleChangeQuality = useCallback(
    (i) => {
      if (i === currentSourceIndex || !videoRef.current) return;
      const v = videoRef.current;
      const wasPlaying = isPlaying;
      const time = currentTime;
      setIsLoading(true);
      setError(null);
      v.src = effectiveSources[i].src;
      v.load();
      setCurrentSourceIndex(i);
      v.addEventListener(
        "loadedmetadata",
        () => {
          v.currentTime = time;
          if (wasPlaying) v.play();
          setIsLoading(false);
        },
        { once: true }
      );
    },
    [currentSourceIndex, effectiveSources, isPlaying, currentTime]
  );

  // Events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const events = {
      loadedmetadata: () => {
        setDuration(video.duration);
        setIsLoading(false);
      },
      timeupdate: () => setCurrentTime(video.currentTime),
      progress: () => {
        if (video.buffered.length > 0)
          setBufferedTime(video.buffered.end(video.buffered.length - 1));
      },
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      volumechange: () => {
        setVolume(video.volume);
        setIsMuted(video.muted);
      },
      waiting: () => setIsLoading(true),
      canplay: () => setIsLoading(false),
      ratechange: () => setPlaybackRate(video.playbackRate),
      error: () => setError(video.error?.message || "Video error"),
      ended: () => setIsPlaying(false),
      enterpictureinpicture: () => setIsPiP(true),
      leavepictureinpicture: () => setIsPiP(false),
    };

    Object.entries(events).forEach(([event, handler]) =>
      video.addEventListener(event, handler)
    );
    return () =>
      Object.entries(events).forEach(([event, handler]) =>
        video.removeEventListener(event, handler)
      );
  }, [videoRef]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.loop = isLoop;
  }, [isLoop]);

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Controls visibility
  const resetControlsTimeout = useCallback(() => {
    clearTimeout(controlsTimeoutRef.current);
    if (pin) {
      setShowControls(true);
      return;
    }
    setShowControls(true);
    console.log("start");

    const timeout = isTouch ? 2000 : 1000;
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, timeout);
  }, [isPlaying, pin, isTouch]);

  // Mouse and touch handling
  const handleMouseEnter = useCallback(() => {
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const handleMouseMove = useCallback(() => {
    resetControlsTimeout();
  }, [resetControlsTimeout]);

  const handleMouseLeave = useCallback(() => {
    if (!pin && isPlaying) {
      setShowControls(false);
    }
  }, [pin, isPlaying]);

  // Touch handling: Single tap shows controls, resets timeout
  const handleTouchStart = useCallback(
    (e) => {
      if (pin) return;
      resetControlsTimeout();
    },
    [pin, resetControlsTimeout]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
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
        case "KeyL":
          setIsLoop((prev) => !prev);
          break;
        case "KeyP":
          togglePiP();
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    volume,
    skipTime,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    toggleCinemaMode,
    togglePiP,
    handleVolumeChange,
  ]);

  // Handlers for click zones
  const handleZoneClick = useCallback(() => {
    if (isTouch) {
      // On touch devices, rely on handleTouchStart for controls visibility
      // Only toggle play if controls are visible
      if (showControls) {
        togglePlay();
      }
    } else {
      // Non-touch: Click toggles play
      togglePlay();
    }
  }, [isTouch, showControls, togglePlay]);

  const handleCenterZoneClick = useCallback(() => {
    // Toggle play only if controls are visible
    if (showControls) {
      togglePlay();
    }
  }, [showControls, togglePlay]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden group select-none transition-all duration-300 ease-in-out aspect-video mx-auto shadow-2xl ${
        isFullscreen
          ? "fixed inset-0 z-[1100]"
          : isCinemaMode
          ? "max-h-[70vh] max-lg:w-full w-screen rounded-xs"
          : "max-h-[60vh] rounded-lg mx-auto"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      <video
        ref={videoRef}
        poster={poster}
        src={src}
        className={`bg-gray-300  ${isFullscreen && "h-screen w-screen"} ${
          isCinemaMode ? "mx-auto h-full" : "h-full w-full object-cover"
        }`}
      />

      {/* pin/ unpin controls */}
      <div className="absolute top-1 right-1 sm:right-3 z-20 flex items-center gap-2">
        <span
          className={`text-xs text-white bg-black/60 px-2 rounded-md whitespace-nowrap transition-all duration-300 ${
            pin
              ? "translate-x-0 opacity-80"
              : "translate-x-full opacity-0 pointer-events-none"
          }`}
          aria-live="polite"
        >
          Controls pinned
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPin((prev) => !prev);
          }}
          className="flex items-center justify-center bg-black/20 text-white p-1 rounded-full shadow-lg cursor-pointer transition-all duration-200 ease-in-out backdrop-blur-sm"
          aria-label={pin ? "Unpin controls" : "Pin controls"}
          title={pin ? "" : "Pin controls"}
          aria-pressed={pin}
          type="button"
        >
          {pin ? <Pin size={16} /> : <PinOff size={16} />}
        </button>
      </div>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={() => {
                setError(null);
                videoRef.current?.load();
              }}
              className="bg-primary text-white px-4 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!error && isLoading && (
        <div className="relative h-full w-full">
          <Loader />
        </div>
      )}
      <SkipAnimation
        direction={skipAnimation}
        onAnimationEnd={() => setSkipAnimation(null)}
      />

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls || pin ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className={`z-30 sm:w-16 w-10 sm:h-16 h-10 bg-black/50 rounded-full flex items-center justify-center text-primary cursor-pointer ${
                !showControls && "hidden"
              } `}
            >
              <Play size={32} />
            </button>
          </div>
        )}

        {/* Click zones */}
        <div className="absolute flex inset-0 cursor-pointer z-10 h-full w-full">
          <div
            className="relative w-1/3"
            onDoubleClick={() => skipTime(-10)}
            onClick={handleZoneClick}
          />
          <div
            className="relative w-1/3"
            onDoubleClick={toggleFullscreen}
            onClick={handleCenterZoneClick}
          />
          <div
            className="relative w-1/3"
            onDoubleClick={() => skipTime(10)}
            onClick={handleZoneClick}
          />
        </div>

        {/* Controls bar */}
        <Controls
          {...{
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
          }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
