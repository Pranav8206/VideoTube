import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Eye, ThumbsUp, Video, Users } from "lucide-react";
import ChannelBanner from "./ChannelBanner";
import ChannelInfoCard from "./ChannelInfoCard";
import ChannelNavigation from "./ChannelNavigation";
import VideosGrid from "../VideosGrid";
import PlaylistGrid from "../playlist/PlaylistGrid";
import Loader from "../Loader";
import { AppContext } from "../../context/AppContext";
import { multiPlaylists } from "../../utils/videosData";
import UserTweets from "./UserTweets";

const ChannelContent = () => {
  const [activeTab, setActiveTab] = useState("Videos");
  const [channelData, setChannelData] = useState(null);
  const [channelStats, setChannelStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState("grid");

  const { channelName } = useParams();
  const { axios } = useContext(AppContext);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/v1/users/c/${channelName.toLowerCase()}`
        );
        console.log("Channel data:", res.data);
        setChannelData(res.data.data);

        // Fetch stats after getting channel data
        if (res.data.data?._id) {
          fetchChannelStats(res.data.data._id);
        }
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

  const fetchChannelStats = async (userId) => {
    try {
      setStatsLoading(true);
      const res = await axios.get(`/api/v1/dashboard/stats/${userId}`, {
        withCredentials: true,
      });
      console.log("Channel stats:", res.data);
      setChannelStats(res.data.data);
    } catch (err) {
      console.error("Stats fetch failed:", err);
      setChannelStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      // Refetch channel data to get updated subscription status and count
      const res = await axios.get(
        `/api/v1/users/c/${channelName.toLowerCase()}`
      );
      setChannelData(res.data.data);

      // Also refetch stats if needed
      if (res.data.data?._id) {
        fetchChannelStats(res.data.data._id);
      }
    } catch (error) {
      console.error("Failed to refresh channel data", error);
    }
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) return <Loader />;
  if (!channelData)
    return (
      <div className="text-center mt-10 text-red-500">
        Channel not found or failed to load
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <ChannelBanner channelBannerLink={channelData.coverImage} />
        <ChannelInfoCard
          channel={channelData}
          isSubscribed={channelData.isSubscribedTo}
          onSubscribe={handleSubscribe}
          verified={true}
          stats={channelStats}
          statsLoading={statsLoading}
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
              forChannelPage={true}
            />
          )}

          {activeTab === "Playlists" && (
            <PlaylistGrid
              playlists={multiPlaylists}
              layout={layout}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === "Tweets" && <UserTweets />}

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

              {/* Channel Stats */}
              {statsLoading ? (
                <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6 shadow-sm flex items-center justify-center">
                  <Loader />
                </div>
              ) : channelStats ? (
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 mb-6 shadow-sm">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                    Channel Statistics
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {/* Total Views */}
                    <div className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <div className="p-3 bg-blue-500 rounded-full mb-3">
                        <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">
                        Total Views
                      </p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                        {formatNumber(channelStats.views)}
                      </p>
                    </div>
                    {/* Total Likes */}
                    <div className="flex flex-col items-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
                      <div className="p-3 bg-pink-500 rounded-full mb-3">
                        <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">
                        Total Likes
                      </p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-pink-600">
                        {formatNumber(channelStats.likes)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Stats & Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Additional Stats */}
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                    More Info
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
                    {channelStats && (
                      <>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-gray-600">Total Videos</span>
                          <span className="text-primary font-semibold">
                            {channelStats.videos}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-gray-600">Total Views</span>
                          <span className="text-primary font-semibold">
                            {formatNumber(channelStats.views)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Links (optional, you can fetch from backend) */}
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                    Links
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {channelData.links && channelData.links.length > 0 ? (
                      channelData.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-primary hover:text-purple-700 transition-colors duration-300 text-sm sm:text-base hover:underline"
                        >
                          {link.title}
                        </a>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No links available
                      </p>
                    )}
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
