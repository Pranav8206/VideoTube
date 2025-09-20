import React, { createContext, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchAllVideos = async () => {
    try {
      const { data } = await axios.get("/api/v1/videos");
    } catch (error) {
      console.error(error.message);
    }
  };

  const value = { sidebarOpen, setSidebarOpen, fetchAllVideos };

  return  <AppContext.Provider value={value}>
           {children}
          </AppContext.Provider>;
};

export default ContextProvider;
