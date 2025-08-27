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
  const { validateYouTubeUrl, validateFile, shouldThrottle } = useSecurity();

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
      <form onSubmit={handleSearch} className="flex items-center bg-[#1e1e1e] w-full max-w-[800px] border border-white">
        {/* Search icon on left - Visual element only, no click functionality */}
        <div className="p-2 bg-[#1e1e1e] border-r border-white">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
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
