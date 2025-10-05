/**
 * Performance optimization utilities for the PataDoc marketing site
 */

/**
 * Preload critical images to improve LCP
 */
export function preloadCriticalImages() {
  if (typeof window === 'undefined') return;

  const criticalImages = [
    '/images/hero-app-mockup.webp',
    '/images/logo.svg',
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    
    // Add WebP support check
    if (src.endsWith('.webp')) {
      link.type = 'image/webp';
    }
    
    document.head.appendChild(link);
  });
}

/**
 * Lazy load images that are below the fold
 */
export function setupIntersectionObserver() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01,
  });

  // Observe all lazy images
  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}

/**
 * Optimize font loading
 */
export function optimizeFontLoading() {
  if (typeof window === 'undefined') return;

  // Preload critical font weights
  const fontWeights = ['400', '600', '700'];
  
  fontWeights.forEach((weight) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = `/fonts/inter-${weight}.woff2`;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Prefetch next page resources
 */
export function prefetchResources() {
  if (typeof window === 'undefined') return;

  // Prefetch API endpoint
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = '/api/waitlist';
  document.head.appendChild(link);
}

/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations() {
  if (typeof window === 'undefined') return;

  // Run optimizations after page load
  window.addEventListener('load', () => {
    preloadCriticalImages();
    setupIntersectionObserver();
    optimizeFontLoading();
    prefetchResources();
  });
}

/**
 * Web Vitals optimization helpers
 */
export const webVitalsOptimizations = {
  // Reduce Cumulative Layout Shift (CLS)
  preventLayoutShift: () => {
    // Add aspect ratio containers for images
    const images = document.querySelectorAll('img[width][height]');
    images.forEach((img) => {
      const container = img.parentElement;
      
      if (container && !container.style.aspectRatio) {
        container.style.aspectRatio = `${img.width} / ${img.height}`;
      }
    });
  },

  // Improve Largest Contentful Paint (LCP)
  optimizeLCP: () => {
    // Ensure hero image is prioritized
    const heroImage = document.querySelector('[data-hero-image]');
    if (heroImage) {
      heroImage.loading = 'eager';
      heroImage.fetchPriority = 'high';
    }
  },

  // Improve First Input Delay (FID)
  optimizeFID: () => {
    // Defer non-critical JavaScript
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach((script) => {
      script.defer = true;
    });
  },
};

/**
 * Resource hints for better performance
 */
export function addResourceHints() {
  if (typeof window === 'undefined') return;

  const hints = [
    // DNS prefetch for external domains
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//www.googletagmanager.com' },
    
    // Preconnect to critical origins
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
  ];

  hints.forEach((hint) => {
    const link = document.createElement('link');
    Object.assign(link, hint);
    document.head.appendChild(link);
  });
}