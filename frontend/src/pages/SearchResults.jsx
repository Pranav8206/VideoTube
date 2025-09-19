import React, { useState } from 'react';

// Sample data to simulate API responses for search results
const searchData = {
    videos: [
        {
            id: 'v1',
            title: 'How to build a SaaS in 30 days (and why you shouldn\'t)',
            channelName: 'Dev Channel',
            views: '2.5M views',
            uploadDate: '2 years ago',
            thumbnailUrl: 'https://placehold.co/400x225/505050/ffffff?text=Video+Thumbnail+1',
            channelAvatarUrl: 'https://placehold.co/40x40/7C3AED/ffffff?text=C',
            description: 'A comprehensive guide on the pitfalls and successes of rapid software development.',
        },
        {
            id: 'v2',
            title: 'The future of generative AI in design and art',
            channelName: 'Art Tech',
            views: '1.1M views',
            uploadDate: '3 months ago',
            thumbnailUrl: 'https://placehold.co/400x225/505050/ffffff?text=Video+Thumbnail+2',
            channelAvatarUrl: 'https://placehold.co/40x40/7C3AED/ffffff?text=C',
            description: 'A discussion on how AI is changing the creative industry, for better or worse.',
        },
        {
            id: 'v3',
            title: 'Exploring the most beautiful places in New Zealand',
            channelName: 'Travel Adventures',
            views: '7.8M views',
            uploadDate: '1 year ago',
            thumbnailUrl: 'https://placehold.co/400x225/505050/ffffff?text=Video+Thumbnail+3',
            channelAvatarUrl: 'https://placehold.co/40x40/7C3AED/ffffff?text=C',
            description: 'A visual journey through the stunning landscapes of New Zealand.',
        },
    ],
    channels: [
        {
            id: 'c1',
            name: 'Dev Channel',
            avatarUrl: 'https://placehold.co/96x96/7C3AED/ffffff?text=D',
            subscriberCount: '1.2M subscribers',
            description: 'Weekly tutorials and deep dives into the world of software development and startups.',
        },
        {
            id: 'c2',
            name: 'Art Tech',
            avatarUrl: 'https://placehold.co/96x96/9333EA/ffffff?text=A',
            subscriberCount: '500K subscribers',
            description: 'Exploring the intersection of technology and creativity.',
        },
    ],
    playlists: [
        {
            id: 'p1',
            title: 'React.js Crash Course',
            videoCount: '10 videos',
            thumbnailUrls: [
                'https://placehold.co/100x75/505050/ffffff?text=P1',
                'https://placehold.co/100x75/505050/ffffff?text=P2',
                'https://placehold.co/100x75/505050/ffffff?text=P3'
            ],
            creatorName: 'Dev Channel',
        }
    ]
};

