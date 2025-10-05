'use client';

import { useEffect, useState } from 'react';
import { auditBrandColors } from '../lib/accessibility';

/**
 * Accessibility testing component for development
 * This component should only be used in development mode
 */
export default function AccessibilityTest() {
  const [testResults, setTestResults] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    // Run accessibility tests
    const results = {
      colorContrast: auditBrandColors(),
      focusableElements: testFocusableElements(),
      ariaLabels: testAriaLabels(),
      semanticStructure: testSemanticStructure(),
      keyboardNavigation: testKeyboardNavigation()
    };

    setTestResults(results);
  }, []);

  function testFocusableElements() {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const results = [];
    focusableElements.forEach((element, index) => {
      const hasVisibleFocus = window.getComputedStyle(element, ':focus').outline !== 'none';
      const hasAriaLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
      
      results.push({
        element: element.tagName.toLowerCase(),
        index,
        hasVisibleFocus,
        hasAriaLabel,
        tabIndex: element.tabIndex
      });
    });
    
    return {
      total: focusableElements.length,
      withVisibleFocus: results.filter(r => r.hasVisibleFocus).length,
      withAriaLabels: results.filter(r => r.hasAriaLabel).length,
      details: results
    };
  }

  function testAriaLabels() {
    const elementsNeedingLabels = document.querySelectorAll(
      'button, input, select, textarea, [role="button"], [role="link"], img'
    );
    
    const results = [];
    elementsNeedingLabels.forEach((element, index) => {
      const hasLabel = element.hasAttribute('aria-label') || 
                      element.hasAttribute('aria-labelledby') ||
                      element.hasAttribute('alt') ||
                      element.textContent.trim() !== '';
      
      results.push({
        element: element.tagName.toLowerCase(),
        index,
        hasLabel,
        labelType: getElementLabelType(element)
      });
    });
    
    return {
      total: elementsNeedingLabels.length,
      withLabels: results.filter(r => r.hasLabel).length,
      details: results
    };
  }

  function getElementLabelType(element) {
    if (element.hasAttribute('aria-label')) return 'aria-label';
    if (element.hasAttribute('aria-labelledby')) return 'aria-labelledby';
    if (element.hasAttribute('alt')) return 'alt';
    if (element.textContent.trim() !== '') return 'text-content';
    return 'none';
  }

  function testSemanticStructure() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="contentinfo"], header, main, footer, nav, aside');
    const lists = document.querySelectorAll('ul, ol, dl');
    
    return {
      headings: {
        total: headings.length,
        h1Count: document.querySelectorAll('h1').length,
        properHierarchy: checkHeadingHierarchy(headings)
      },
      landmarks: landmarks.length,
      lists: lists.length
    };
  }

  function checkHeadingHierarchy(headings) {
    let previousLevel = 0;
    let isValid = true;
    
    headings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      if (currentLevel > previousLevel + 1) {
        isValid = false;
      }
      previousLevel = currentLevel;
    });
    
    return isValid;
  }

  function testKeyboardNavigation() {
    const interactiveElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    let tabOrder = [];
    interactiveElements.forEach(element => {
      tabOrder.push({
        element: element.tagName.toLowerCase(),
        tabIndex: element.tabIndex,
        isVisible: element.offsetParent !== null
      });
    });
    
    return {
      totalInteractive: interactiveElements.length,
      visibleInteractive: tabOrder.filter(item => item.isVisible).length,
      customTabOrder: tabOrder.filter(item => item.tabIndex > 0).length
    };
  }

  if (process.env.NODE_ENV !== 'development' || !testResults) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-patadoc-teal text-white px-4 py-2 rounded-lg shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-patadoc-teal focus:ring-offset-2"
        aria-label="Toggle accessibility test results"
      >
        A11y Test {isVisible ? '▼' : '▲'}
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-xl p-4">
          <h3 className="text-lg font-semibold text-charcoal mb-4">Accessibility Test Results</h3>
          
          {/* Color Contrast */}
          <div className="mb-4">
            <h4 className="font-semibold text-patadoc-teal mb-2">Color Contrast</h4>
            <p className="text-sm">
              {testResults.colorContrast.filter(r => r.passes).length}/{testResults.colorContrast.length} combinations pass WCAG AA
            </p>
          </div>
          
          {/* Focusable Elements */}
          <div className="mb-4">
            <h4 className="font-semibold text-patadoc-teal mb-2">Focus Management</h4>
            <p className="text-sm">
              {testResults.focusableElements.total} focusable elements found<br/>
              {testResults.focusableElements.withAriaLabels} have ARIA labels
            </p>
          </div>
          
          {/* ARIA Labels */}
          <div className="mb-4">
            <h4 className="font-semibold text-patadoc-teal mb-2">ARIA Labels</h4>
            <p className="text-sm">
              {testResults.ariaLabels.withLabels}/{testResults.ariaLabels.total} elements have proper labels
            </p>
          </div>
          
          {/* Semantic Structure */}
          <div className="mb-4">
            <h4 className="font-semibold text-patadoc-teal mb-2">Semantic Structure</h4>
            <p className="text-sm">
              {testResults.semanticStructure.headings.total} headings ({testResults.semanticStructure.headings.h1Count} H1)<br/>
              {testResults.semanticStructure.landmarks} landmarks<br/>
              Heading hierarchy: {testResults.semanticStructure.headings.properHierarchy ? '✅' : '❌'}
            </p>
          </div>
          
          {/* Keyboard Navigation */}
          <div className="mb-4">
            <h4 className="font-semibold text-patadoc-teal mb-2">Keyboard Navigation</h4>
            <p className="text-sm">
              {testResults.keyboardNavigation.visibleInteractive}/{testResults.keyboardNavigation.totalInteractive} interactive elements visible<br/>
              {testResults.keyboardNavigation.customTabOrder} custom tab order elements
            </p>
          </div>
          
          <div className="text-xs text-gray-500 mt-4 pt-2 border-t">
            Development mode only - This panel will not appear in production
          </div>
        </div>
      )}
    </div>
  );
}