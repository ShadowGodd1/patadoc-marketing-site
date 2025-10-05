'use client';

import { useEffect } from 'react';
import { initializePerformanceOptimizations, webVitalsOptimizations, addResourceHints } from '../lib/performance';

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Initialize performance optimizations
    initializePerformanceOptimizations();
    
    // Add resource hints
    addResourceHints();
    
    // Apply Web Vitals optimizations
    const applyOptimizations = () => {
      webVitalsOptimizations.preventLayoutShift();
      webVitalsOptimizations.optimizeLCP();
      webVitalsOptimizations.optimizeFID();
    };
    
    // Apply optimizations after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyOptimizations);
    } else {
      applyOptimizations();
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('DOMContentLoaded', applyOptimizations);
    };
  }, []);

  return null; // This component doesn't render anything
}