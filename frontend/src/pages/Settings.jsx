import React, { useContext, useEffect, useState } from "react";
import SettingsContent from "../components/settings/SettingsContent";
import { AppContext } from "../context/context";
import Loader from "../components/Loader";

const Settings = () => {
  const { setShowLogin, user } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    if (!user) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
    setLoading(false);
  });

  if (loading)
    return (
      <>
        <Loader />
      </>
    );
  return (
    <div>
      <SettingsContent />
    </div>
  );
};

export default Settings;
