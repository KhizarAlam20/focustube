import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import VideoPlayer from './components/VideoPlayer';
import { APP_CONFIG } from './constants/appConstants';
import './App.css';

/**
 * Main App Component - Orchestrates the application flow
 * Keeps minimal state and delegates functionality to components
 */

// Production-safe logging utility
const logger = {
  info: (message, data) => {
    if (import.meta.env.DEV) {
      console.log(message, data);
    }
  },
  error: (message, error) => {
    if (import.meta.env.DEV) {
      console.error(message, error);
    }
    // In production, you might want to send to error tracking service
  }
};

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    logger.info('Selected video file:', file.name);
    // Handle the selected video file here
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    logger.info('Search query received');
    // Set the current video URL to trigger theater mode
    setCurrentVideoUrl(query);
  };

  const handleGameClick = () => {
    logger.info('Game button clicked!');
    // Handle game button click here
  };

  const handleVideoCancel = () => {
    setCurrentVideoUrl(null);
  };

  // If a video is playing, show the VideoPlayer in theater mode
  if (currentVideoUrl) {
    return (
      <VideoPlayer 
        videoUrl={currentVideoUrl}
        onCancel={handleVideoCancel}
      />
    );
  }

  // Otherwise show the main interface
  return (
    <div className="bg-[#1e1e1e] w-full h-screen flex items-center justify-center relative">
      {/* Game button on top right */}
      <button 
        onClick={handleGameClick}
        className="text-[10px] absolute top-4 right-4 text-zinc-500 transition-colors cursor-pointer"
        style={{ fontFamily: 'Figtree, sans-serif' }}
      >
        made with ❤️ by {APP_CONFIG.AUTHOR}
      </button>
      
      <div className="text-center">
        <Header />
        <SearchBar onFileSelect={handleFileSelect} onSearch={handleSearch} />
      </div>

      {/* Product Hunt Badge - Bottom Left */}
      <div className="absolute bottom-4 left-4">
        <a href="https://www.producthunt.com/products/focustube-3?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-focustube&#0045;3" target="_blank">
          <img 
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1027972&theme=light&t=1760865202080" 
            alt="focustube - Your&#0032;distraction&#0032;free&#0032;YouTube&#0032;zone&#0032;⚠️ | Product Hunt" 
            style={{width: '150px', height: '32px'}} 
            width="150" 
            height="32" 
          />
        </a>
      </div>
    </div>
  );
}

export default App;
