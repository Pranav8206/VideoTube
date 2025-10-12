import React, { useContext, useEffect, useState } from "react";
import SettingsContent from "../components/settings/SettingsContent";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";

const Settings = () => {
  const { setShowLogin, fetchCurrentUser } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        if (currentUser) {
          setShowLogin(false);
        } else setShowLogin(true);
      } finally {
        setLoading(false);
      }
    };
    initializeUser();
  }, [fetchCurrentUser]);

  if (loading)
    return (
      <div className="relative h-[88vh]">
        <Loader />
      </div>
    );

  return (
    <div>
      <SettingsContent />
    </div>
  );
};

export default Settings;