// Reusable components
const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = (e) => {
        setQuery(e.target.value);
        // Simulate search suggestions
        if (e.target.value.length > 2) {
            setSuggestions(['generative AI', 'React tutorial', 'travel blog']);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div className="flex-1 max-w-2xl mx-auto mb-8">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="Search for videos, channels, and more..."
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50"
                />
                <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M20.25 18.25L15.5 13.5C16.5 12.25 17 10.75 17 9.25C17 5.0 13.5 1.5 9.25 1.5C5.0 1.5 1.5 5.0 1.5 9.25C1.5 13.5 5.0 17 9.25 17C10.75 17 12.25 16.5 13.5 15.5L18.25 20.25C18.5 20.5 18.75 20.5 19 20.5C19.25 20.5 19.5 20.5 19.75 20.25C20.25 19.75 20.25 19.0 19.75 18.5L19.25 18.25Z"></path>
                </svg>
                {isFocused && suggestions.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        {suggestions.map((s, i) => (
                            <div key={i} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg">
                                <span className="text-gray-700 dark:text-gray-300">{s}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const VideoCard = ({ video }) => (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-start p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer">
        <div className="relative flex-shrink-0 w-full sm:w-60 h-36 rounded-xl overflow-hidden">
            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">{video.duration}</div>
        </div>
        <div className="flex-grow">
            <h3 className="font-semibold text-lg dark:text-gray-50 line-clamp-2">{video.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{video.channelName} • {video.views} • {video.uploadDate}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 hidden md:block">{video.description}</p>
        </div>
    </div>
);

const ChannelCard = ({ channel }) => (
    <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6 p-6 sm:p-8 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex-shrink-0 relative">
            <img src={channel.avatarUrl} alt={channel.name} className="w-24 h-24 rounded-full" />
            <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white dark:border-gray-800 bg-purple-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                </svg>
            </div>
        </div>
        <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
            <h3 className="font-bold text-xl dark:text-gray-50">{channel.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{channel.subscriberCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{channel.description}</p>
            <button className="mt-4 px-6 py-2 rounded-full font-semibold text-white purple-gradient hover:opacity-90 transition-opacity">
                Subscribe
            </button>
        </div>
    </div>
);

const PlaylistCard = ({ playlist }) => (
    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-start p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer">
        <div className="relative flex-shrink-0 w-full sm:w-60 h-36 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            <img src={playlist.thumbnailUrls[0]} alt={playlist.title} className="absolute inset-0 w-full h-full object-cover rounded-xl" />
            <div className="absolute top-0 right-0 h-full w-1/3 bg-gray-500 dark:bg-gray-600 bg-opacity-70 rounded-tr-xl rounded-br-xl flex flex-col justify-center items-center">
                <svg className="w-8 h-8 text-white mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"></path>
                </svg>
                <span className="text-sm text-white font-semibold">{playlist.videoCount}</span>
            </div>
        </div>
        <div className="flex-grow">
            <h3 className="font-semibold text-lg dark:text-gray-50 line-clamp-2">{playlist.title}</h3>
            <p className="text-sm text-gray-500 mt-1">Playlist • by {playlist.creatorName}</p>
        </div>
    </div>
);

const SearchResults = () => {
    const [theme, setTheme] = useState('light'); // You can lift this state up or use a context

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        document.body.classList.toggle('dark-theme');
    };

    return (
        <div className={`p-8 min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
            {/* Header with Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100 hidden md:block">Search Results</h1>
                <SearchBar />
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full text-purple-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 7.5a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H7.5zm.002 9a.75.75 0 00-.75.75v2.25a.75.75 0 001.5 0v-2.25a.75.75 0 00-.75-.75zM12 18a6 6 0 100-12 6 6 0 000 12zM9 12a3 3 0 116 0 3 3 0 01-6 0zM16.5 7.5a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H16.5zm-4.5 9a.75.75 0 00-.75.75v2.25a.75.75 0 001.5 0v-2.25a.75.75 0 00-.75-.75zM16.5 16.5a.75.75 0 00-.75.75v2.25a.75.75 0 001.5 0v-2.25a.75.75 0 00-.75-.75zM12 22.25a.75.75 0 00-.75.75v.008a.75.75 0 001.5 0v-.008a.75.75 0 00-.75-.75z"></path>
                    </svg>
                </button>
            </div>

            {/* Filters and Sort By */}
            <div className="flex flex-wrap items-center justify-between mb-8">
                <div className="flex flex-wrap gap-2 md:gap-4">
                    <button className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        Upload date
                    </button>
                    <button className="px-4 py-2 text-sm font-semibold rounded-full purple-gradient text-white">
                        Type: Video
                    </button>
                    <button className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        Duration
                    </button>
                </div>
                <div className="relative mt-4 md:mt-0">
                    <select className="appearance-none px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-gray-300 pr-10 focus:outline-none focus:ring-1 focus:ring-purple-500">
                        <option>Sort by: Relevance</option>
                        <option>Upload date</option>
                        <option>View count</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Search Results */}
            <div className="grid gap-8">
                {searchData.channels.map((channel, index) => (
                    <ChannelCard key={channel.id} channel={channel} />
                ))}
                {searchData.playlists.map((playlist, index) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
                {searchData.videos.map((video, index) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
