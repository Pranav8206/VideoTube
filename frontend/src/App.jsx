import react from "react";
import Navbar from "./components/Navbars/Navbar.jsx";
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
