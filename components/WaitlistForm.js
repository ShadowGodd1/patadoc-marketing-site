'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { trackWaitlistSignup, trackFormInteraction, trackError } from '../lib/analytics';
import { useAccessibility } from './AccessibilityProvider';

// Error types for better error handling
const ERROR_TYPES = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  SERVER: 'server',
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown'
};

// User-friendly error messages
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Network error. Please check your connection and try again.',
  [ERROR_TYPES.VALIDATION]: 'Please enter a valid email address.',
  [ERROR_TYPES.SERVER]: 'Server error. Please try again in a moment.',
  [ERROR_TYPES.TIMEOUT]: 'Request timed out. Please try again.',
  [ERROR_TYPES.UNKNOWN]: 'Something went wrong. Please try again.',
  DUPLICATE_EMAIL: 'This email is already on our waitlist. Thank you for your interest!',
  RATE_LIMITED: 'Too many requests. Please wait a moment before trying again.',
  INVALID_EMAIL_FORMAT: 'Please enter a valid email address.',
  REQUIRED_FIELD: 'Email is required.'
};

export default function WaitlistForm({ location = 'unknown' }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState('');
  const [emailError, setEmailError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Accessibility hooks
  const { announce } = useAccessibility();
  const emailInputRef = useRef(null);
  const submitButtonRef = useRef(null);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Enhanced error classification
  const classifyError = useCallback((error, response = null) => {
    if (!navigator.onLine) {
      return { type: ERROR_TYPES.NETWORK, message: 'You appear to be offline. Please check your connection.' };
    }
    
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return { type: ERROR_TYPES.TIMEOUT, message: ERROR_MESSAGES[ERROR_TYPES.TIMEOUT] };
    }
    
    if (response) {
      switch (response.status) {
        case 400:
          return { type: ERROR_TYPES.VALIDATION, message: ERROR_MESSAGES.INVALID_EMAIL_FORMAT };
        case 409:
          return { type: ERROR_TYPES.VALIDATION, message: ERROR_MESSAGES.DUPLICATE_EMAIL };
        case 429:
          return { type: ERROR_TYPES.SERVER, message: ERROR_MESSAGES.RATE_LIMITED };
        case 500:
        case 502:
        case 503:
        case 504:
          return { type: ERROR_TYPES.SERVER, message: ERROR_MESSAGES[ERROR_TYPES.SERVER] };
        default:
          return { type: ERROR_TYPES.UNKNOWN, message: ERROR_MESSAGES[ERROR_TYPES.UNKNOWN] };
      }
    }
    
    if (error.message.includes('fetch')) {
      return { type: ERROR_TYPES.NETWORK, message: ERROR_MESSAGES[ERROR_TYPES.NETWORK] };
    }
    
    return { type: ERROR_TYPES.UNKNOWN, message: ERROR_MESSAGES[ERROR_TYPES.UNKNOWN] };
  }, []);

  // Handle email input change with real-time validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError(''); // Clear any previous errors
    setErrorType('');
    
    // Track form interaction
    trackFormInteraction(location, 'input');
    
    // Real-time validation feedback
    if (value && !validateEmail(value)) {
      setEmailError(ERROR_MESSAGES.INVALID_EMAIL_FORMAT);
    } else {
      setEmailError('');
    }
  };

  // Handle input focus for analytics
  const handleInputFocus = () => {
    trackFormInteraction(location, 'focus');
  };

  // Handle input blur for analytics
  const handleInputBlur = () => {
    trackFormInteraction(location, 'blur');
  };

  // API call with timeout and retry logic
  const makeApiCall = useCallback(async (emailValue, attempt = 1) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: emailValue.trim().toLowerCase(),
          source: location,
          attempt: attempt
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, [location]);

  // Retry mechanism with exponential backoff
  const retrySubmission = useCallback(async (emailValue, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await makeApiCall(emailValue, attempt);
        
        if (response.ok) {
          return { success: true, response };
        }
        
        // Don't retry for client errors (4xx) except 429 (rate limit)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          return { success: false, response, error: null };
        }
        
        // For server errors or rate limits, wait before retrying
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff, max 5s
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          return { success: false, response, error: null };
        }
      } catch (error) {
        if (attempt === maxRetries) {
          return { success: false, response: null, error };
        }
        
        // Wait before retrying on network errors
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }, [makeApiCall]);

  // Handle form submission with enhanced error handling
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!email) {
      setEmailError(ERROR_MESSAGES.REQUIRED_FIELD);
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError(ERROR_MESSAGES.INVALID_EMAIL_FORMAT);
      return;
    }

    setIsLoading(true);
    setError('');
    setErrorType('');
    setEmailError('');

    try {
      const result = await retrySubmission(email);
      
      if (result.success) {
        setIsSuccess(true);
        setRetryCount(0);
        trackWaitlistSignup(location);
        setEmail(''); // Clear the form
        
        // Announce success to screen readers
        announce('Successfully joined the waitlist! You will receive updates when the app launches.', 'assertive');
      } else {
        const errorData = result.response ? await result.response.json().catch(() => ({})) : {};
        const errorClassification = classifyError(result.error || new Error('API Error'), result.response);
        
        setError(errorData.error || errorClassification.message);
        setErrorType(errorClassification.type);
        
        // Announce error to screen readers
        announce(`Error joining waitlist: ${errorData.error || errorClassification.message}`, 'assertive');
        
        trackError(
          result.response ? 'api_error' : 'network_error', 
          errorData.error || errorClassification.message, 
          location
        );
      }
    } catch (err) {
      console.error('Submission error:', err);
      const errorClassification = classifyError(err);
      setError(errorClassification.message);
      setErrorType(errorClassification.type);
      trackError('submission_error', err.message, location);
    } finally {
      setIsLoading(false);
    }
  }, [email, retrySubmission, classifyError, location]);

  // Manual retry function for user-initiated retries
  const handleRetry = useCallback(async () => {
    if (retryCount >= 3) {
      setError('Maximum retry attempts reached. Please refresh the page and try again.');
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Track retry attempt
    trackError('manual_retry_attempt', `Retry ${retryCount + 1}`, location);
    
    // Wait a moment before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear errors and retry
    setError('');
    setErrorType('');
    setIsRetrying(false);
    
    // Trigger form submission
    if (email && validateEmail(email)) {
      const fakeEvent = { preventDefault: () => {} };
      await handleSubmit(fakeEvent);
    }
  }, [email, retryCount, location, handleSubmit]);

  // Success state
  if (isSuccess) {
    return (
      <div 
        className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg border border-success-green"
        role="status"
        aria-live="polite"
        aria-label="Successfully joined waitlist"
      >
        <div className="flex-shrink-0">
          <svg 
            className="w-6 h-6 text-success-green" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
            role="img"
            aria-label="Success checkmark"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        <p className="text-success-green font-semibold">
          Thank you! You&apos;re on the list.
        </p>
      </div>
    );
  }

  // Form state
  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-md"
      role="form"
      aria-label={`Join waitlist form - ${location}`}
      noValidate
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor={`email-${location}`} className="sr-only">
            Email address for PataDoc waitlist
          </label>
          <input
            ref={emailInputRef}
            id={`email-${location}`}
            type="email"
            value={email}
            onChange={handleEmailChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Enter your email"
            disabled={isLoading}
            autoComplete="email"
            className={`w-full px-4 py-3 rounded-lg border text-charcoal placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-patadoc-teal focus:border-transparent transition-colors ${
              emailError 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 bg-white hover:border-gray-400'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            required
            aria-describedby={emailError ? `email-error-${location}` : `email-help-${location}`}
            aria-invalid={emailError ? 'true' : 'false'}
          />
          {emailError && (
            <p 
              id={`email-error-${location}`}
              className="mt-1 text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              {emailError}
            </p>
          )}
          
          {/* Hidden help text for screen readers */}
          <p id={`email-help-${location}`} className="sr-only">
            Enter your email address to join the PataDoc waitlist and receive updates when the app launches.
          </p>
        </div>
        
        <button
          ref={submitButtonRef}
          type="submit"
          disabled={isLoading || emailError}
          className={`px-6 py-3 bg-patadoc-teal text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-patadoc-teal focus:ring-offset-2 ${
            isLoading || emailError
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-opacity-90 active:transform active:scale-95'
          }`}
          aria-describedby={isLoading ? `loading-${location}` : `submit-help-${location}`}
          aria-label={isLoading ? 'Joining waitlist, please wait' : 'Join PataDoc waitlist'}
        >
          {isLoading ? (
            <span className="flex items-center space-x-2">
              <svg 
                className="animate-spin w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24"
                aria-hidden="true"
                role="img"
                aria-label="Loading"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Joining...</span>
            </span>
          ) : (
            'Notify Me'
          )}
        </button>
        
        {/* Hidden help text for screen readers */}
        <p id={`submit-help-${location}`} className="sr-only">
          Click to join the PataDoc waitlist and receive notifications when the app launches.
        </p>
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg 
                className="w-5 h-5 text-red-400 mt-0.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
              
              {/* Show retry button for retryable errors */}
              {(errorType === ERROR_TYPES.NETWORK || errorType === ERROR_TYPES.TIMEOUT || errorType === ERROR_TYPES.SERVER) && retryCount < 3 && (
                <div className="mt-2">
                  <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="inline-flex items-center text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRetrying ? (
                      <>
                        <svg 
                          className="animate-spin w-3 h-3 mr-1" 
                          fill="none" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          />
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Retrying...
                      </>
                    ) : (
                      <>
                        <svg 
                          className="w-3 h-3 mr-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                          />
                        </svg>
                        Try Again
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {/* Show helpful tips for persistent errors */}
              {retryCount >= 3 && (
                <div className="mt-2 text-xs text-red-500">
                  <p className="font-medium mb-1">Still having trouble? Try:</p>
                  <ul className="space-y-0.5">
                    <li>• Refreshing your browser</li>
                    <li>• Checking your internet connection</li>
                    <li>• Trying again in a few minutes</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {isLoading && (
        <p 
          id={`loading-${location}`}
          className="sr-only"
          aria-live="polite"
        >
          Submitting your email to the waitlist
        </p>
      )}
    </form>
  );
}