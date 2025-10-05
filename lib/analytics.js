/**
 * Analytics utilities for Google Tag Manager (GTM) event tracking
 * Handles custom event firing for conversion tracking and user behavior analysis
 */

/**
 * Pushes an event to the GTM dataLayer
 * @param {string} eventName - The name of the event to track
 * @param {Object} eventData - Additional data to send with the event
 */
export const trackEvent = (eventName, eventData = {}) => {
  // Check if GTM dataLayer exists
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData,
      timestamp: new Date().toISOString()
    });
    
    // Log event for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event Tracked:', {
        event: eventName,
        ...eventData,
        timestamp: new Date().toISOString()
      });
    }
  } else {
    // Warn if GTM is not available
    console.warn('GTM dataLayer not available. Event not tracked:', eventName, eventData);
  }
};

/**
 * Tracks successful waitlist signup events
 * @param {string} formLocation - Location of the form ('hero' or 'footer_cta')
 */
export const trackWaitlistSignup = (formLocation) => {
  trackEvent('waitlist_signup_success', {
    form_location: formLocation
  });
};

/**
 * Tracks form interaction events (focus, blur, etc.)
 * @param {string} formLocation - Location of the form
 * @param {string} action - The interaction type (focus, blur, input)
 */
export const trackFormInteraction = (formLocation, action) => {
  trackEvent('form_interaction', {
    form_location: formLocation,
    interaction_type: action
  });
};

/**
 * Tracks page scroll depth for engagement analysis
 * @param {number} scrollPercentage - Percentage of page scrolled (25, 50, 75, 100)
 */
export const trackScrollDepth = (scrollPercentage) => {
  trackEvent('scroll_depth', {
    scroll_percentage: scrollPercentage
  });
};

/**
 * Tracks section visibility for content engagement
 * @param {string} sectionName - Name of the section that became visible
 */
export const trackSectionView = (sectionName) => {
  trackEvent('section_view', {
    section_name: sectionName
  });
};

/**
 * Tracks CTA button clicks for conversion funnel analysis
 * @param {string} ctaLocation - Location of the CTA button
 * @param {string} ctaText - Text content of the CTA button
 */
export const trackCTAClick = (ctaLocation, ctaText) => {
  trackEvent('cta_click', {
    cta_location: ctaLocation,
    cta_text: ctaText
  });
};

/**
 * Tracks error events for debugging and user experience monitoring
 * @param {string} errorType - Type of error (validation, network, etc.)
 * @param {string} errorMessage - Error message or description
 * @param {string} location - Where the error occurred
 */
export const trackError = (errorType, errorMessage, location) => {
  trackEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    error_location: location
  });
};

/**
 * Initialize analytics tracking with page view
 * Should be called when the page loads
 */
export const initializeAnalytics = () => {
  // Track initial page view
  trackEvent('page_view', {
    page_title: document.title,
    page_url: window.location.href
  });
  
  // Set up scroll depth tracking
  let scrollDepthTracked = {
    25: false,
    50: false,
    75: false,
    100: false
  };
  
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);
    
    // Track scroll depth milestones
    [25, 50, 75, 100].forEach(milestone => {
      if (scrollPercentage >= milestone && !scrollDepthTracked[milestone]) {
        scrollDepthTracked[milestone] = true;
        trackScrollDepth(milestone);
      }
    });
  };
  
  // Add scroll event listener with throttling
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(handleScroll, 100);
  });
};

/**
 * Utility to check if GTM is properly loaded
 * @returns {boolean} True if GTM dataLayer is available
 */
export const isAnalyticsReady = () => {
  return typeof window !== 'undefined' && window.dataLayer && Array.isArray(window.dataLayer);
};