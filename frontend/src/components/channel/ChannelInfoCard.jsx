import React, { useState, useContext, useEffect, useCallback } from "react";
import { Bell, BellOff, Check, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import TooltipButton from "../TooltipButton";
import { AppContext } from "../../context/AppContext";

const ChannelInfoCard = ({
  channel,
  isSubscribed,
  onSubscribe,
  verified = false,
  // stats = null,
  // statsLoading = false,
}) => {
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [animateBell, setAnimateBell] = useState(false);
  const [animateStars, setAnimateStars] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [localIsSubscribed, setLocalIsSubscribed] = useState(isSubscribed);

  const { user, getUserAllSubscribedChannels, toggleSubscribeChannel } =
    useContext(AppContext);

  // Fetch subscribed channels and check if current channel is subscribed
  const getAllSubscribeChannel = useCallback(async () => {
    if (!user) return;
    const subscribedChannels = await getUserAllSubscribedChannels();
    const isChannelSubscribed = subscribedChannels.some(
      (sub) => sub.channel._id === channel._id
    );
    setLocalIsSubscribed(isChannelSubscribed);
  }, [getUserAllSubscribedChannels, user, channel._id]);

  useEffect(() => {
    getAllSubscribeChannel();
  }, [getAllSubscribeChannel]);

  useEffect(() => {
    setLocalIsSubscribed(isSubscribed);
  }, [isSubscribed]);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }

    if (user._id === channel._id || user.username === channel.username) {
      toast.error("Can't subscribe to yourself");
      return;
    }

    setSubscribing(true);
    const subscribed = await toggleSubscribeChannel(channel._id);

    if (subscribed === null) {
      setSubscribing(false);
      return;
    }

    setLocalIsSubscribed(subscribed);

    if (subscribed) {
      setAnimateBell(true);
      setAnimateStars(true);
      setTimeout(() => setAnimateBell(false), 1500);
      setTimeout(() => setAnimateStars(false), 800);
    } else {
      setNotificationsOn(false);
    }

    await getAllSubscribeChannel();

    if (onSubscribe) onSubscribe();
    setSubscribing(false);
  };

  const toggleNotifications = () => {
    if (localIsSubscribed) setNotificationsOn((prev) => !prev);
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const channelName = channel?.fullName || channel?.name || "Channel";
  const subscribers = channel?.subscribersCount || channel?.subscribers || 0;
  const videos = channel?.videos?.length || channel?.videoCount || 0;

  const isOwnChannel =
    user && (user._id === channel._id || user.username === channel.username);

  return (
    <div className="relative -mt-1 sm:-mt-4 mb-2 mx-auto container">
      <div className="z-10 rounded-2xl border-2 border-white border-t-gray-100/60 px-6 py-1 s:py-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-6 sm:justify-center mx-auto w-fit">
        {/* Left side: Avatar + Info */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-6">
          <div className="relative">
            {channel?.avatar ? (
              <img
                src={channel?.avatar}
                alt={channelName}
                className="w-16 h-16 s:w-18 s:h-18 rounded-full object-cover border-2 border-purple-600"
              />
            ) : (
              <div className="w-16 h-16 md:w-18 md:h-18 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl sm:text-2xl">
                  {channelName[0]}
                </span>
              </div>
            )}
            {verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <TooltipButton
                tooltipText={channelName}
                className="cursor-pointer"
              >
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate overflow-ellipsis">
                  {channelName.split(" ").map((word, index) =>
                    word === "X" ? (
                      <span key={index} className="text-purple-600">
                        {word}{" "}
                      </span>
                    ) : (
                      <span key={index}>{word} </span>
                    )
                  )}
                </h1>
              </TooltipButton>
              {isOwnChannel && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  Your Channel
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">@{channel.username}</div>
            <div className="text-gray-600 text-sm sm:text-base">
              <span className="font-semibold">{formatNumber(subscribers)}</span>{" "}
              {subscribers <= 1 ? "subscriber" : "subscribers"} • {videos}{" "}
              {videos === 1 ? "video" : "videos"}
            </div>
          </div>
        </div>

        {!isOwnChannel && (
          <div className="flex gap-3 w-52">
            <div className="relative">
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className={`px-5 py-2 w-30 rounded-full font-semibold transition-all shadow relative overflow-hidden cursor-pointer text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    localIsSubscribed
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-primary text-white"
                  }`}
              >
                {localIsSubscribed ? "Subscribed" : "Subscribe"}
              </button>

              {animateStars && (
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                  <Sparkles className="text-yellow-400 w-5 h-5 animate-ping absolute -top-2 -left-1" />
                  <Sparkles className="text-purple-400 w-4 h-4 animate-ping absolute -bottom-2 right-1" />
                  <Sparkles className="text-pink-400 w-4 h-4 animate-ping absolute -top-3 right-6" />
                </div>
              )}
            </div>

            <button
              onClick={toggleNotifications}
              disabled={!localIsSubscribed}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow 
                ${notificationsOn ? "bg-purple-50" : "bg-gray-100"}
                ${
                  !localIsSubscribed
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-purple-100"
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
        )}
      </div>
      <div className="h-0.5 w-[100%] mx-auto rounded-b-2xl bg-primary/3" />
    </div>
  );
};

export default ChannelInfoCard;
