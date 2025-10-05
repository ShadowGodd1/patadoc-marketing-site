'use client';

import { useState } from 'react';

// Test component to trigger errors for testing error boundaries
export default function ErrorTestComponent() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('Test error for error boundary testing');
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShouldError(true)}
        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
      >
        Test Error Boundary
      </button>
    </div>
  );
}