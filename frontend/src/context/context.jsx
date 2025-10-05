import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showingSearchResults, setShowingSearchResults] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [showVoiceSearchBox, setShowVoiceSearchBox] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  const fetchAllVideos = async () => {
    try {
      const response = await axios.get("/api/v1/videos");

      if (!response || !response.data) {
        console.warn("No response from server");
        return [];
      }

      const { success, data: videos, message } = response.data;

      if (success && Array.isArray(videos)) {
        return videos;
      }
      console.warn("Failed to fetch videos:", message || "Unknown error");
      return [];
    } catch (error) {
      console.error("No response from server:", error.message);
      return [];
    }
  };

  const fetchVideo = async (videoId) => {
    try {
      const response = await axios.get(`/api/v1/videos/${videoId}`);
      if (!response || !response.data) {
        console.warn("No response from server");
        return null;
      }
      const { success, data: video, message } = response.data;

      if (success && video) {
        return video;
      }
      console.warn("Failed to fetch videos:", message || "Unknown error");
      return null;
    } catch (error) {
      console.error("Error fetching video:", error);
      return null;
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("/api/v1/users/current-user");

      if (!response || !response.data) {
        console.warn("No response from server");
        return null;
      }
      const { success, data: userData, message } = response.data;
      if (success) setUser(userData);

      console.warn("Failed to fetch user:", message || "Unknown error");
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("error.message");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    axios.defaults.headers.common["Authorization"] = "";
    toast.success("You have been logged out");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setToken(token);
      }
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    if (token) {
      console.log("token changed");
      
      axios.defaults.headers.common["Authorization"] = `${token}`;
      fetchCurrentUser();
    }
  }, [token]);

  const value = {
    sidebarOpen,
    setSidebarOpen,
    fetchAllVideos,
    showNotification,
    setShowNotification,
    searchQuery,
    setSearchQuery,
    showingSearchResults,
    setShowingSearchResults,
    isCinemaMode,
    setIsCinemaMode,
    showVoiceSearchBox,
    setShowVoiceSearchBox,
    timeAgo,
    setShowLogin,
    showLogin,
    fetchVideo,
    axios,
    token,
    setToken,
    fetchCurrentUser,
    user,
    setUser,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default ContextProvider;
