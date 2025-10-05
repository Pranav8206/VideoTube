import React, { useContext, useEffect, useState } from "react";
import SettingsContent from "../components/settings/SettingsContent";
import { AppContext } from "../context/context";

const Settings = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const { setShowLogin, user, setUser, logout } = useContext(AppContext);

  useEffect(() => {}, []);

  const handleButton = async () => {
    if (user) {
      await logout();
    } else {
      setShowLogin(true)
    }
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
        onClick={handleButton}
      >
        {user ? "LogOut" : "LogIn"}
      </button>

      <SettingsContent />
    </div>
  );
};

export default Settings;
