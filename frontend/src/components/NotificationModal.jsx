import React, { useContext, useLayoutEffect } from "react";
import { AppContext } from "../context/AppContext";
import { ChevronUp } from "lucide-react";

const NotificationModal = ({ message }) => {
  const { showNotification, setShowNotification } = useContext(AppContext);

  // lock scroll when modal is open
  useLayoutEffect(() => {
    if (showNotification) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, -parseInt(top || "0"));
    }
  }, [showNotification, setShowNotification]);

  if (!showNotification) return null;

  const hasMessage = Boolean(message?.trim());

  return (
    <>
      {/* Backdrop */}
      {showNotification && (
        <div
          onClick={() => setShowNotification(false)}
          className="fixed inset-0 w-full h-full bg-black/10 z-40"
        ></div>
      )}

      <aside
        className={`fixed top-9 sm:top-10 right-0 mx-1 sm:mx-3 max-sm:max-w-[70vw] sm:w-[30vw] border border-gray-300 shadow-2xl flex bg-white bg-opacity-40 transform transition-transform duration-300 z-40 rounded-lg  p-6 min-w-[300px] ${
          showNotification ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ChevronUp
          fill="white"
          className="absolute text-white z-50 -top-5 right-8 sm:right-0 stroke-gray-200 sm:stroke-0.5"
          size={41}
          strokeWidth={1}
        />
        <div>
          <div className="text-lg font-semibold mb-3 pb-2 border-b">
            Notifications
          </div>
          {hasMessage ? (
            <div className="text-gray-700">{message}</div>
          ) : (
            <div className="text-gray-500 italic">
              You have no new notifications.
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default NotificationModal;
