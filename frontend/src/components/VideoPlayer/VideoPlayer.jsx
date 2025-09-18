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

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const effectiveSources = useMemo(() => {
    if (sources) {
      return Array.isArray(sources)
        ? sources
        : [{ src: sources, type: "video/mp4", label: "Default" }];
    }
    return [{ src, type: "video/mp4", label: "Default" }];
  }, [sources, src]);

  const formatTime = useCallback((time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const updateProgress = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.buffered.length > 0) {
        const buffered = videoRef.current.buffered.end(
          videoRef.current.buffered.length - 1
        );
        setBufferedTime(buffered);
      }
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video && effectiveSources.length > 0) {
      video.src = effectiveSources[0].src;
    }
  }, [effectiveSources]);

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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loop = isLoop;
    }
  }, [isLoop]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const showSkipAnimation = useCallback((direction) => {
    setSkipAnimation(direction);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error("error"));
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

  const skipTime = (seconds) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    seek(newTime);
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
            break;
          }
          break;
        case "Period":
          if (e.shiftKey) {
            e.preventDefault();
            skipTime(1);
            break;
          }
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
  }, [isPlaying, volume, currentTime, duration, togglePiP]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-[var(--color-dark)] overflow-hidden group select-none transition-all duration-300 ease-in-out 
        ${
          isFullscreen
            ? "fixed inset-0 rounded-none"
            : isCinemaMode
            ? "w-full max-w-[100vw] max-lg:h-fit sm:border sm:border-yellow-700 h-[50vh] sm:h-[75vh] lg:h-[80vh] rounded-none mx-auto"
            : "w-[98vw] sm:w-[90vw] lg:w-[60vw] max-w-[1280px] h-fit max-h-[70vh] rounded-xl shadow-lg mt-2 sm:ml-1 sm:mr-1 max-sm:mx-auto"
        }`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full cursor-pointer bg-[var(--color-dark)]"
      >
        Your browser does not support the video tag.
      </video>

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
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)]/80 via-transparent to-transparent" />

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

        <div className="absolute flex inset-0 cursor-pointer z-10 h-full w-full bg-red-5">
          <div
            className="relative w-1/3 bg-yellow-4"
            onDoubleClick={() => skipTime(-10)}
            onClick={() => {
              if (window.innerWidth > 640) {
                togglePlay();
              } else {
                showControls ? setShowControls(false) : setShowControls(true);
              }
            }}
          ></div>
          <div
            className="relative w-1/3"
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
            className="relative w-1/3"
            onDoubleClick={() => skipTime(10)}
            onClick={() => {
              if (window.innerWidth > 640) {
                togglePlay();
              } else {
                showControls ? setShowControls(false) : setShowControls(true);
              }
            }}
          ></div>
        </div>

        <Controls
          isPlaying={isPlaying}
          isMuted={isMuted}
          volume={volume}
          currentTime={currentTime}
          duration={duration}
          bufferedTime={bufferedTime}
          playbackRate={playbackRate}
          isLoop={isLoop}
          isPiP={isPiP}
          isCinemaMode={isCinemaMode}
          isFullscreen={isFullscreen}
          effectiveSources={effectiveSources}
          currentSourceIndex={currentSourceIndex}
          togglePlay={togglePlay}
          toggleMute={toggleMute}
          handleVolumeChange={handleVolumeChange}
          skipTime={skipTime}
          seek={seek}
          formatTime={formatTime}
          changePlaybackRate={changePlaybackRate}
          handleChangeQuality={handleChangeQuality}
          togglePiP={togglePiP}
          toggleCinemaMode={toggleCinemaMode}
          toggleFullscreen={toggleFullscreen}
          setIsLoop={setIsLoop}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
