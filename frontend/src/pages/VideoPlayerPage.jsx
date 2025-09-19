import React from "react";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import VideoActions from "../components/VideoActions";
import CommentsSection from "../components/CommentSection";
import VideoCard from "../components/VideoCard";
import { useParams } from "react-router-dom";

const VideoPlayerPage = () => {
  const VideoLink =
    "http://res.cloudinary.com/dfxpccwii/videos/upload/v1756909444/nmuwi33nvfssymgwazut.mp4";
  const videos = {
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
      text: "Great videos! Learned a lot.",
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
  ];

  const { videoId } = useParams();

  return (
    <div>
      <VideoPlayer
        src={VideoLink}
        sources={[VideoLink]}
        poster="http://res.cloudinary.com/dfxpccwii/image/upload/v1756714449/ihaj37usp6g4limw5pds.jpg"
      />
      <VideoActions video={videos} />
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <CommentsSection comments={dummyComments} />
        </div>
        <div style={{ flex: 2 }}>
          {dummyVideos.map((videos) => (
            <VideoCard key={videos.id} video={videos} />
          ))}
        </div>
      </div>
      {videoId} -VideoId from params/ path/ url
    </div>
  );
};

export default VideoPlayerPage;
