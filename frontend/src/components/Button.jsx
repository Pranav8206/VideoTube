import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Heart, Share2, MessageCircle, MoreVertical, Search, Bell, User, Home, Compass, Clock, ThumbsUp, ThumbsDown, ChevronDown, Settings, Upload, Menu, X } from 'lucide-react';

// Base Button Component
const Button = ({ variant = 'primary', size = 'md', children, className = '', ...props }) => {
  const baseClasses = 'font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50';
  
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900 dark:hover:bg-purple-800 dark:text-purple-100',
    ghost: 'hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
