import React, { useState } from "react";
import { Bell, BellOff, Check, Sparkles } from "lucide-react";
import TooltipButton from "../TooltipButton";

const ChannelInfoCard = ({ channel, isSubscribed, onSubscribe, verified }) => {
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [animateBell, setAnimateBell] = useState(false);
  const [animateStars, setAnimateStars] = useState(false);

  const handleSubscribe = () => {
    if (!isSubscribed) {
      setAnimateBell(true);
      setAnimateStars(true);
      setTimeout(() => setAnimateBell(false), 1500);
      setTimeout(() => setAnimateStars(false), 800);
    } else {
      setNotificationsOn(false);
    }
    onSubscribe();
  };

  const toggleNotifications = () => {
    if (isSubscribed) setNotificationsOn((prev) => !prev);
  };

  const channelName = channel?.name || "Channel";
  const subscribers = channel?.subscribers || 0;
  const videos = channel?.videoCount || 0;

  return (
    <div className="relative -mt-10 mb-8">
      <div className="bg-white rounded-2xl border border-gray-200 px-6 py-3 xs:py-5 mx-3 xs:mx-6 md:mx-10 lg:mx-20 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-6 ">
        {/* Left side: Avatar + Info */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
          {/* Channel Avatar */}
          <div className="relative flex-shrink-0">
            {channel?.avatar ? (
              <img
                src={channel.avatar}
                alt={channelName}
                className="w-16 h-16 md:w-18 md:h-18 rounded-full object-cover border-2 border-purple-600"
              />
            ) : (
              <div className="w-16 h-16 md:w-18 md:h-18 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl sm:text-2xl">
                  {channelName[0]}
                </span>
              </div>
            )}
            {/* Verification Badge */}
            {verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Channel Info */}
          <div className="min-w-0">
            <TooltipButton
              tooltipText={channelName}
              className=" cursor-pointer"
            >
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate overflow-ellipsis">
                {channelName.split(" ").map((word, index) =>
                  word === "X" ? (
                    <span key={index} className="text-purple-600">
                      {word}{" "}
                    </span>
                  ) : (
                    <span key={index}>{word}</span>
                  )
                )}
              </h1>
            </TooltipButton>
            <div className="text-gray-600 text-sm sm:text-base">
              <span className="font-semibold">{subscribers}</span>{" "}
              {subscribers.length > 1 || subscribers > 1
                ? "subscribers"
                : "subscriber"}{" "}
              • {videos} {videos > 1 ? "videos" : "video"}
            </div>
          </div>
        </div>

        {/* Right side: Action Buttons */}
        <div className="flex items-center gap-3 md:justify-end ">
          {/* Subscribe Button */}
          <div className="relative">
            <button
              onClick={handleSubscribe}
              className={`px-5 py-2 rounded-lg font-semibold transition-all shadow relative overflow-hidden cursor-pointer text-sm sm:text-base
                ${
                  isSubscribed
                    ? "bg-gray-200 text-gray-800"
                    : "bg-primary text-white"
                }`}
            >
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>

            {/* Shining Stars Effect */}
            {animateStars && (
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <Sparkles className="text-yellow-400 w-5 h-5 animate-ping absolute -top-2 -left-1" />
                <Sparkles className="text-purple-400 w-4 h-4 animate-ping absolute -bottom-2 right-1" />
                <Sparkles className="text-pink-400 w-4 h-4 animate-ping absolute -top-3 right-6" />
              </div>
            )}
          </div>

          {/* Bell Icon */}
          <button
            onClick={toggleNotifications}
            disabled={!isSubscribed}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow 
              ${notificationsOn ? "bg-purple-50" : "bg-gray-100"}
              ${
                !isSubscribed
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
            `}
          >
            {notificationsOn ? (
              <Bell
                className={`w-5 h-5 text-primary ${
                  animateBell ? "animate-bounce" : ""
                }`}
              />
            ) : (
              <BellOff className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelInfoCard;
