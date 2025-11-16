import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import VideoActions from "../components/VideoPlayer/VideoActions";
import { onePlaylist } from "../utils/videosData";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";

const PlaylistSidebar = lazy(() =>
  import("../components/playlist/PlaylistSidebar")
);
const CommentsSection = lazy(() => import("../components/CommentSection"));

const VideoPlayerPage = () => {
  const [video, setVideo] = useState({});
  const { isCinemaMode, fetchVideo } = useContext(AppContext);
  const { videoId } = useParams();
  const currentId = onePlaylist.videos?.[1]?.id || onePlaylist.videos?.[0]?.id;

  useEffect(() => {
    let ignore = false;
    const loadVideo = async () => {
      const fetched = await fetchVideo(videoId);
      if (!ignore) setVideo(fetched);
    };
    loadVideo();
    return () => {
      ignore = true;
    };
  }, [videoId, fetchVideo]);

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
        <div className={`relative ${isCinemaMode ? "" : "rounded-lg"} `}>
          <VideoPlayer src={video.videoFile} poster={video.thumbnail} />
        </div>
        <div className={`block  ${isCinemaMode ? "md-plus:hidden" : " block"}`}>
          <VideoActions video={video} />
          {video._id && (
            <Suspense fallback={<div></div>}>
              <CommentsSection videoId={video._id} videoOwnerId={video.owner} />
            </Suspense>
          )}
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
        <Suspense fallback={<div></div>}>
          <PlaylistSidebar
            playlist={onePlaylist}
            currentVideoId={currentId}
            onVideoSelect={() => {}}
          />
        </Suspense>
      </aside>

      {/* Item 3: Video Actions + Comments */}
      <div
        className={`order-2 w-full max-md-plus:hidden transition-opacity duration-500 ease-in-out ${
          isCinemaMode
            ? "flex-1 min-w-0 order-2 max-w-7xl mx-auto px-4 md-plus:px-8 md-plus:w-165 opacity-100 block"
            : "order-3 hidden"
        }`}
      >
        <VideoActions video={video} />
        {video._id && (
          <Suspense fallback={<div></div>}>
            <CommentsSection videoId={video._id} videoOwnerId={video.owner} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerPage;
