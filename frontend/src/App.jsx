import react from "react";
import Navbar from "./components/Navbars/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import NotificationModal from "./components/NotificationModal.jsx";
import VoiceSearchBox from "./components/voiceSearch/VoiceSearch.jsx";
import Login from "./components/Login.jsx";
import AddToPlaylistModal from "./components/playlist/AddToPlaylistModal.jsx";

function App() {
  return (
    <div className="bg-white text-black">
      <Navbar />
      <NotificationModal />
      <Sidebar />
      <VoiceSearchBox />
      <AddToPlaylistModal />
      <Login />
      <Outlet />
    </div>
  );
}

export default App;
