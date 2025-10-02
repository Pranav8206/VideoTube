import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { Play } from "lucide-react";
import Loader from "../Loader";
import SkipAnimation from "./SkipAnimation";
import Controls from "./Controls";
import axios from "axios";
import { AppContext } from "../../context/context";

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

  const { isCinemaMode, setIsCinemaMode } = useContext(AppContext);

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
      setShowControls(false);
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
    console.log(duration, "duration is this");

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
    if (!isPlaying) {
      setShowControls(true);
    }
    clearTimeout(controlsTimeoutRef.current);
    setShowControls(true);
    let timeoutTime = 2000;
    if (window.innerWidth < 640) {
      timeoutTime = 3000;
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, timeoutTime);
  }, [isPlaying]);

  // Cleanup timer
  useEffect(() => {
    return () => clearTimeout(controlsTimeoutRef.current);
  }, []);

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
  ]);

  // Handlers for click zones
  const handleZoneClick = () => {
    if (window.innerWidth > 640) {
      togglePlay();
    } else {
      showControls ? setShowControls(false) : setShowControls(true);
    }
  };

  useEffect(() => {
    //fix later
    if (!src) return;

    const fetchDuration = async () => {
      try {
        const url = new URL(src);
        const parts = url.pathname.split("/");
        // ["", "dfxpccwii", "video", "upload", "v1756730931", "skymltj9zhhsk98k3iad.mp4"]

        const cloudName = parts[1];
        const publicIdWithExt = parts.pop(); // "skymltj9zhhsk98k3iad.mp4"
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // "skymltj9zhhsk98k3iad"

        // ❌ remove version (like v1756730931)
        const jsonUrl = `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}.json`;

        const res = await axios.get(jsonUrl);
        console.log(res, "res");

        if (res.data?.duration) {
          setDuration(res.data.duration);
        }
      } catch (err) {
        console.error("Error fetching video metadata:", err);
      }
    };

    fetchDuration();
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden group select-none transition-all duration-300 ease-in-out aspect-video mx-auto  shadow-2xl  ${
        isFullscreen
          ? "fixed inset-0 z-[1100]"
          : isCinemaMode
          ? "max-h-[70vh] max-lg:w-full w-screen rounded-xs"
          : " max-h-[60vh] rounded-lg mx-auto"
      }`}
      onMouseEnter={resetControlsTimeout}
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => setShowControls((prev) => !prev)}
    >
      <video
        ref={videoRef}
        poster={poster}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const vid = e.currentTarget;
          if (!isNaN(vid.duration)) {
            setDuration(vid.duration);
          }
        }}
        onDurationChange={(e) => {
          const vid = e.currentTarget;
          if (!isNaN(vid.duration)) {
            setDuration(vid.duration);
          }
        }}
        className={`bg-gray-300  ${isFullscreen && "h-screen w-screen"} ${
          isCinemaMode ? "mx-auto h-full" : "h-full w-full object-cover"
        }`}
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

      {!error && isLoading && <Loader className="" />}
      <SkipAnimation
        direction={skipAnimation}
        onAnimationEnd={() => setSkipAnimation(null)}
      />

      {/* Controls overlay */}
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
              className={`z-20 sm:w-16 w-10 sm:h-16 h-10 bg-black/50 rounded-full flex items-center justify-center text-primary cursor-pointer ${
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
            onClick={handleZoneClick}
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
