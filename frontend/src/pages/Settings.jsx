import React, { useContext, useEffect, useState } from "react";
import SettingsContent from "../components/settings/SettingsContent";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";

const Settings = () => {
  const { setShowLogin, fetchCurrentUser, user } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initializeUser = async () => {
      try {
        console.log("Settings: Current user state before fetch:", user);
        const currentUser = await fetchCurrentUser();
        console.log("Settings: Fetched user:", currentUser);

        if (currentUser) {
          console.log("Settings: User exists, hiding login");
          setShowLogin(false);
        } else {
          console.log("Settings: No user, showing login");
          setShowLogin(true);
        }
      } catch (error) {
        console.error("Settings: Error during initialization:", error);
        setShowLogin(true);
      } finally {
        setLoading(false);
      }
    };
    initializeUser();
  }, []);

  if (loading)
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
