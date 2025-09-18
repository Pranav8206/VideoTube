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
import VideoPlayer from "../components/VideoPlayer/VideoPlayer.jsx";
import NotFound from "../components/NotFound.jsx";

const Home = ({ sidebarOpen, setSidebarOpen }) => {
  const dummyVideos = [
    {
      id: 0,
      thumbnail: "https://i.ytimg.com/vi/ScMzIvxBSi4/hqdefault.jpg",
      title: "React Tutorial for Beginners",
      duration: 720,
      channel: "React School",
      views: 25000,
      timestamp: "5 days ago",
      avatar: "https://i.pravatar.cc/40?img=7",
      name: "React School",
      subscribers: "200K",
      description:
        "Start learning React from scratch with this beginner tutorial.",
    },
    {
      id: 4,
      thumbnail: "https://i.ytimg.com/vi/1wZw7Rv2wrw/hqdefault.jpg",
      title: "React State Management",
      duration: 800,
      channel: "Dev Simplified",
      views: 6700,
      timestamp: "4 days ago",
      avatar: "https://i.pravatar.cc/40?img=8",
      name: "Dev Simplified",
      subscribers: "90K",
      description: "Understanding state management in React.",
    },
    {
      id: 5,
      thumbnail: "https://i.ytimg.com/vi/3qBXWUpoPHo/hqdefault.jpg",
      title: "React Router in 15 Minutes",
      duration: 900,
      channel: "Codevolution",
      views: 12000,
      timestamp: "6 days ago",
      avatar: "https://i.pravatar.cc/40?img=9",
      name: "Codevolution",
      subscribers: "110K",
      description: "Learn React Router quickly and easily.",
    },
    {
      id: 6,
      thumbnail: "https://i.ytimg.com/vi/4UZrsTqkcW4/hqdefault.jpg",
      title: "React Context API Explained",
      duration: 650,
      channel: "Web Dev Simplified",
      views: 9800,
      timestamp: "2 days ago",
      avatar: "https://i.pravatar.cc/40?img=10",
      name: "Web Dev Simplified",
      subscribers: "130K",
      description: "A deep dive into React's Context API.",
    },
    {
      id: 7,
      thumbnail: "https://i.ytimg.com/vi/9D1x7-2FmTA/hqdefault.jpg",
      title: "React Performance Optimization",
      duration: 1100,
      channel: "Performance Pro",
      views: 5400,
      timestamp: "1 week ago",
      avatar: "https://i.pravatar.cc/40?img=11",
      name: "Performance Pro",
      subscribers: "70K",
      description: "Tips to make your React apps faster.",
    },
    {
      id: 8,
      thumbnail: "https://i.ytimg.com/vi/0riHps91AzE/hqdefault.jpg",
      title: "React useEffect Mastery",
      duration: 780,
      channel: "React Mastery",
      views: 8000,
      timestamp: "3 days ago",
      avatar: "https://i.pravatar.cc/40?img=12",
      name: "React Mastery",
      subscribers: "95K",
      description: "Everything about useEffect in React.",
    },
    {
      id: 9,
      thumbnail: "https://i.ytimg.com/vi/6ThXsUwLWvc/hqdefault.jpg",
      title: "React Forms Tutorial",
      duration: 850,
      channel: "Form Wizard",
      views: 6000,
      timestamp: "2 weeks ago",
      avatar: "https://i.pravatar.cc/40?img=13",
      name: "Form Wizard",
      subscribers: "60K",
      description: "How to handle forms in React.",
    },
    {
      id: 10,
      thumbnail: "https://i.ytimg.com/vi/7CqJlxBYj-M/hqdefault.jpg",
      title: "React Project Ideas",
      duration: 500,
      channel: "Project Hub",
      views: 4300,
      timestamp: "1 week ago",
      avatar: "https://i.pravatar.cc/40?img=14",
      name: "Project Hub",
      subscribers: "40K",
      description: "Fun project ideas for React developers.",
    },
    {
      id: 11,
      thumbnail: "https://i.ytimg.com/vi/8zKuNo4ay8E/hqdefault.jpg",
      title: "React with TypeScript",
      duration: 950,
      channel: "TS React",
      views: 7200,
      timestamp: "4 days ago",
      avatar: "https://i.pravatar.cc/40?img=15",
      name: "TS React",
      subscribers: "55K",
      description: "Using TypeScript in your React projects.",
    },
    {
      id: 12,
      thumbnail: "https://i.ytimg.com/vi/9U3IhLAnSxM/hqdefault.jpg",
      title: "React Custom Hooks",
      duration: 700,
      channel: "Hooked On React",
      views: 5100,
      timestamp: "3 days ago",
      avatar: "https://i.pravatar.cc/40?img=16",
      name: "Hooked On React",
      subscribers: "38K",
      description: "How to create and use custom hooks.",
    },
    {
      id: 13,
      thumbnail: "https://i.ytimg.com/vi/10q7c5r3y7w/hqdefault.jpg",
      title: "React and Redux Crash Course",
      duration: 1200,
      channel: "Redux Guru",
      views: 15000,
      timestamp: "2 weeks ago",
      avatar: "https://i.pravatar.cc/40?img=17",
      name: "Redux Guru",
      subscribers: "100K",
      description: "Master Redux with React in one video.",
    },
    {
      id: 14,
      thumbnail: "https://i.ytimg.com/vi/11g1kBvG71Y/hqdefault.jpg",
      title: "React Testing Library Basics",
      duration: 600,
      channel: "Test Driven",
      views: 3500,
      timestamp: "5 days ago",
      avatar: "https://i.pravatar.cc/40?img=18",
      name: "Test Driven",
      subscribers: "25K",
      description: "Introduction to testing React components.",
    },
    {
      id: 15,
      thumbnail: "https://i.ytimg.com/vi/12v1rQK2Q1w/hqdefault.jpg",
      title: "React Animation with Framer Motion",
      duration: 800,
      channel: "Motion Dev",
      views: 4100,
      timestamp: "1 week ago",
      avatar: "https://i.pravatar.cc/40?img=19",
      name: "Motion Dev",
      subscribers: "33K",
      description: "Add beautiful animations to your React apps.",
    },
    {
      id: 16,
      thumbnail: "https://i.ytimg.com/vi/13wK2Q1w1v1/hqdefault.jpg",
      title: "React Error Boundaries",
      duration: 550,
      channel: "Error Handler",
      views: 2900,
      timestamp: "2 days ago",
      avatar: "https://i.pravatar.cc/40?img=20",
      name: "Error Handler",
      subscribers: "18K",
      description: "Handle errors gracefully in React.",
    },
    {
      id: 17,
      thumbnail: "https://i.ytimg.com/vi/14v1rQK2Q1w/hqdefault.jpg",
      title: "React Suspense & Lazy Loading",
      duration: 900,
      channel: "Async React",
      views: 6700,
      timestamp: "3 days ago",
      avatar: "https://i.pravatar.cc/40?img=21",
      name: "Async React",
      subscribers: "29K",
      description: "Optimize loading with Suspense and lazy.",
    },
    {
      id: 18,
      thumbnail: "https://i.ytimg.com/vi/15wK2Q1w1v1/hqdefault.jpg",
      title: "React useRef in Depth",
      duration: 600,
      channel: "Ref Master",
      views: 3200,
      timestamp: "6 days ago",
      avatar: "https://i.pravatar.cc/40?img=22",
      name: "Ref Master",
      subscribers: "22K",
      description: "All about useRef and its use cases.",
    },
    {
      id: 19,
      thumbnail: "https://i.ytimg.com/vi/16v1rQK2Q1w/hqdefault.jpg",
      title: "React Memo & useCallback",
      duration: 750,
      channel: "Performance React",
      views: 5800,
      timestamp: "1 week ago",
      avatar: "https://i.pravatar.cc/40?img=23",
      name: "Performance React",
      subscribers: "27K",
      description: "Optimize renders with memo and useCallback.",
    },
    {
      id: 1,
      thumbnail: "https://i.ytimg.com/vi/ysz5S6PUM-U/hqdefault.jpg",
      title: "Learn React in 10 Minutes",
      duration: 600,
      channel: "CodeAcademy",
      views: 12000,
      timestamp: "1 day ago",
      avatar: "https://i.pravatar.cc/40?img=4",
      name: "CodeAcademy",
      subscribers: "150K",
      description: "A quick introduction to React for beginners.",
    },
    {
      id: 2,
      thumbnail: "https://i.ytimg.com/vi/Ke90Tje7VS0/hqdefault.jpg",
      title: "React Hooks Crash Course",
      duration: 900,
      channel: "Tech Guru",
      views: 8500,
      timestamp: "3 hours ago",
      avatar: "https://i.pravatar.cc/40?img=5",
      name: "Tech Guru",
      subscribers: "80K",
      description: "Everything you need to know about React Hooks.",
    },
    {
      id: 3,
      thumbnail: "https://i.ytimg.com/vi/dGcsHMXbSOA/hqdefault.jpg",
      title: "Advanced React Patterns",
      duration: 1200,
      channel: "Frontend Expert",
      views: 4300,
      timestamp: "2 days ago",
      avatar: "https://i.pravatar.cc/40?img=6",
      name: "Frontend Expert",
      subscribers: "60K",
      description: "Take your React skills to the next level.",
    },
  ];
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

  const VideoLink =
    "http://res.cloudinary.com/dfxpccwii/video/upload/v1756909444/nmuwi33nvfssymgwazut.mp4";

  return (
    <div>
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-grow">
        <SmallSidebar />
        <Feed />
      </div> */}

      <VideoPlayer
        src={VideoLink}
        sources={[VideoLink]}
        poster="http://res.cloudinary.com/dfxpccwii/image/upload/v1756714449/ihaj37usp6g4limw5pds.jpg"
      />

      <VideoActions video={video} />
      {/* <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <CommentsSection comments={dummyComments} />
        </div>
        <div style={{ flex: 2 }}>
          {dummyVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>*/}
      {/* <VideosGrid videos={dummyVideos} /> */}

      <ChannelInfo
        avatar="http://res.cloudinary.com/dfxpccwii/image/upload/v1756714449/ihaj37usp6g4limw5pds.jpg"
        name="Pranav Mavle"
        subscribers="5.2K"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />
      <NotFound/>
    </div>
  );
};

export default Home;
