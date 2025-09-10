import React from 'react'


const VideoCard = ({ video, layout = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  if (layout === 'list') {
    return (
      <div className="flex gap-4 p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors">
        <div className="relative flex-shrink-0">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-40 h-24 object-cover rounded-lg"
          />
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
            {video.title}
          </h3>
          <p className="text-purple-600 dark:text-purple-400 text-sm mb-1">{video.channel}</p>
          <p className="text-gray-500 text-sm">{video.views} • {video.timestamp}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {video.duration}
        </span>
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Button variant="primary" size="sm">
              <Play size={16} />
              Play
            </Button>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex gap-3">
          <img 
            src={video.channelAvatar} 
            alt={video.channel}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
              {video.title}
            </h3>
            <p className="text-purple-600 dark:text-purple-400 text-sm mb-1">{video.channel}</p>
            <p className="text-gray-500 text-sm">{video.views} • {video.timestamp}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default VideoCard