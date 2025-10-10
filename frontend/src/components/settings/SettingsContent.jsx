import React, { useState } from "react";
import SettingsSidebar from "./SettingsSidebar";
import AccountSettings from "./AccountSettings";
import NotificationSettings from "./NotificationSettings";
import PrivacySettings from "./PrivacySettings";
import UserVideo from "./UserVideo";

const SettingsContent = () => {
  const [activeSection, setActiveSection] = useState("account");

  const renderMainContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "privacy":
        return <PrivacySettings />;
      case "my-videos":
        return <UserVideo />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="h-full w-full flex max-sm:flex-col sm:rounded-tl-2xl">
      <SettingsSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      {renderMainContent()}
    </div>
  );
};

export default SettingsContent;
