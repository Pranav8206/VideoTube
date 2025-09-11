import React from "react";
import Hero from "../components/Hero";
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

const Home = () => {
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
      <Hero />
      
    </div>
  );
};

export default Home;
