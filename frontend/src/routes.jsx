// routes.js
import { lazy } from "react";
import App from "./App.jsx";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home.jsx"));
const VideoPlayerPage = lazy(() => import("./pages/VideoPlayerPage.jsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"));
const Trending = lazy(() => import("./pages/Trending.jsx"));
const Subscriptions = lazy(() => import("./pages/Subscriptions.jsx"));
const ChannelPage = lazy(() => import("./pages/ChannelPage.jsx"));
const Playlist = lazy(() => import("./pages/Playlist.jsx"));
const Upload = lazy(() => import("./pages/Upload.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> }, // index means "default child route"
      { path: "play/:videoId", element: <VideoPlayerPage /> },
      { path: "results", element: <SearchResults /> },
      { path: "trending", element: <Trending /> },
      { path: "subscriptions", element: <Subscriptions /> },
      { path: "channel/:channelId", element: <ChannelPage /> },
      { path: "playlist/:playlistId", element: <Playlist /> },
      { path: "upload", element: <Upload /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];

export default routes;
