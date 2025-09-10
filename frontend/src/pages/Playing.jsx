const VideoTubeApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const sampleVideo = {
    title: "Amazing Purple Sunset Timelapse in 4K",
    views: "1.2M",
    timestamp: "2 days ago",
    likes: "45K",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
    channelAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
    channel: "Nature Visuals"
  };
  
  const sampleVideos = Array(12).fill().map((_, i) => ({
    ...sampleVideo,
    title: `Sample Video ${i + 1} - ${sampleVideo.title}`,
    id: i
  }));
  
  const sampleComments = [
    {
      id: 1,
      author: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      text: "This is absolutely beautiful! The colors are stunning.",
      timestamp: "2 hours ago",
      likes: 12
    },
    {
      id: 2,
      author: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=40&h=40&fit=crop&crop=face",
      text: "Perfect for relaxation. Thanks for sharing!",
      timestamp: "5 hours ago",
      likes: 8
    }
  ];
  
  const sampleChannel = {
    name: "Nature Visuals",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=48&h=48&fit=crop&crop=face",
    subscribers: "2.5M",
    description: "Bringing you the most beautiful nature content in stunning 4K quality."
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:ml-0">
          {/* Video Player Section */}
          <div className="p-6 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <VideoPlayer 
                  poster={sampleVideo.thumbnail}
                  src="/api/placeholder/800/450"
                />
                
                <VideoActions video={sampleVideo} />
                <ChannelInfo channel={sampleChannel} />
                <CommentsSection comments={sampleComments} />
              </div>
              
              <div className="lg:col-span-1">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Up Next</h3>
                  <button 
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="text-purple-600 hover:text-purple-700 text-sm"
                  >
                    {viewMode === 'grid' ? 'List View' : 'Grid View'}
                  </button>
                </div>
                
                <div className="space-y-3">
                  {sampleVideos.slice(0, 6).map((video) => (
                    <VideoCard key={video.id} video={video} layout="list" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Suggested Videos Grid */}
          <div className="p-6 pt-0 max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">More Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sampleVideos.map((video) => (
                <VideoCard key={video.id} video={video} layout="grid" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VideoTubeApp;