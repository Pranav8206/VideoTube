import React from 'react'

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Compass, label: 'Explore' },
    { icon: Clock, label: 'History' },
    { icon: Heart, label: 'Liked Videos' },
  ];
  
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
        w-64 transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <span className="font-bold text-xl text-purple-700">VideoTube</span>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">SUBSCRIPTIONS</h3>
            <div className="space-y-2">
              {['TechChannel', 'MusicHub', 'GameZone'].map((channel) => (
                <button key={channel} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">{channel[0]}</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{channel}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar
