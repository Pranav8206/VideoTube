import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Frown } from "lucide-react";
import { AppContext } from "./AppContext";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

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

  // --- Utility ---
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
      if (count >= 1)
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
    return "just now";
  };

  // --- Queue handler ---
  const processQueue = (error, token = null) => {
    failedQueueRef.current.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    failedQueueRef.current = [];
  };

  // --- API Calls ---
  const fetchAllVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/v1/videos?limit=100");
      const { success, data: videos, message } = response.data || {};
      const publicVideo = videos.filter((video) => video.isPublished === true);

      if (success && Array.isArray(videos)) return publicVideo;
      console.warn("Failed to fetch videos:", message || "Unknown error");
      return [];
    } catch (error) {
      console.error("Error fetching videos:", error.message);
      return [];
    }
  }, []);

  const fetchVideo = async (videoId) => {
    try {
      const viewedVideos = JSON.parse(
        localStorage.getItem("viewedVideos") || "[]"
      );

      // Increment view if not viewed before
      if (!viewedVideos.includes(videoId)) {
        await axios.post(`/api/v1/videos/${videoId}/incrementViews`);
        localStorage.setItem(
          "viewedVideos",
          JSON.stringify([...viewedVideos, videoId])
        );
      }

      const response = await axios.get(`/api/v1/videos/${videoId}`);
      const { success, data: video } = response.data || {};
      return success ? video : null;
    } catch (error) {
      console.error("Error fetching video:", error);
      return null;
    }
  };

  const fetchCurrentUser = useCallback(async () => {
    try {
      console.log("fetchCurrentUser called");
      const response = await axios.get("/api/v1/users/current-user", {
        withCredentials: true,
      });
      const { success, data: userData } = response.data || {};
      console.log("fetchCurrentUser response:", success, userData);

      if (success && userData) {
        setUser(userData);
        return userData;
      }
      return null;
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Error fetching user:", error.message);
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
      return null;
    }
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, { withCredentials: true });

      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
        window.location.hostname;
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" +
        window.location.hostname;

      // If in production with sameSite=None
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";

      toast.success("Logged out successfully", {
        icon: (
          <Frown size={28} className="text-yellow-500/90" strokeWidth={3} />
        ),
      });
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      setUser(null);
      isRefreshingRef.current = false;
      failedQueueRef.current = [];
    }
  };

  // Fetch all subscribed channels
  const getUserAllSubscribedChannels = async () => {
    try {
      const res = await axios.get("/api/v1/subscriptions");
      return res.data?.data?.channels || [];
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch subscriptions"
      );
      return [];
    }
  };

  // Subscribe or unsubscribe to a channel
  const toggleSubscribeChannel = async (channelId) => {
    try {
      const res = await axios.post(`/api/v1/subscriptions/${channelId}`);
      return res.data?.data?.subscribed;
    } catch (error) {
      console.error("Subscribe error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update subscription"
      );
      return null;
    }
  };

  // --- Refresh Token Interceptor ---
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        const url = originalRequest?.url || "";

        console.log("Axios interceptor caught error:", error);

        const isRefreshEndpoint = url.includes("/api/v1/users/refresh-token");

        if (isRefreshEndpoint) {
          console.error("Refresh token endpoint returned error");
          isRefreshingRef.current = false;
          processQueue(error, null);
          await logout();
          return Promise.reject(error);
        }

        // If status is 401 and request hasn't been retried yet, attempt refresh flow
        if (error.response?.status === 401 && !originalRequest._retry) {
          
          if (url.includes("/current-user") && !user) {
            console.log("Initial auth check failed, skipping retry");
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          if (isRefreshingRef.current) {
            // Queue this request while a refresh is in progress
            return new Promise((resolve, reject) => {
              failedQueueRef.current.push({
                resolve: () => resolve(axios(originalRequest)),
                reject: (err) => reject(err),
              });
            });
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
            return axios(originalRequest);
          } catch (refreshErr) {
            isRefreshingRef.current = false;
            processQueue(refreshErr, null);
            console.error("Token refresh failed:", refreshErr?.message);
            await logout();
            return Promise.reject(refreshErr);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // INITIALIZE: run fetchCurrentUser on mount only (not on user changes)
  useEffect(() => {
    (async () => {
      console.log("Context init: fetching current user");
      const current = await fetchCurrentUser();
      console.log("fetchCurrentUser result:", current);
    })();
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
    getUserAllSubscribedChannels,
    toggleSubscribeChannel,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default ContextProvider;
