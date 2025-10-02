import react from "react";
import Navbar from "./components/Navbars/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import NotificationModal from "./components/NotificationModal.jsx";
import VoiceSearchBox from "./components/voiceSearch/VoiceSearch.jsx";

function App() {
  return (
    <>
      <Navbar />
      <NotificationModal />
      <Sidebar />
      <VoiceSearchBox />
      <Outlet />
    </>
  );
}

export default App;
