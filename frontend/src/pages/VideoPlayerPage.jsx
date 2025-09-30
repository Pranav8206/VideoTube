import React from "react";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import PlaylistSidebar from "../components/playlist/PlaylistSidebar";
import CommentsSection from "../components/CommentSection";
import { onePlaylist, currentVideo, dummyComments } from "../utils/videosData";
import VideoActions from "../components/VideoActions";

const VideoPlayerPage = () => {
  const videoLink =
    "http://res.cloudinary.com/dfxpccwii/videos/upload/v1756909444/nmuwi33nvfssymgwazut.mp4";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto sm:px-4 md:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Video and Comments */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Video Player + Playlist Sidebar */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              <div className="flex-1">
                <VideoPlayer
                  src={videoLink}
                  sources={[videoLink]}
                  poster="http://res.cloudinary.com/dfxpccwii/image/upload/v1756714449/ihaj37usp6g4limw5pds.jpg"
                />
              </div>

              <div className="lg:w-80">
                <PlaylistSidebar
                  playlist={onePlaylist}
                  currentVideoId={
                    onePlaylist.videos?.[1]?.id || onePlaylist.videos[0].id
                  }
                  onVideoSelect={() => {}}
                />
              </div>
            </div>

            {/* Video Information */}
            <VideoActions video={currentVideo} />
            {/* Comments Section */}
            <CommentsSection comments={dummyComments} />
          </div>

          {/* Optional Up Next Sidebar */}
          {/* <div className="hidden lg:block lg:w-80">
            <UpNextSidebar videos={upNextVideos} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
