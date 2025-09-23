import React, { useContext } from "react";
import { AppContext } from "../context/context";
import { ChevronUp } from "lucide-react";

const NotificationModal = ({ message = "This is a dummy notification!" }) => {
  const { showNotification, setShowNotification } = useContext(AppContext);

  return (
    <>
      {showNotification && (
        <div
          onClick={() => setShowNotification(false)}
          className="fixed  w-full h-full inset-0 bg-black/60 z-40 //bg-red-600 "
        ></div>
      )}
      <div
        className={`sticky top-0 right-0 left-1/2 sm:mx-3  max-sm:max-w-[80vw] sm:w-[50vw] w-100 h-100 border flex  bg-opacity-40 z-40 bg-white rounded-lg shadow-lg p-6 min-w-[300px]  ${
          showNotification ? "" : " hidden"
        }
        `}
      >
        <ChevronUp fill="white" className="absolute text-white -top-4.75 right-9.5 sm:right-0.5 stroke-black stroke- " size={40} absoluteStrokeWidth={1} strokeWidth={1}  /> <div>
        
        <div className="text-lg font-semibold mb-2">Notification</div>
        <div className="text-gray-700">{message}</div>
        </div>
      </div>
    </>
  );
};

export default NotificationModal;
