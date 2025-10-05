'use client';

import { useState, useEffect } from 'react';
import { useAccessibility } from './AccessibilityProvider';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const { announce } = useAccessibility();

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    function handleOnline() {
      setIsOnline(true);
      announce('Connection restored. You are back online.', 'polite');
    }

    function handleOffline() {
      setIsOnline(false);
      announce('Connection lost. You are currently offline.', 'assertive');
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [announce]);

  if (isOnline) {
    return null;
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 text-center text-sm z-50"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center justify-center space-x-2">
        <svg 
          className="w-4 h-4" 
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
        <span>You are currently offline. Some features may not work properly.</span>
      </div>
    </div>
  );
}