import { useState } from "react";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import VideoTubeApp from "./pages/VideoPlayerPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Outlet />
    </>
  );
}

export default App;
