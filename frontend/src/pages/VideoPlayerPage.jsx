import React, { useContext } from "react";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import PlaylistSidebar from "../components/playlist/PlaylistSidebar";
import CommentsSection from "../components/CommentSection";
import VideoActions from "../components/VideoPlayer/VideoActions";
import { onePlaylist, currentVideo, dummyComments } from "../utils/videosData";
import { AppContext } from "../context/context";

const VideoPlayerPage = () => {
  const { isCinemaMode } = useContext(AppContext);

  const videoLink =
    "https://res.cloudinary.com/dfxpccwii/video/upload/v1756730931/skymltj9zhhsk98k3iad.mp4";
  const posterLink =
    "https://res.cloudinary.com/dfxpccwii/image/upload/v1756654093/nen6f9kxdubhygpvqiie.webp";
  const currentId = onePlaylist.videos?.[1]?.id || onePlaylist.videos?.[0]?.id;

  return (
    <div className="min-h-screen w-full">
      {/* Outer Container - Changes based on cinema mode */}
      <div
        className={`w-full transition-all duration-300 ${
          isCinemaMode ? "bg-gray-700" : ""
        }`}
      >
        <div
          className={`mx-auto transition-all duration-300 ${
            isCinemaMode ? "w-full" : "max-w-7xl px-4 sm:px-6 lg:px-8"
          }`}
        >
          {/* Flex Container with 3 items */}
          <div
            className={`flex flex-wrap gap-4 lg:gap-6 ${
              isCinemaMode ? "" : "mt-4"
            }`}
          >
            {/* Item 1: Video Player */}
            <div
              className={`transition-all duration-300 ${
                isCinemaMode
                  ? "w-full order-1" // Cinema: Full width, first position
                  : "w-full lg:flex-1 lg:min-w-0 order-1" // Default: Flexible width, first position
              }`}
            >
              <VideoPlayer src={videoLink} poster={posterLink} />
            </div>

            {/* Item 2: Playlist Sidebar */}
            <aside
              className={`flex-shrink-0 transition-all duration-300 ${
                isCinemaMode
                  ? "w-full lg:w-[400px] xl:w-[450px] order-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" // Cinema: Third position, beside comments
                  : "w-full lg:w-[400px] xl:w-[450px] order-2" // Default: Second position, beside video
              }`}
            >
              <div className={isCinemaMode ? "mt-4" : ""}>
                <PlaylistSidebar
                  playlist={onePlaylist}
                  currentVideoId={currentId}
                  onVideoSelect={() => {}}
                />
              </div>
            </aside>

            {/* Item 3: Video Actions + Comments */}
            <div
              className={`transition-all duration-300 ${
                isCinemaMode
                  ? "w-full lg:flex-1 lg:min-w-0 order-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" // Cinema: Second position, beside sidebar
                  : "w-full order-3" // Default: Third position, full width below
              }`}
            >
              <div className={isCinemaMode ? "mt-4" : ""}>
                <VideoActions video={currentVideo} />
                <CommentsSection comments={dummyComments} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;