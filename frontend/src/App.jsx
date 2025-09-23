import { useState } from "react";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbars/Navbar.jsx";
import VideoTubeApp from "./pages/VideoPlayerPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import NotificationModal from "./components/NotificationModal.jsx";

function App() {
  return (
    <>
      <Navbar />
      <NotificationModal />
      <Sidebar />
      <Outlet />
    </>
  );
}

export default App;
