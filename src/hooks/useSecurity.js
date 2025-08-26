import { useCallback, useRef } from 'react';
import SecurityUtils from '../utils/securityUtils';
import { SECURITY_CONFIG } from '../constants/appConstants';

/**
 * Security Hook - Provides security validation and rate limiting
 * Should be used in components that handle user input or API calls
 */
export const useSecurity = () => {
  const lastRequestTime = useRef(0);
  const requestCount = useRef(0);
  const requestWindowStart = useRef(Date.now());

  /**
   * Check if request is rate limited
   * @param {string} identifier - Unique identifier for rate limiting
   * @returns {boolean} - True if rate limited
   */
  const isRateLimited = useCallback((identifier = 'default') => {
    return SecurityUtils.isRateLimited(identifier);
  }, []);

  /**
   * Validate and sanitize user input
   * @param {string} input - User input to validate
   * @param {string} type - Type of input (url, text, filename)
   * @returns {Object} - Validation result with sanitized input and errors
   */
  const validateInput = useCallback((input, type = 'text') => {
    const result = {
      isValid: false,
      sanitized: '',
      errors: []
    };

    if (!input || typeof input !== 'string') {
      result.errors.push('Input is required');
      return result;
    }

    // Check input length
    if (input.length > SECURITY_CONFIG.MAX_INPUT_LENGTH) {
      result.errors.push(`Input too long. Maximum ${SECURITY_CONFIG.MAX_INPUT_LENGTH} characters allowed.`);
    }

    // Check for dangerous content
    if (SecurityUtils.containsDangerousContent(input)) {
      result.errors.push('Input contains potentially dangerous content');
    }

    // Sanitize input
    result.sanitized = SecurityUtils.sanitizeInput(input, type);

    // Additional validation based on type
    switch (type) {
      case 'url':
        if (!result.sanitized.startsWith('http://') && !result.sanitized.startsWith('https://')) {
          result.errors.push('URL must start with http:// or https://');
        }
        break;
      
      case 'filename':
        if (result.sanitized.includes('..') || result.sanitized.includes('/') || result.sanitized.includes('\\')) {
          result.errors.push('Invalid filename detected');
        }
        break;
    }

    result.isValid = result.errors.length === 0;
    return result;
  }, []);

  /**
   * Validate file upload with security checks
   * @param {File} file - File to validate
   * @returns {Object} - Validation result
   */
  const validateFile = useCallback((file) => {
    return SecurityUtils.validateFile(
      file,
      SECURITY_CONFIG.FILE_UPLOAD.ALLOWED_TYPES,
      SECURITY_CONFIG.FILE_UPLOAD.MAX_SIZE
    );
  }, []);

  /**
   * Check if current request should be throttled
   * @returns {boolean} - True if request should be throttled
   */
  const shouldThrottle = useCallback(() => {
    const now = Date.now();
    const windowStart = now - SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS;

    // Reset window if needed
    if (now - requestWindowStart.current > SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS) {
      requestWindowStart.current = now;
      requestCount.current = 0;
    }

    // Check if we're within rate limit
    if (requestCount.current >= SECURITY_CONFIG.RATE_LIMIT.REQUESTS_PER_MINUTE) {
      return true;
    }

    // Increment request count
    requestCount.current++;
    lastRequestTime.current = now;
    return false;
  }, []);

  /**
   * Generate secure token for CSRF protection
   * @param {number} length - Token length
   * @returns {string} - Secure token
   */
  const generateToken = useCallback((length = 32) => {
    return SecurityUtils.generateSecureToken(length);
  }, []);

  /**
   * Validate YouTube URL with enhanced security
   * @param {string} url - URL to validate
   * @returns {Object} - Validation result
   */
  const validateYouTubeUrl = useCallback((url) => {
    const result = {
      isValid: false,
      sanitized: '',
      errors: []
    };

    // Basic input validation
    const inputValidation = validateInput(url, 'url');
    if (!inputValidation.isValid) {
      result.errors = inputValidation.errors;
      return result;
    }

    result.sanitized = inputValidation.sanitized;

    // Check URL length
    if (url.length > SECURITY_CONFIG.MAX_URL_LENGTH) {
      result.errors.push('URL too long');
    }

    // Check for blocked protocols
    const blockedProtocol = SECURITY_CONFIG.BLOCKED_PROTOCOLS.find(protocol => 
      url.toLowerCase().startsWith(protocol)
    );
    if (blockedProtocol) {
      result.errors.push(`Protocol ${blockedProtocol} is not allowed`);
    }

    // Check domain validation
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      const isValidDomain = SECURITY_CONFIG.ALLOWED_DOMAINS.some(domain => 
        hostname.includes(domain)
      );
      
      if (!isValidDomain) {
        result.errors.push('Domain not allowed');
      }
    } catch (error) {
      result.errors.push('Invalid URL format');
    }

    result.isValid = result.errors.length === 0;
    return result;
  }, [validateInput]);

  return {
    isRateLimited,
    validateInput,
    validateFile,
    shouldThrottle,
    generateToken,
    validateYouTubeUrl
  };
};
