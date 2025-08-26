/**
 * Video Service - Handles all video-related business logic
 * Separated from UI components for better maintainability and security
 */

class VideoService {
  /**
   * Extract video ID from various YouTube URL formats
   * @param {string} url - YouTube URL
   * @returns {string|null} - Video ID or null if invalid
   */
  static extractVideoId(url) {
    if (!url || typeof url !== 'string') return null;
    
    // Additional security: check for suspicious patterns
    if (url.includes('<script') || url.includes('javascript:') || url.includes('data:')) {
      return null;
    }
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*&v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[1].length === 11) {
        // Validate video ID format (alphanumeric only)
        if (/^[a-zA-Z0-9_-]{11}$/.test(match[1])) {
          return match[1];
        }
      }
    }
    
    return null;
  }

  /**
   * Validate if URL is a valid YouTube URL
   * @param {string} url - URL to validate
   * @returns {boolean} - True if valid YouTube URL
   */
  static isValidYouTubeUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    // Check URL length to prevent extremely long URLs
    if (url.length > 2048) return false;
    
    const validDomains = [
      'youtube.com',
      'youtu.be',
      'www.youtube.com',
      'm.youtube.com'
    ];
    
    try {
      const urlObj = new URL(url);
      
      // Check for dangerous protocols
      if (['javascript:', 'data:', 'vbscript:'].some(protocol => 
        urlObj.protocol.toLowerCase().startsWith(protocol))) {
        return false;
      }
      
      // Validate hostname
      const hostname = urlObj.hostname.toLowerCase();
      return validDomains.some(domain => hostname.includes(domain));
    } catch {
      return false;
    }
  }

  /**
   * Generate secure embed URL with safety parameters
   * @param {string} videoId - YouTube video ID
   * @returns {string} - Secure embed URL
   */
  static generateEmbedUrl(videoId) {
    if (!videoId || typeof videoId !== 'string') {
      throw new Error('Invalid video ID provided');
    }

    // Additional validation for video ID
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      throw new Error('Invalid video ID format');
    }

    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      modestbranding: '1',
      controls: '1',
      showinfo: '0',
      iv_load_policy: '3',
      fs: '0',
      disablekb: '1',
      playsinline: '1',
      origin: window.location.origin,
      // Additional security parameters
      enablejsapi: '0',
      widget_referrer: window.location.origin
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  /**
   * Sanitize video URL to prevent XSS and injection attacks
   * @param {string} url - Raw video URL
   * @returns {string} - Sanitized URL
   */
  static sanitizeVideoUrl(url) {
    if (!url || typeof url !== 'string') return '';
    
    // Remove any script tags or dangerous protocols
    let sanitized = url
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
    
    // Additional sanitization
    sanitized = sanitized.replace(/[<>"']/g, ''); // Remove HTML characters
    
    return sanitized;
  }

  /**
   * Validate file upload for security
   * @param {File} file - File to validate
   * @returns {boolean} - True if file is safe
   */
  static validateFileUpload(file) {
    if (!file) return false;
    
    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) return false;
    
    // Check file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) return false;
    
    // Check file extension
    const allowedExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const fileName = file.name.toLowerCase();
    if (!allowedExtensions.some(ext => fileName.endsWith(ext))) return false;
    
    return true;
  }
}

export default VideoService;
