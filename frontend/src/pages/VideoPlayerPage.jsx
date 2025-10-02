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
    <div
      className={`flex flex-wrap mx-auto w-full transition-all duration-500 ease-in-out ${
        isCinemaMode ? "" : "px-2 sm:px-4"
      }`}
    >
      {/* Item 1: Video Player */}
      <div
        className={`relative order-1 w-full ease-in-out ${
          isCinemaMode
            ? "md-plus:min-w-full  "
            : "md-plus:flex-1 md-plus:min-w-[50vw]"
        }`}
      >
        {" "}
        <div className={`relative ${isCinemaMode ? "" : "rounded-lg"} `}>
          <VideoPlayer src={videoLink} poster={posterLink} />
        </div>
        <div
          className={`block  ${
            isCinemaMode
              ? "md-plus:hidden"
              : " block"
          }`}
        >
          <VideoActions video={currentVideo} />
          <CommentsSection comments={dummyComments} />
        </div>
      </div>

      {/* Item 2: Playlist Sidebar */}
      <aside
        className={`flex-shrink-0 ease-in-out w-full mx-auto order-3 ${
          isCinemaMode
            ? "md-plus:order-3 md-plus:w-[36vw]"
            : "md-plus:order-2 md-plus:w-[36vw] "
        }`}
      >
        <PlaylistSidebar
          playlist={onePlaylist}
          currentVideoId={currentId}
          onVideoSelect={() => {}}
        />
      </aside>

      {/* Item 3: Video Actions + Comments */}
      <div
        className={`order-2 w-full max-md-plus:hidden transition-opacity duration-500 ease-in-out ${
          isCinemaMode
            ? "flex-1 min-w-0 order-2 max-w-7xl mx-auto px-4 md-plus:px-8 md-plus:w-165 opacity-100 block"
            : "order-3 hidden border"
        }`}
      >
        <VideoActions video={currentVideo} />
        <CommentsSection comments={dummyComments} />
      </div>
    </div>
  );
};

export default VideoPlayerPage;
