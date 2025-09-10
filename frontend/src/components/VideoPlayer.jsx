import React, { useState, useRef, useEffect } from 'react';

const VideoPlayer = ({ src, poster }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  return (
    <div 
      className="relative bg-black rounded-xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        poster={poster}
        className="w-full h-full"
        onClick={togglePlay}
      >
        <source src={src} type="video/mp4" />
      </video>
      
      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-4 text-white">
              <button onClick={togglePlay} className="hover:scale-110 transition-transform">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={toggleMute} className="hover:scale-110 transition-transform">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <div className="flex-1 h-1 bg-white/30 rounded-full">
                <div className="h-full w-1/3 bg-purple-500 rounded-full"></div>
              </div>
              <button className="hover:scale-110 transition-transform">
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer