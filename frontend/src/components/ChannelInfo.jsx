import React, { useState, useRef, useEffect } from 'react';

const ChannelInfo = ({ channel }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <img 
          src={channel.avatar} 
          alt={channel.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{channel.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{channel.subscribers} subscribers</p>
          <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">{channel.description}</p>
        </div>
      </div>
      
      <Button 
        variant={isSubscribed ? "secondary" : "primary"}
        onClick={() => setIsSubscribed(!isSubscribed)}
      >
        {isSubscribed ? 'Subscribed' : 'Subscribe'}
      </Button>
    </div>
  );
};

export default ChannelInfo