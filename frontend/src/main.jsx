import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import VideoPlayerPage from "./pages/VideoPlayerPage.jsx";
import Settings from "./pages/Settings.jsx";
import Subscriptions from "./pages/Subscriptions.jsx";
import ChannelPage from "./pages/ChannelPage.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Trending from "./pages/Trending.jsx";
import Upload from "./pages/Upload.jsx";
import Playlist from "./pages/Playlist.jsx";
import NotFound from "./pages/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/play/:videoId", element: <VideoPlayerPage /> },
      { path: "/results", element: <SearchResults /> },
      { path: "/trending", element: <Trending /> },
      { path: "/subscriptions", element: <Subscriptions /> },
      { path: "/channel/:channelId", element: <ChannelPage /> },
      { path: "/playlist/:playlistId", element: <Playlist /> },
      { path: "/upload", element: <Upload /> },
      { path: "/settings", element: <Settings /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);