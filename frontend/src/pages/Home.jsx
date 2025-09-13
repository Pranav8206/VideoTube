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

const Home = ({ sidebarOpen, setSidebarOpen }) => {
  const video = {
    thumbnail: "lsdfkj",
    title: "lsdkfj",
    duration: 33,
    channel: "pm",
    views: 2,
    timestamp: 3,
  };
  return (
    <div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-grow">
        <SmallSidebar />
        <Feed />
      </div>
    </div>
  );
};

export default Home;
