import React, { useState } from 'react';
import VideoService from '../services/videoService';
import { useSecurity } from '../hooks/useSecurity';

/**
 * SearchBar Component - Pure UI component for video URL input
 * All validation logic is handled by VideoService and security hooks
 */
const SearchBar = ({ onFileSelect, onSearch }) => {
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const { validateYouTubeUrl, validateFile, shouldThrottle } = useSecurity();

  const handleFilePickerClick = () => {
    // Show the "coming soon" pill when file picker is clicked
    setShowComingSoon(true);
    
    // Hide the pill after 3 seconds
    setTimeout(() => {
      setShowComingSoon(false);
    }, 3000);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    
    // Check rate limiting
    if (shouldThrottle()) {
      setError('Too many requests. Please wait a moment before trying again.');
      return;
    }
    
    if (!searchValue.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    // Use enhanced security validation
    const validation = validateYouTubeUrl(searchValue);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    // Additional validation using VideoService
    if (!VideoService.isValidYouTubeUrl(validation.sanitized)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setError('');
    if (onSearch) {
      onSearch(validation.sanitized);
    }
  };

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="relative">
      {/* Coming Soon Popup Pill - Positioned absolutely above the search bar */}
      <div 
        className={`absolute -top-16 left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out ${
          showComingSoon 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-[#1e1e1e] border border-white text-white text-xs px-3 py-2 rounded-full shadow-lg whitespace-nowrap">
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Feature coming soon
          </span>
        </div>
        {/* Arrow pointing down */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1e1e1e]"></div>
      </div>

      <form onSubmit={handleSearch} className="flex items-center bg-[#1e1e1e] w-full max-w-[800px] border border-white">
        {/* Paper clip icon on left - Now just a visual element that shows the pill */}
        <div className="p-2 bg-[#1e1e1e] border-r border-white cursor-pointer hover:bg-gray-800 transition-colors">
          <div className="cursor-pointer" onClick={handleFilePickerClick}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </div>
        </div>
        
        {/* Search input */}
        <input 
          name="search"
          type="text" 
          placeholder="www.youtube.com/watch?v=..." 
          value={searchValue}
          onChange={handleInputChange}
          className="flex-1 text-sm px-4 py-2 outline-none border-none bg-[#1e1e1e] text-white placeholder-zinc-300"
        />
        
        {/* Button on right */}
        <button 
          type="submit"
          className="px-6 py-2 bg-[#1e1e1e] text-white font-medium hover:bg-gray-800 transition-colors border-l border-white"
        >
          Search
        </button>
      </form>
      
      {/* Error message */}
      {error && (
        <div className="text-red-400 text-sm mt-2 text-center">
          {error}
        </div>
      )}
      
      {/* Feature request text */}
      <button 
        className="text-zinc-500 text-xs mt-3 text-center hover:text-zinc-300 transition-colors duration-200 cursor-pointer"
        onClick={() => {
          // Open the Google Form in a new tab
          window.open('https://docs.google.com/forms/d/e/1FAIpQLSf7AdOnGQmDieKkVvERcqh2vRLqC0mge8IpDG__SXxPhin4ZA/viewform?usp=header', '_blank');
          
          // Log in development mode
          if (import.meta.env.DEV) {
            console.log('Feature request form opened');
          }
        }}
      >
        want a feature then feel free to us know
      </button>
    </div>
  );
};

export default SearchBar;
