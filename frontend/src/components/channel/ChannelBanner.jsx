import React from "react";

const ChannelBanner = ({ channelBannerLink }) => {
  return (
    <div className="relative z-20 h-30 s:h-35 sm:h-45 md:h-50 rounded-2xl mx-[4%] lg:h-60 overflow-hidden aspect-video w-[92%] bg-gradient-to-r from-primary to-purple-600">
      {/* Banner Image */}
      {channelBannerLink && ( 
        <img
          src={channelBannerLink}
          alt="Banner"
          className="absolute inset-0 object-cover w-full"
        />
      )}
    </div>
  );
};

export default ChannelBanner;
