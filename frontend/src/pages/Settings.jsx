import React, { useContext } from "react";
import SettingsContent from "../components/settings/SettingsContent";
import { AppContext } from "../context/context";

const Settings = () => {
  const {setShowLogin, showLogin} = useContext(AppContext)
  return (
    <div>
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200" onClick={()=> {setShowLogin(true)}}>login</button>
      <SettingsContent />
    </div>
  );
};

export default Settings;
