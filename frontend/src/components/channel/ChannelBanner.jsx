import React from "react";

const ChannelBanner = ({ channelBannerLink }) => {
  return (
    <div className="relative h-48 md:h-64 overflow-hidden">
      {/* Banner Image */}
      {channelBannerLink && (
        <img
          src={channelBannerLink}
          alt="Channel Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/60 via-purple-600/60 to-indigo-700/60"></div>

      {/* Wave-like patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-400/30 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-l from-indigo-400/30 to-transparent"></div>
      </div>
    </div>
  );
};

export default ChannelBanner;
