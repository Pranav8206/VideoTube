import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Frown } from "lucide-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showingSearchResults, setShowingSearchResults] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [showVoiceSearchBox, setShowVoiceSearchBox] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  // Refs to prevent multiple simultaneous token refresh attempts
  const isRefreshingRef = useRef(false);
  const failedQueueRef = useRef([]);

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

  // Process queued requests after token refresh completes
  const processQueue = (error, token = null) => {
    failedQueueRef.current.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueueRef.current = [];
  };

  //    API calls-----------------------------------------------------

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
      console.error("Error fetching videos:", error.message);
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
      console.warn("Failed to fetch video:", message || "Unknown error");
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
        return null;
      }

      const { success, data: userData } = response.data;

      if (success && userData) {
        setUser(userData);
        return userData;
      }

      // success: false means not logged in (not an error)
      return null;
    } catch (error) {
      // Silently fail for non-authenticated users (first-time visitors)
      // Only log in debug mode, not as an error
      if (error.response?.status !== 401) {
        console.error("Error fetching user:", error.message);
      }
      return null;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully", {
        icon: (
          <Frown size={28} className="text-yellow-500/90" strokeWidth={3} />
        ),
      });
    } catch (error) {
      console.error("Logout failed:", error.message);
    }

    // Clear user state and reset refresh flags
    setUser(null);
    isRefreshingRef.current = false;
    failedQueueRef.current = [];
  };

  // TOKEN REFRESH HANDLER ----------------------

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        const url = originalRequest?.url || "";

        // Never try to refresh for these auth endpoints to avoid loops
        const isAuthEndpoint =
          url.includes("/api/v1/users/refresh-token") ||
          url.includes("/api/v1/users/logout") ||
          url.includes("/api/v1/users/login") ||
          url.includes("/api/v1/users/register") ||
          url.includes("/api/v1/users/current-user"); // Don't refresh on initial auth check

        if (isAuthEndpoint) {
          if (url.includes("/api/v1/users/refresh-token")) {
            console.error("Token refresh failed");
            isRefreshingRef.current = false;
            processQueue(error, null);
            logout();
          }
          return Promise.reject(error);
        }

        // Only attempt refresh once per original request
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // If already refreshing, queue this request
          if (isRefreshingRef.current) {
            return new Promise((resolve, reject) => {
              failedQueueRef.current.push({ resolve, reject });
            })
              .then(() => axios(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          isRefreshingRef.current = true;

          try {
            await axios.post(
              "/api/v1/users/refresh-token",
              {},
              { withCredentials: true }
            );

            isRefreshingRef.current = false;
            processQueue(null, true);

            // Retry original request with new token
            return axios(originalRequest);
          } catch (refreshErr) {
            isRefreshingRef.current = false;
            processQueue(refreshErr, null);
            console.error("Token refresh failed:", refreshErr?.message);
            logout();
            return Promise.reject(refreshErr);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  //  INITIALIZE ----------------------

  useEffect(() => {
    fetchCurrentUser();
  }, []);

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
    fetchCurrentUser,
    user,
    setUser,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default ContextProvider;
