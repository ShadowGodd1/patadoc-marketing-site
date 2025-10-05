/**
 * Error handling utilities for better user experience
 */

/**
 * Checks if the user is currently online
 * @returns {boolean} True if online, false if offline
 */
export const isOnline = () => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

/**
 * Detects the type of network error
 * @param {Error} error - The error object
 * @param {Response} response - The fetch response (if available)
 * @returns {Object} Error classification with type and user-friendly message
 */
export const classifyNetworkError = (error, response = null) => {
  // Check if user is offline
  if (!isOnline()) {
    return {
      type: 'offline',
      message: 'You appear to be offline. Please check your internet connection.',
      retryable: true
    };
  }

  // Check for timeout errors
  if (error.name === 'AbortError' || error.message.includes('timeout')) {
    return {
      type: 'timeout',
      message: 'Request timed out. Please try again.',
      retryable: true
    };
  }

  // Check for network/fetch errors
  if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
    return {
      type: 'network',
      message: 'Network error. Please check your connection and try again.',
      retryable: true
    };
  }

  // Check response status codes
  if (response) {
    switch (response.status) {
      case 400:
        return {
          type: 'validation',
          message: 'Please check your input and try again.',
          retryable: false
        };
      case 409:
        return {
          type: 'conflict',
          message: 'This information has already been submitted.',
          retryable: false
        };
      case 429:
        return {
          type: 'rate_limit',
          message: 'Too many requests. Please wait a moment before trying again.',
          retryable: true
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: 'server',
          message: 'Server error. Please try again in a moment.',
          retryable: true
        };
      default:
        return {
          type: 'unknown',
          message: 'Something went wrong. Please try again.',
          retryable: true
        };
    }
  }

  // Default unknown error
  return {
    type: 'unknown',
    message: 'An unexpected error occurred. Please try again.',
    retryable: true
  };
};

/**
 * Creates a delay for retry attempts with exponential backoff
 * @param {number} attempt - The current attempt number (1-based)
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} maxDelay - Maximum delay in milliseconds
 * @returns {Promise} Promise that resolves after the delay
 */
export const createRetryDelay = (attempt, baseDelay = 1000, maxDelay = 5000) => {
  const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Determines if an error is retryable based on its type
 * @param {string} errorType - The error type
 * @returns {boolean} True if the error is retryable
 */
export const isRetryableError = (errorType) => {
  const retryableTypes = ['network', 'timeout', 'server', 'rate_limit', 'offline'];
  return retryableTypes.includes(errorType);
};

/**
 * Formats error messages for user display
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @returns {string} User-friendly error message
 */
export const formatErrorMessage = (error, context = '') => {
  const classification = classifyNetworkError(error);
  
  if (context) {
    return `${classification.message} (${context})`;
  }
  
  return classification.message;
};

/**
 * Logs errors for debugging while respecting user privacy
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @param {Object} additionalData - Additional data to log
 */
export const logError = (error, context = '', additionalData = {}) => {
  const errorInfo = {
    message: error.message,
    name: error.name,
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    online: isOnline(),
    ...additionalData
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo);
    console.error('Stack trace:', error.stack);
  }

  // In production, you might want to send this to an error tracking service
  // Example: Sentry, LogRocket, etc.
  
  return errorInfo;
};

/**
 * Creates a user-friendly error component props
 * @param {Error} error - The error object
 * @param {Function} onRetry - Retry function
 * @param {number} retryCount - Current retry count
 * @returns {Object} Props for error display component
 */
export const createErrorDisplayProps = (error, onRetry, retryCount = 0) => {
  const classification = classifyNetworkError(error);
  
  return {
    message: classification.message,
    type: classification.type,
    retryable: classification.retryable && retryCount < 3,
    onRetry: classification.retryable ? onRetry : null,
    retryCount,
    showTechnicalDetails: process.env.NODE_ENV === 'development'
  };
};