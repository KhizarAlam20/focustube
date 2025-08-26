/**
 * Application Constants
 * Centralized configuration for easy maintenance
 */

export const APP_CONFIG = {
  NAME: 'FocusTube',
  VERSION: '1.0.0',
  AUTHOR: '@khizaralamk',
  ENVIRONMENT: import.meta.env.MODE || 'development'
};

export const VIDEO_CONFIG = {
  MAX_WIDTH: 'max-w-7xl',
  DEFAULT_AUTOPLAY: true,
  DEFAULT_CONTROLS: true,
  DEFAULT_MODEST_BRANDING: true,
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
};

export const AMBIENCE_CONFIG = {
  DEFAULT_LEVEL: 0,
  MAX_LEVEL: 3,
  LEVEL_NAMES: ['Normal', 'Darker', 'Darkest', 'Blackout']
};

export const UI_CONFIG = {
  CONTROL_BAR_SPACING: 'space-x-8',
  ICON_SIZE: 'text-base',
  TEXT_SIZE: 'text-[10px]',
  TRANSITION_DURATION: 'transition-colors'
};

export const SECURITY_CONFIG = {
  ALLOWED_DOMAINS: [
    'youtube.com',
    'youtu.be',
    'www.youtube.com',
    'm.youtube.com'
  ],
  BLOCKED_PROTOCOLS: ['javascript:', 'data:', 'vbscript:', 'file:'],
  MAX_URL_LENGTH: 2048,
  MAX_INPUT_LENGTH: 1000,
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 10,
    WINDOW_MS: 60000
  },
  FILE_UPLOAD: {
    MAX_SIZE: 100 * 1024 * 1024, // 100MB
    ALLOWED_TYPES: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    ALLOWED_EXTENSIONS: ['.mp4', '.webm', '.ogg', '.mov', '.avi']
  },
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.youtube.com"],
    STYLE_SRC: ["'self'", "'unsafe-inline'"],
    IMG_SRC: ["'self'", "data:", "https:", "blob:"],
    MEDIA_SRC: ["'self'", "https://www.youtube.com"],
    FRAME_SRC: ["'self'", "https://www.youtube.com"],
    CONNECT_SRC: ["'self'"],
    FONT_SRC: ["'self'"],
    OBJECT_SRC: ["'none'"],
    BASE_URI: ["'self'"],
    FORM_ACTION: ["'self'"]
  }
};
