'use client';

import { useEffect } from 'react';

export default function WebVitals() {
  useEffect(() => {
    // Only run in production and if Web Vitals API is available
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
      return;
    }

    // Import web-vitals dynamically to avoid increasing bundle size
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Track Core Web Vitals
      getCLS((metric) => {
        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: metric.name,
            value: Math.round(metric.value * 1000),
            custom_map: { metric_id: 'cls' },
          });
        }
      });

      getFID((metric) => {
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: metric.name,
            value: Math.round(metric.value),
            custom_map: { metric_id: 'fid' },
          });
        }
      });

      getFCP((metric) => {
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: metric.name,
            value: Math.round(metric.value),
            custom_map: { metric_id: 'fcp' },
          });
        }
      });

      getLCP((metric) => {
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: metric.name,
            value: Math.round(metric.value),
            custom_map: { metric_id: 'lcp' },
          });
        }
      });

      getTTFB((metric) => {
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: metric.name,
            value: Math.round(metric.value),
            custom_map: { metric_id: 'ttfb' },
          });
        }
      });
    }).catch((error) => {
      console.warn('Failed to load web-vitals:', error);
    });
  }, []);

  return null;
}