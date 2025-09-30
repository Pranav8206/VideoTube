import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Play } from "lucide-react";
import Loader from "../Loader";
import SkipAnimation from "./SkipAnimation";
import Controls from "./Controls";

const VideoPlayer = ({ src, sources, poster, onTheaterModeChange }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
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

  // Handle sources
  const effectiveSources = useMemo(() => {
    if (sources)
      return Array.isArray(sources)
        ? sources
        : [{ src: sources, type: "video/mp4" }];
    return [{ src, type: "video/mp4" }];
  }, [sources, src]);

  // Utility functions
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

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
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

  // Video event listeners
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
  }, []);

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

  const resetControlsTimeout = useCallback(() => {
    clearTimeout(controlsTimeoutRef.current);
    setShowControls(true);
    if (isPlaying)
      controlsTimeoutRef.current = setTimeout(
        () => setShowControls(false),
        3000
      );
  }, [isPlaying]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("mousemove", resetControlsTimeout);
    return () =>
      container.removeEventListener("mousemove", resetControlsTimeout);
  }, [resetControlsTimeout]);

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
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-dark overflow-hidden group select-none transition-all duration-300 ease-in-out
        ${
          isFullscreen
            ? "fixed inset-0"
            : isCinemaMode
            ? "w-full max-lg:h-[50vh] sm:h-[75vh] lg:h-[80vh] mx-auto"
            : "w-[98vw] sm:w-[90vw] lg:w-[60vw] max-w-[1280px] h-[60vh] sm:h-[70vh] lg:h-[70vh] rounded-xl shadow-lg mx-auto"
        }
      `}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full object-cover cursor-pointer"
      />

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

      {!error && isLoading && <Loader />}
      <SkipAnimation
        direction={skipAnimation}
        onAnimationEnd={() => setSkipAnimation(null)}
      />

      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="sm:w-16 w-10 sm:h-16 h-10 bg-black/50 rounded-full flex items-center justify-center text-primary hover:bg-black/70"
            >
              <Play size={32} />
            </button>
          </div>
        )}
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
          }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
