/**
 * Ambience Utilities - Handles background darkness calculations
 * Separated from UI for better maintainability and reusability
 */

export const AMBIENCE_LEVELS = {
  NORMAL: 0,
  DARKER: 1,
  DARKEST: 2,
  BLACKOUT: 3
};

export const AMBIENCE_OPACITIES = {
  [AMBIENCE_LEVELS.NORMAL]: 0.8,
  [AMBIENCE_LEVELS.DARKER]: 0.9,
  [AMBIENCE_LEVELS.DARKEST]: 0.95,
  [AMBIENCE_LEVELS.BLACKOUT]: 0.98
};

/**
 * Calculate background opacity based on darkness level
 * @param {number} level - Darkness level (0-3)
 * @returns {number} - Background opacity value
 */
export const calculateBackgroundOpacity = (level) => {
  if (typeof level !== 'number' || level < 0 || level > 3) {
    return AMBIENCE_OPACITIES[AMBIENCE_LEVELS.NORMAL];
  }
  
  return AMBIENCE_OPACITIES[level] || AMBIENCE_OPACITIES[AMBIENCE_LEVELS.NORMAL];
};

/**
 * Get next ambience level in cycle
 * @param {number} currentLevel - Current darkness level
 * @returns {number} - Next darkness level
 */
export const getNextAmbienceLevel = (currentLevel) => {
  if (typeof currentLevel !== 'number') return AMBIENCE_LEVELS.NORMAL;
  return (currentLevel + 1) % Object.keys(AMBIENCE_LEVELS).length;
};

/**
 * Get ambience level description
 * @param {number} level - Darkness level
 * @returns {string} - Human-readable description
 */
export const getAmbienceDescription = (level) => {
  const descriptions = {
    [AMBIENCE_LEVELS.NORMAL]: 'Normal',
    [AMBIENCE_LEVELS.DARKER]: 'Darker',
    [AMBIENCE_LEVELS.DARKEST]: 'Darkest',
    [AMBIENCE_LEVELS.BLACKOUT]: 'Blackout'
  };
  
  return descriptions[level] || descriptions[AMBIENCE_LEVELS.NORMAL];
};
