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
      { path: "v/:videoId", element: <VideoPlayerPage /> },
      { path: "s/:searchQuery", element: <SearchResults /> },
      { path: "trending", element: <Trending /> },
      { path: "subscription", element: <Subscriptions /> },
      { path: "c/:channelName", element: <ChannelPage /> },
      { path: "p/:playlistId", element: <Playlist /> },
      { path: "upload", element: <Upload /> },
      { path: "setting", element: <Settings /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];

export default routes;
