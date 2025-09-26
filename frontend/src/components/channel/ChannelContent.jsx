import React, { useState } from "react";
import ChannelBanner from "./ChannelBanner";
import ChannelInfoCard from "./ChannelInfoCard";
import ChannelNavigation from "./ChannelNavigation";
import VideosGrid from "../VideosGrid";
import { videos as videosData } from "../../utils/videosData";

const ChannelContent = () => {
  const [activeTab, setActiveTab] = useState("Videos");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState("grid");

  // Sample channel data matching the image
  const channelData = {
    name: "OceanX Adventures",
    subscribers: "1.2M",
    videoCount: "350",
    joinDate: "Joined Feb 2018",
    totalViews: "847M",
    country: "India",
    description:
      "Welcome to OceanX Adventures! We bring you the latest in underwater exploration, marine life documentaries, and ocean conservation. From deep sea discoveries to coral reef adventures, we've got you covered with professional underwater footage and marine science insights.",
    links: [
      { title: "Website", url: "#" },
      { title: "Twitter", url: "#" },
      { title: "Instagram", url: "#" },
      { title: "Business Email", url: "#" },
    ],
    banner:
      "https://static.vecteezy.com/system/resources/thumbnails/002/292/582/small/elegant-black-and-gold-banner-background-free-vector.jpg",
    verified: true,
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <ChannelBanner channelBannerLink={channelData.banner} />
        <ChannelInfoCard
          channel={channelData}
          isSubscribed={isSubscribed}
          onSubscribe={handleSubscribe}
          verified={channelData.verified}
        />
        <ChannelNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={layout}
          onViewModeChange={setLayout}
        />

        <div className="px-2 s:px-6 pb-8">
          {activeTab === "Videos" && (
            <VideosGrid
              videos={videosData}
              layout={layout}
              searchQuery={searchQuery}
            />
          )}
          {activeTab === "Playlists" && (
            <div className="text-center px-4 min-h-screen">
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-100 max-w-md mx-auto shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  No playlists yet
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  This channel hasn't created any playlists.
                </p>
              </div>
            </div>
          )}

          {activeTab === "About" && (
            <div className="max-w-4xl px-4">
              {/* Description */}
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 mb-6 shadow-sm">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                  {channelData.description}
                </p>
              </div>

              {/* Stats & Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Stats */}
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                    Stats
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Joined</span>
                      <span className="text-primary font-semibold">
                        {channelData.joinDate}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Total views</span>
                      <span className="text-primary font-semibold">
                        {channelData.totalViews}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Country</span>
                      <span className="text-primary font-semibold">
                        {channelData.country}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                    Links
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {channelData.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        className="block text-primary hover:text-purple-700 transition-colors duration-300 text-sm sm:text-base"
                      >
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelContent;
