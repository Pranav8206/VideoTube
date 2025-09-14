import React from "react";
import Button from "../components/Button";
import ChannelInfo from "../components/ChannelInfo";
import Sidebar from "../components/Sidebar";
import {
  SidebarClose,
  SidebarCloseIcon,
  SidebarIcon,
  SidebarOpen,
  SidebarOpenIcon,
} from "lucide-react";
import VideoActions from "../components/VideoActions";
import VideoCard from "../components/VideoCard";
import VideosGrid from "../components/VideosGrid";
import Feed from "../components/Feed";
import SmallSidebar from "../components/SmallSidebar";
import CommentsSection from "../components/CommentSection";

const Home = ({ sidebarOpen, setSidebarOpen }) => {
  const video = {
    thumbnail:
      "http://res.cloudinary.com/dfxpccwii/image/upload/v1756714449/ihaj37usp6g4limw5pds.jpg",
    title: "lsdkfj",
    duration: 33,
    channel: "Pranav Mavle",
    views: 2,
    timestamp: 3,
    avatar:
      "http://res.cloudinary.com/dfxpccwii/image/upload/v1756714449/ihaj37usp6g4limw5pds.jpg",
    name: "Pranav Mavle",
    subscribers: "5.2K",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  };
  const dummyComments = [
    {
      id: 1,
      author: "Alice",
      avatar: "https://i.pravatar.cc/40?img=1",
      timestamp: "2 hours ago",
      text: "Great video! Learned a lot.",
      likes: 12,
    },
    {
      id: 2,
      author: "Bob",
      avatar: "https://i.pravatar.cc/40?img=2",
      timestamp: "1 hour ago",
      text: "Thanks for sharing this.",
      likes: 5,
    },
    {
      id: 3,
      author: "Charlie",
      avatar: "https://i.pravatar.cc/40?img=3",
      timestamp: "just now",
      text: "Can you make a tutorial on React hooks?",
      likes: 2,
    },
  ];

  return (
    <div>
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-grow">
        <SmallSidebar />
        <Feed />
      </div> */}
      <ChannelInfo
        avatar="http://res.cloudinary.com/dfxpccwii/image/upload/v1756714449/ihaj37usp6g4limw5pds.jpg"
        name="Pranav Mavle"
        subscribers="5.2K"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />

      <VideoActions video={video} />
      <CommentsSection comments={dummyComments} />
    </div>
  );
};

export default Home;
