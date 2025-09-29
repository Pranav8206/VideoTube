import React, { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";
import AccountSettings from "./AccountSettings";
import PasswordSettings from "./PasswordSettings";
import NotificationSettings from "./NotificationSettings";
import PrivacySettings from "./PrivacySettings";

const SettingsContent = () => {
  const [activeSection, setActiveSection] = useState("account");

  const renderMainContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountSettings />;
      case "password":
        return <PasswordSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "privacy":
        return <PrivacySettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden ">
      <SettingsSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      {renderMainContent()}
    </div>
  );
};

export default SettingsContent;
