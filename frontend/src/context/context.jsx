import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
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

      const response = await axios.get("/api/v1/users/current-user");
      const { success, data: userData } = response.data || {};
      if (success && userData) {
        setUser(userData);
        return userData;
      }
      return null;
    } catch (error) {
      if (error.response?.status !== 401)
        console.error("Error fetching user:", error.message);
      return null;
    }
  }, []);

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

    // Cleanup
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    isRefreshingRef.current = false;
    failedQueueRef.current = [];
  };

  // --- Keep Axios Auth Header Synced ---
  useEffect(() => {
    if (user?.accessToken || user?.token) {
      const token = user.accessToken || user.token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  // --- Refresh Token Interceptor ---
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        const url = originalRequest?.url || "";

        const isAuthEndpoint =
          url.includes("/api/v1/users/refresh-token") ||
          url.includes("/api/v1/users/logout") ||
          url.includes("/api/v1/users/login") ||
          url.includes("/api/v1/users/register") ||
          url.includes("/api/v1/users/current-user");

        if (isAuthEndpoint) {
          if (url.includes("/api/v1/users/refresh-token")) {
            console.error("Token refresh failed");
            isRefreshingRef.current = false;
            processQueue(error, null);
            logout();
          }
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

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
