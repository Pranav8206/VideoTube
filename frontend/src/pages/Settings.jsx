import React, { useContext, useEffect, useState } from "react";
import SettingsContent from "../components/settings/SettingsContent";
import { AppContext } from "../context/context";

const Settings = () => {
  const { setShowLogin, user } = useContext(AppContext);

  useEffect(() => {
    if (!user) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  });

  return (
    <div>
      <SettingsContent />
    </div>
  );
};

export default Settings;
