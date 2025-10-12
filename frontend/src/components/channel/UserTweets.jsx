import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";

const UserTweets = () => {
  const { axios, user } = useContext(AppContext);
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [loading, setLoading] = useState(false);
  const [likeCounts, setLikeCounts] = useState({});
  const [likeLoading, setLikeLoading] = useState({});

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/tweets/user/${user.username}`);
      setTweets(data?.data || []);
    } catch (err) {
      console.error("Error fetching tweets:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikeCount = async (tweetId) => {
    try {
      const { data } = await axios.get(`/likes/tweet/${tweetId}`);
      setLikeCounts((prev) => ({
        ...prev,
        [tweetId]: data?.data?.like || 0,
      }));
    } catch (err) {
      console.error("Error fetching like count:", err);
    }
  };

  const toggleLike = async (tweetId) => {
    try {
      setLikeLoading((prev) => ({ ...prev, [tweetId]: true }));
      await axios.post(`/likes/tweet/${tweetId}`);
      await fetchLikeCount(tweetId);
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setLikeLoading((prev) => ({ ...prev, [tweetId]: false }));
    }
  };

  const createTweet = async () => {
    if (!newTweet.trim()) return;
    try {
      setLoading(true);
      const { data } = await axios.post(`/tweets`, { content: newTweet });
      setTweets((prev) => [data.data, ...prev]);
      setNewTweet("");
    } catch (err) {
      console.error("Error creating tweet:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTweet = async (tweetId) => {
    try {
      await axios.delete(`/tweets/${tweetId}`);
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
    } catch (err) {
      console.error("Error deleting tweet:", err);
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchTweets();
    }
  }, [user?.username]);

  useEffect(() => {
    tweets.forEach((t) => fetchLikeCount(t._id));
  }, [tweets]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Your Tweets</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTweet}
          onChange={(e) => setNewTweet(e.target.value)}
          placeholder="What's happening?"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={createTweet}
          disabled={loading || !newTweet.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Posting..." : "Tweet"}
        </button>
      </div>

      {loading && !tweets.length ? (
        <p>Loading tweets...</p>
      ) : tweets.length ? (
        tweets.map((tweet) => (
          <div
            key={tweet._id}
            className="border-b py-3 flex flex-col gap-2 hover:bg-gray-50 transition"
          >
            <p>{tweet.content}</p>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>@{tweet.owner?.username}</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(tweet._id)}
                  disabled={likeLoading[tweet._id]}
                  className="text-blue-600 hover:underline disabled:opacity-50"
                >
                  {likeLoading[tweet._id] ? "..." : "❤️"}{" "}
                  {likeCounts[tweet._id] ?? 0}
                </button>
                {tweet.owner?._id === user?._id && (
                  <button
                    onClick={() => deleteTweet(tweet._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No tweets yet.</p>
      )}
    </div>
  );
};

export default UserTweets;
