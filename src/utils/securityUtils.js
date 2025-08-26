/**
 * Security Utilities - Centralized security functions
 * Provides rate limiting, input validation, and security checks
 */

class SecurityUtils {
  constructor() {
    this.requestCounts = new Map();
    this.blockedIPs = new Set();
    this.rateLimitWindow = 60000; // 1 minute
    this.maxRequestsPerWindow = 10;
  }

  /**
   * Rate limiting for API endpoints
   * @param {string} identifier - IP or user identifier
   * @returns {boolean} - True if request is allowed
   */
  isRateLimited(identifier) {
    const now = Date.now();
    const windowStart = now - this.rateLimitWindow;
    
    if (!this.requestCounts.has(identifier)) {
      this.requestCounts.set(identifier, []);
    }
    
    const requests = this.requestCounts.get(identifier);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    this.requestCounts.set(identifier, validRequests);
    
    // Check if rate limit exceeded
    if (validRequests.length >= this.maxRequestsPerWindow) {
      return true;
    }
    
    // Add current request
    validRequests.push(now);
    return false;
  }

  /**
   * Validate and sanitize user input
   * @param {string} input - User input to validate
   * @param {string} type - Type of input (url, text, filename)
   * @returns {string} - Sanitized input
   */
  sanitizeInput(input, type = 'text') {
    if (!input || typeof input !== 'string') return '';
    
    let sanitized = input.trim();
    
    switch (type) {
      case 'url':
        // Remove dangerous protocols and HTML
        sanitized = sanitized
          .replace(/javascript:/gi, '')
          .replace(/data:/gi, '')
          .replace(/vbscript:/gi, '')
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/on\w+\s*=/gi, '');
        break;
        
      case 'filename':
        // Remove path traversal and dangerous characters
        sanitized = sanitized
          .replace(/\.\./g, '')
          .replace(/[<>:"|?*]/g, '')
          .replace(/\/|\\/g, '');
        break;
        
      case 'text':
      default:
        // Remove HTML tags and dangerous content
        sanitized = sanitized
          .replace(/<[^>]*>/g, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '');
        break;
    }
    
    return sanitized;
  }

  /**
   * Check if string contains potentially dangerous content
   * @param {string} input - Input to check
   * @returns {boolean} - True if dangerous content detected
   */
  containsDangerousContent(input) {
    if (!input || typeof input !== 'string') return false;
    
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /data:/gi,
      /vbscript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
    ];
    
    return dangerousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Generate secure random token
   * @param {number} length - Length of token
   * @returns {string} - Secure random token
   */
  generateSecureToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      // Use crypto API if available
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
      }
    } else {
      // Fallback for older browsers
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    
    return result;
  }

  /**
   * Validate file type and content
   * @param {File} file - File to validate
   * @param {Array} allowedTypes - Allowed MIME types
   * @param {number} maxSize - Maximum file size in bytes
   * @returns {Object} - Validation result
   */
  validateFile(file, allowedTypes = [], maxSize = 100 * 1024 * 1024) {
    const result = {
      isValid: false,
      errors: []
    };
    
    if (!file) {
      result.errors.push('No file provided');
      return result;
    }
    
    // Check file size
    if (file.size > maxSize) {
      result.errors.push(`File size exceeds maximum allowed size of ${Math.round(maxSize / (1024 * 1024))}MB`);
    }
    
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      result.errors.push(`File type ${file.type} is not allowed`);
    }
    
    // Check file name
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      result.errors.push('Invalid filename detected');
    }
    
    result.isValid = result.errors.length === 0;
    return result;
  }
}

// Export singleton instance
export default new SecurityUtils();
