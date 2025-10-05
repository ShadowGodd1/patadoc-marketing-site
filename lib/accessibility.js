/**
 * Accessibility utilities for color contrast and WCAG compliance
 */

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code (e.g., '#006A80')
 * @returns {object} RGB values
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance of a color
 * @param {object} rgb - RGB color values
 * @returns {number} Relative luminance
 */
function getLuminance(rgb) {
  const { r, g, b } = rgb;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number} Contrast ratio
 */
export function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG AA standards
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @param {string} level - 'AA' or 'AAA'
 * @param {string} size - 'normal' or 'large'
 * @returns {object} Compliance result
 */
export function checkWCAGCompliance(foreground, background, level = 'AA', size = 'normal') {
  const ratio = getContrastRatio(foreground, background);
  
  const requirements = {
    'AA': {
      'normal': 4.5,
      'large': 3
    },
    'AAA': {
      'normal': 7,
      'large': 4.5
    }
  };
  
  const required = requirements[level][size];
  const passes = ratio >= required;
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    required,
    passes,
    level,
    size
  };
}

/**
 * PataDoc brand colors for contrast checking
 */
export const BRAND_COLORS = {
  'patadoc-teal': '#006A80',
  'patadoc-orange': '#F57E2F',
  'off-white': '#F4F1ED',
  'charcoal': '#2C3E50',
  'success-green': '#3FBF7F',
  'white': '#FFFFFF',
  'black': '#000000'
};

/**
 * Check all brand color combinations for WCAG compliance
 * @returns {object} Compliance report
 */
export function auditBrandColors() {
  const combinations = [
    // Text on backgrounds
    { fg: 'patadoc-teal', bg: 'white', context: 'Teal text on white background' },
    { fg: 'patadoc-teal', bg: 'off-white', context: 'Teal text on off-white background' },
    { fg: 'white', bg: 'patadoc-teal', context: 'White text on teal background' },
    { fg: 'charcoal', bg: 'white', context: 'Charcoal text on white background' },
    { fg: 'charcoal', bg: 'off-white', context: 'Charcoal text on off-white background' },
    { fg: 'white', bg: 'charcoal', context: 'White text on charcoal background' },
    { fg: 'success-green', bg: 'white', context: 'Success green text on white background' },
    { fg: 'patadoc-orange', bg: 'white', context: 'Orange text on white background' },
  ];
  
  const results = combinations.map(({ fg, bg, context }) => {
    const compliance = checkWCAGCompliance(BRAND_COLORS[fg], BRAND_COLORS[bg]);
    return {
      context,
      foreground: fg,
      background: bg,
      ...compliance
    };
  });
  
  return results;
}

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Set focus to element with fallback
   * @param {string|HTMLElement} target - Element or selector
   * @param {object} options - Focus options
   */
  setFocus(target, options = {}) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element && typeof element.focus === 'function') {
      element.focus(options);
      return true;
    }
    return false;
  },

  /**
   * Create focus trap for modal/dialog
   * @param {HTMLElement} container - Container element
   * @returns {function} Cleanup function
   */
  createFocusTrap(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    function handleTabKey(e) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
    
    container.addEventListener('keydown', handleTabKey);
    
    // Set initial focus
    if (firstElement) {
      firstElement.focus();
    }
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  /**
   * Check if element is focusable
   * @param {HTMLElement} element - Element to check
   * @returns {boolean} Is focusable
   */
  isFocusable(element) {
    if (!element || element.disabled || element.hidden) return false;
    
    const focusableSelectors = [
      'button',
      'input',
      'select',
      'textarea',
      'a[href]',
      '[tabindex]'
    ];
    
    return focusableSelectors.some(selector => element.matches(selector)) &&
           element.tabIndex !== -1;
  }
};

/**
 * Screen reader utilities
 */
export const screenReaderUtils = {
  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  announce(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  },

  /**
   * Create visually hidden text for screen readers
   * @param {string} text - Text content
   * @returns {HTMLElement} Hidden element
   */
  createScreenReaderText(text) {
    const element = document.createElement('span');
    element.className = 'sr-only';
    element.textContent = text;
    return element;
  }
};

/**
 * Keyboard navigation utilities
 */
export const keyboardUtils = {
  /**
   * Handle arrow key navigation in a list
   * @param {Event} event - Keyboard event
   * @param {NodeList} items - List items
   * @param {number} currentIndex - Current focused index
   * @returns {number} New focused index
   */
  handleArrowNavigation(event, items, currentIndex) {
    let newIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = items.length - 1;
        break;
      default:
        return currentIndex;
    }
    
    event.preventDefault();
    items[newIndex].focus();
    return newIndex;
  },

  /**
   * Add keyboard support to clickable elements
   * @param {HTMLElement} element - Element to enhance
   * @param {function} clickHandler - Click handler function
   */
  addKeyboardSupport(element, clickHandler) {
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        clickHandler(event);
      }
    });
  }
};