import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChannelBanner from "./ChannelBanner";
import ChannelInfoCard from "./ChannelInfoCard";
import ChannelNavigation from "./ChannelNavigation";
import VideosGrid from "../VideosGrid";
import PlaylistGrid from "../playlist/PlaylistGrid";
import Loader from "../Loader";
import { AppContext } from "../../context/context";
import { videos as videosData, multiPlaylists } from "../../utils/videosData";

const ChannelContent = () => {
  const [activeTab, setActiveTab] = useState("Videos");
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState("grid");

  const { channelName } = useParams();
  const { axios } = useContext(AppContext);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/v1/users/c/${channelName.toLowerCase()}`,
          {
            headers: { "x-bypass-interceptor": "true" },
          }
        );
        console.log("Channel data:", res.data);
        setChannelData(res.data.data);
      } catch (err) {
        console.error("Fetch failed:", err);
        setChannelData(null);
      } finally {
        setLoading(false);
      }
    };

    if (channelName) {
      fetchChannel();
      console.log("Fetching");
    }
  }, [channelName]);

  const handleSubscribe = async () => {
    try {
      // You can call subscribe/unsubscribe API here
      // For now, just toggle locally
      setChannelData((prev) => ({
        ...prev,
        isSubscribedTo: !prev.isSubscribedTo,
      }));
    } catch (error) {
      console.error("Subscribe action failed", error);
    }
  };

  if (loading) return <Loader />;
  if (!channelData)
    return (
      <div className="text-center mt-10 text-red-500">
        Channel not found or failed to load
      </div>
    );
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <ChannelBanner channelBannerLink={channelData.coverImage} />
        <ChannelInfoCard
          channel={channelData}
          isSubscribed={channelData.isSubscribedTo}
          onSubscribe={handleSubscribe}
          verified={true}
        />
        <ChannelNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={layout}
          onViewModeChange={setLayout}
        />

        <div className="px-0.5 s:px-4 md:px-6 pb-8">
          {activeTab === "Videos" && (
            <VideosGrid
              videos={channelData.videos}
              layout={layout}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "Playlists" && (
            <PlaylistGrid
              playlists={multiPlaylists}
              layout={layout}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "About" && (
            <div className="max-w-4xl px-4">
              {/* Description */}
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 mb-6 shadow-sm">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                  {channelData.description || "No description provided."}
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
                      <span className="text-gray-600">Subscribers</span>
                      <span className="text-primary font-semibold">
                        {channelData.subscribersCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Subscribed to</span>
                      <span className="text-primary font-semibold">
                        {channelData.channelSubscribedTo}
                      </span>
                    </div>
                    {/* Add more stats if needed */}
                  </div>
                </div>

                {/* Links (optional, you can fetch from backend) */}
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                    Links
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {channelData.links?.map((link, index) => (
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
