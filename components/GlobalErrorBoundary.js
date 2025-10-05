'use client';

import ErrorBoundary from './ErrorBoundary';

export default function GlobalErrorBoundary({ children }) {
  const globalFallback = (error, retry) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <svg 
            className="w-16 h-16 text-red-500 mx-auto mb-6" 
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
          
          <h1 className="text-2xl font-bold text-charcoal mb-4">
            Oops! Something went wrong
          </h1>
          
          <p className="text-gray-600 mb-6">
            We&apos;re sorry, but the PataDoc website encountered an unexpected error. 
            Our team has been notified and is working to fix this issue.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={retry}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-patadoc-teal text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-patadoc-teal focus:ring-offset-2"
          >
            <svg 
              className="w-4 h-4 mr-2" 
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
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-charcoal font-semibold rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ml-0 sm:ml-3"
          >
            <svg 
              className="w-4 h-4 mr-2" 
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
            Refresh Page
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If this problem persists, please contact us at{' '}
            <a 
              href="mailto:support@patadoc.com" 
              className="text-patadoc-teal hover:underline"
            >
              support@patadoc.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary 
      componentName="global_app"
      fallback={globalFallback}
    >
      {children}
    </ErrorBoundary>
  );
}