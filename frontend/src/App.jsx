import { useState } from "react";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import VideoTubeApp from "./pages/Playing.jsx";
import Sidebar from "./components/Sidebar.jsx";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <>
      <Navbar setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Home sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </>
  );
}

export default App;
