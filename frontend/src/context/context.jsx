import { createContext } from "react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const ContextProvider = (props) => {
  const fetchAllVideos = async () => {
    try {
      const { data } = await axios.get("/api/v1/videos");
    } catch (error) {
      console.error(error.message);
    }
  };
  return <AppContext.Provider value={{}}>{props.children}</AppContext.Provider>;
};
