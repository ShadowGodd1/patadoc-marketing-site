'use client';

import { useEffect } from 'react';
import { initializeAnalytics, isAnalyticsReady } from '../lib/analytics';

export default function AnalyticsProvider({ children }) {
  useEffect(() => {
    // Wait for GTM to load before initializing analytics
    const initAnalytics = () => {
      if (isAnalyticsReady()) {
        initializeAnalytics();
      } else {
        // Retry after a short delay if GTM isn't ready yet
        setTimeout(initAnalytics, 500);
      }
    };

    // Initialize analytics after component mounts
    initAnalytics();
  }, []);

  return <>{children}</>;
}