import React, { useState } from 'react';
import { 
  SunIcon, 
  MoonIcon, 
  XMarkIcon, 
  ArrowsPointingOutIcon, 
  ArrowsPointingInIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import VideoService from '../services/videoService';
import { useFullscreen } from '../hooks/useFullscreen';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { calculateBackgroundOpacity, getNextAmbienceLevel } from '../utils/ambienceUtils';
import { VIDEO_CONFIG, UI_CONFIG } from '../constants/appConstants';

/**
 * VideoPlayer Component - Pure UI component for video display
 * All business logic is handled by services and hooks
 */
const VideoPlayer = ({ videoUrl, onCancel }) => {
  const [darknessLevel, setDarknessLevel] = useState(0);
  const [ambientColor, setAmbientColor] = useState('#78716c'); // Default stone-800 color
  
  // Custom hooks for functionality
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    onF11: toggleFullscreen
  });

  // Extract video ID using service
  const videoId = VideoService.extractVideoId(videoUrl);

  // Handle ambience toggle
  const handleAmbienceToggle = () => {
    setDarknessLevel(getNextAmbienceLevel(darknessLevel));
  };

  // Handle color change
  const handleColorChange = (event) => {
    setAmbientColor(event.target.value);
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
  };

  // Invalid URL handling
  if (!videoId) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>Invalid YouTube URL</p>
          <button 
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Generate secure embed URL
  const embedUrl = VideoService.generateEmbedUrl(videoId);
  const backgroundOpacity = calculateBackgroundOpacity(darknessLevel);

  return (
    <div 
      className="fixed inset-0 bg-black ambience-transition" 
      style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})` }}
    >
              {/* Video Player */}
        <div className="w-full h-full flex flex-col items-center justify-center px-4 pt-6">
          {/* Video Frame */}
          <div className={`w-[95%] max-h-[85vh] aspect-video relative youtube-iframe-blocker`}>
            <div 
              className="absolute inset-0 rounded-lg blur-2xl scale-105" 
              style={{ backgroundColor: ambientColor }}
            ></div>
            <iframe
              src={embedUrl}
              title="YouTube video player"
              className="w-full h-full rounded-lg relative z-10 shadow-2xl"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

        {/* Controls Bar */}
        <div className="p-4 flex justify-center">
          <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-4">
            {/* Ambience Toggle */}
            <button
              onClick={handleAmbienceToggle}
              className="text-white transition-colors duration-200 p-1.5 rounded-full border border-transparent hover:border-white"
              title="Toggle Ambience"
            >
              {darknessLevel === 0 ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            {/* Color Picker */}
            <div className="relative">
              <input
                type="color"
                value={ambientColor}
                onChange={handleColorChange}
                className="w-6 h-6 rounded-full border-2 border-white cursor-pointer opacity-0 absolute inset-0"
                title="Pick Ambient Color"
              />
              <button
                className="text-white transition-colors duration-200 p-1.5 rounded-full border border-transparent hover:border-white pointer-events-none"
                title="Pick Ambient Color"
              >
                <SwatchIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="text-white transition-colors duration-200 p-1.5 rounded-full border border-transparent hover:border-white"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <ArrowsPointingInIcon className="w-5 h-5" />
              ) : (
                <ArrowsPointingOutIcon className="w-5 h-5" />
              )}
            </button>

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              className="text-white transition-colors duration-200 p-1.5 rounded-full border border-transparent hover:border-white"
              title="Exit Player"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
