import React, { useState } from "react";
import Button from "./Button";


const ChannelInfo = (channel) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 py-4 sm:py-6 px-2 sm:px-6 rounded-xl shadow-md border transition-all duration-300 hover:shadow-lg w-full bg-[var(--color-light)] border-[var(--color-borderColor)] max-w-full"
    >
      <div className="flex flex-row items-center gap-3 sm:gap-5 w-full flex-1">
        <img
          src={channel.avatar}
          alt={channel.name}
          className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 shadow-sm object-cover transition-transform duration-300 hover:scale-105 mx-0 border-[var(--color-primary)]"
        />
        <div className="flex flex-col items-start text-left w-full min-w-0">
          <h3
            className="font-bold text-base sm:text-xl mb-0.5 truncate w-full text-[var(--color-dark)]"
          >
            {channel.name}
          </h3>
          <p
            className="text-xs sm:text-sm font-medium mb-0.5 text-[var(--color-primary)]"
          >
            {channel.subscribers} subscribers
          </p>
          <p
            className="text-xs sm:text-sm mt-1 truncate w-full text-[var(--color-dark)] whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
          >
            {channel.description}
          </p>
        </div>
        <div className="flex justify-end min-w-[140px] max-w-[200px] ml-2">
          <Button
            variant={isSubscribed ? "secondary" : "primary"}
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`w-[140px] px-6 py-2 rounded-full font-semibold shadow transition-colors duration-200 min-w-[140px] max-w-[200px] ${isSubscribed ? 'bg-[var(--color-primary-dull)] text-[var(--color-dark)]' : 'bg-[var(--color-primary)] text-white'}`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChannelInfo;
