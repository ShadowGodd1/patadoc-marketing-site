'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { focusUtils, screenReaderUtils, keyboardUtils } from '../lib/accessibility';

const AccessibilityContext = createContext({});

export function useAccessibility() {
  return useContext(AccessibilityContext);
}

export default function AccessibilityProvider({ children }) {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Detect keyboard usage
    function handleKeyDown(e) {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
        document.body.classList.add('keyboard-user');
      }
    }

    function handleMouseDown() {
      setIsKeyboardUser(false);
      document.body.classList.remove('keyboard-user');
    }

    // Skip links enhancement
    function handleSkipLink(e) {
      if (e.target.getAttribute('href') === '#main-content') {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('click', handleSkipLink);

    // Enhanced focus styles for keyboard users
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced focus styles for keyboard users */
      .keyboard-user *:focus {
        outline: 2px solid #006A80 !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }
      
      .keyboard-user button:focus,
      .keyboard-user input:focus,
      .keyboard-user textarea:focus,
      .keyboard-user select:focus {
        box-shadow: 0 0 0 3px rgba(0, 106, 128, 0.3) !important;
      }
      
      .keyboard-user a:focus {
        background-color: rgba(0, 106, 128, 0.1) !important;
        text-decoration: underline !important;
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .bg-patadoc-teal { background-color: #004d5c !important; }
        .text-patadoc-teal { color: #004d5c !important; }
        .border-patadoc-teal { border-color: #004d5c !important; }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* Screen reader only text */
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
      
      .sr-only:focus {
        position: static !important;
        width: auto !important;
        height: auto !important;
        padding: 0.5rem !important;
        margin: 0 !important;
        overflow: visible !important;
        clip: auto !important;
        white-space: normal !important;
        background-color: #006A80 !important;
        color: white !important;
        border-radius: 4px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('click', handleSkipLink);
      document.head.removeChild(style);
    };
  }, []);

  // Announcement system for screen readers
  const announce = (message, priority = 'polite') => {
    const id = Date.now();
    const announcement = { id, message, priority };
    
    setAnnouncements(prev => [...prev, announcement]);
    
    // Remove announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }, 1000);
  };

  const contextValue = {
    isKeyboardUser,
    announce,
    focusUtils,
    screenReaderUtils,
    keyboardUtils
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      
      {/* Live region for announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcements
          .filter(a => a.priority === 'polite')
          .map(a => (
            <div key={a.id}>{a.message}</div>
          ))
        }
      </div>
      
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {announcements
          .filter(a => a.priority === 'assertive')
          .map(a => (
            <div key={a.id}>{a.message}</div>
          ))
        }
      </div>
    </AccessibilityContext.Provider>
  );
}