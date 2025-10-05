'use client';

import ErrorBoundary from './ErrorBoundary';

export default function FormErrorBoundary({ children, formName = 'form' }) {
  const formFallback = (error, retry) => (
    <div className="w-full max-w-md">
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
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
            <h3 className="text-sm font-medium text-red-800">
              Form Error
            </h3>
            <p className="mt-1 text-sm text-red-700">
              The signup form encountered an error. Please refresh the page to try again.
            </p>
            <div className="mt-3">
              <button
                onClick={retry}
                className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Retry Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary 
      componentName={`${formName}_form`}
      fallback={formFallback}
    >
      {children}
    </ErrorBoundary>
  );
}