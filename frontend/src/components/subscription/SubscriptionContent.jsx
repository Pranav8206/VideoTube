import React, { useState } from "react";
import VideoCard from "../VideoCard";
import EmptyState from "./EmptyState";
import ChannelFilter from "./ChannelFilter";
import { subscribedChannels, videosData } from "../../utils/videosData";

const SubscriptionContent = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Filter videos based on active filter
  const filteredVideos =
    activeFilter === "all"
      ? videosData
      : videosData.filter((video) => video.channel.id === Number(activeFilter));

  // Calculate total new(unwatched) videos
  //show the icon on subscription icon to show that the videos are present
  const totalNewVideos = subscribedChannels.reduce(
    (total, channel) => total + channel.newVideos,
    0
  );

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading more videos
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center w-full pt-2">
        <h1 className="text-3xl font-black text-pretty text-gray-800 relative">
          Subscriptions
          {totalNewVideos > 0 && (
            <span className="absolute -top-1 -right-6 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {totalNewVideos}
            </span>
          )}
        </h1>
        <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
      </div>
      <div className="sticky top-0 z-10 bg-gray-50">
        <ChannelFilter
          channels={subscribedChannels}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />{" "}
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {filteredVideos.length === 0 ? (
          <EmptyState
            message={
              activeFilter === "all"
                ? "No subscription videos available. Subscribe to channels to see their latest uploads here."
                : "This channel hasn't uploaded any videos recently."
            }
            actionText={
              activeFilter === "all"
                ? "Discover channels"
                : "View all subscriptions"
            }
            onAction={() => activeFilter !== "all" && setActiveFilter("all")}
          />
        ) : (
          <>
            <div className="space-y-6">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} inSubscription={true} />
              ))}
            </div>

            {filteredVideos.length >= 8 && (
              //Load More Button
              <div className="flex justify-center py-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
                >
                  {isLoading ? "Loading..." : "Load more videos"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionContent;
