import React, { useContext, useEffect } from "react";
import SettingsContent from "../components/settings/SettingsContent";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";

const Settings = () => {
  const { setShowLogin, user, isLoadingUser } = useContext(AppContext);

  useEffect(() => {
    if (!isLoadingUser) {
      if (!user) {
        setShowLogin(true);
      }
    }
  }, [user, isLoadingUser, setShowLogin]);

  // Show loader while context is still loading user
  if (isLoadingUser)
    return (
      <div className="relative h-[88vh]">
        <Loader />
      </div>
    );

  if (!user) {
    return null;
  }

  return (
    <div>
      <SettingsContent />
    </div>
  );
};

export default Settings;
