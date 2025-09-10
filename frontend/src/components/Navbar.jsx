import React, { useState, useRef, useEffect } from 'react';

const Navbar = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <Play size={16} className="text-white fill-current" />
            </div>
            <span className="font-bold text-xl text-purple-700 dark:text-purple-400">VideoTube</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Upload size={16} />
            Create
          </Button>
          <button className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar