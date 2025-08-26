import { useEffect, useCallback } from 'react';

/**
 * Custom hook for managing keyboard shortcuts
 * Separates keyboard logic from UI components
 */
export const useKeyboardShortcuts = ({ onF11, onSpace, onLeftArrow, onRightArrow }) => {
  const handleKeyPress = useCallback((event) => {
    // Prevent default behavior for these keys
    const preventDefaultKeys = ['F11', ' ', 'ArrowLeft', 'ArrowRight'];
    
    if (preventDefaultKeys.includes(event.key)) {
      event.preventDefault();
    }

    // Handle specific key presses
    switch (event.key) {
      case 'F11':
        if (onF11 && typeof onF11 === 'function') {
          onF11();
        }
        break;
      case ' ':
        if (onSpace && typeof onSpace === 'function') {
          onSpace();
        }
        break;
      case 'ArrowLeft':
        if (onLeftArrow && typeof onLeftArrow === 'function') {
          onLeftArrow();
        }
        break;
      case 'ArrowRight':
        if (onRightArrow && typeof onRightArrow === 'function') {
          onRightArrow();
        }
        break;
      default:
        break;
    }
  }, [onF11, onSpace, onLeftArrow, onRightArrow]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return {
    // Return any additional keyboard-related utilities if needed
  };
};
