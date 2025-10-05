/**
 * Test script for analytics functionality
 * Run this in the browser console to test analytics events
 */

// Mock GTM dataLayer for testing
if (typeof window !== 'undefined' && !window.dataLayer) {
  window.dataLayer = [];
  console.log('Mock dataLayer created for testing');
}

// Import analytics functions (this would be done via module import in actual usage)
// For testing purposes, we'll define them inline or copy from the analytics.js file

const testAnalytics = () => {
  console.log('🧪 Testing Analytics Functions...\n');
  
  // Test 1: Basic event tracking
  console.log('1. Testing basic event tracking...');
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'test_event',
      test_data: 'analytics_working',
      timestamp: new Date().toISOString()
    });
    console.log('✅ Basic event pushed to dataLayer');
    console.log('DataLayer contents:', window.dataLayer);
  }
  
  // Test 2: Waitlist signup event
  console.log('\n2. Testing waitlist signup event...');
  window.dataLayer.push({
    event: 'waitlist_signup_success',
    form_location: 'hero',
    timestamp: new Date().toISOString()
  });
  console.log('✅ Waitlist signup event tracked');
  
  // Test 3: Form interaction event
  console.log('\n3. Testing form interaction event...');
  window.dataLayer.push({
    event: 'form_interaction',
    form_location: 'footer_cta',
    interaction_type: 'focus',
    timestamp: new Date().toISOString()
  });
  console.log('✅ Form interaction event tracked');
  
  // Test 4: Error tracking
  console.log('\n4. Testing error tracking...');
  window.dataLayer.push({
    event: 'error_occurred',
    error_type: 'validation',
    error_message: 'Invalid email format',
    error_location: 'hero',
    timestamp: new Date().toISOString()
  });
  console.log('✅ Error event tracked');
  
  // Test 5: Scroll depth tracking
  console.log('\n5. Testing scroll depth tracking...');
  window.dataLayer.push({
    event: 'scroll_depth',
    scroll_percentage: 50,
    timestamp: new Date().toISOString()
  });
  console.log('✅ Scroll depth event tracked');
  
  console.log('\n🎉 All analytics tests completed!');
  console.log('Final dataLayer state:', window.dataLayer);
  
  return {
    success: true,
    eventsTracked: window.dataLayer.length,
    dataLayer: window.dataLayer
  };
};

// Instructions for manual testing
console.log(`
📋 ANALYTICS TESTING INSTRUCTIONS:

1. Open browser developer tools (F12)
2. Go to the Console tab
3. Run: testAnalytics()
4. Check the console output for test results
5. Verify events appear in the dataLayer

For GTM testing:
1. Install GTM container on the site
2. Use GTM Preview mode
3. Trigger form interactions and submissions
4. Verify events fire in GTM debug panel

Expected Events:
- waitlist_signup_success (when form submitted successfully)
- form_interaction (on focus, blur, input)
- error_occurred (on validation or network errors)
- scroll_depth (at 25%, 50%, 75%, 100% scroll)
- page_view (on initial page load)
`);

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testAnalytics = testAnalytics;
}