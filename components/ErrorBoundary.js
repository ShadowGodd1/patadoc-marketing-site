'use client';

import { Component } from 'react';
import { trackError } from '../lib/analytics';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Track error in analytics
    trackError('component_error', error.message, this.props.componentName || 'unknown');
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    const newRetryCount = this.state.retryCount + 1;
    
    // Track retry attempt
    trackError('error_retry_attempt', `Retry ${newRetryCount}`, this.props.componentName || 'unknown');
    
    // Reset error state to retry rendering
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: newRetryCount
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default fallback UI
      return (
        <div className="min-h-[200px] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="mb-4">
              <svg 
                className="w-12 h-12 text-red-500 mx-auto mb-4" 
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
              <h2 className="text-xl font-semibold text-charcoal mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-4">
                We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
              </p>
            </div>
            
            {this.state.retryCount < 3 && (
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center px-4 py-2 bg-patadoc-teal text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-patadoc-teal focus:ring-offset-2"
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
            )}
            
            {this.state.retryCount >= 3 && (
              <div className="text-sm text-gray-500">
                <p className="mb-2">Still having trouble? Try:</p>
                <ul className="text-left space-y-1">
                  <li>• Refreshing your browser</li>
                  <li>• Checking your internet connection</li>
                  <li>• Trying again in a few minutes</li>
                </ul>
              </div>
            )}
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;