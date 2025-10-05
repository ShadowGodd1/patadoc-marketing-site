'use client';

import { useEffect } from 'react';
import WaitlistForm from './WaitlistForm';
import FormErrorBoundary from './FormErrorBoundary';

export default function WaitlistModal({ isOpen, onClose }) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-patadoc-teal focus:ring-offset-2"
              onClick={onClose}
              aria-label="Close modal"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal content */}
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              {/* Modal header */}
              <h3 
                className="text-2xl font-bold leading-6 text-patadoc-teal mb-2"
                id="modal-title"
              >
                Be the first to know.
              </h3>
              
              <p className="text-base text-charcoal mb-6">
                Join our waitlist and get early access to PataDoc when we launch. 
                Find and book verified doctors in Kenya with ease.
              </p>

              {/* Waitlist form */}
              <div className="w-full">
                <FormErrorBoundary formName="modal">
                  <WaitlistForm 
                    location="modal" 
                    onSuccess={() => {
                      // Close modal after successful signup
                      setTimeout(() => {
                        onClose();
                      }, 2000);
                    }}
                  />
                </FormErrorBoundary>
              </div>

              {/* Additional info */}
              <p className="text-sm text-gray-500 mt-4 text-center">
                No spam, ever. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}