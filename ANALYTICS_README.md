# Analytics Implementation Guide

## Overview

This document describes the analytics tracking implementation for the PataDoc marketing website. The analytics system uses Google Tag Manager (GTM) for flexible event tracking and conversion measurement.

## Files Created/Modified

### New Files
- `lib/analytics.js` - Core analytics utilities and event tracking functions
- `components/AnalyticsProvider.js` - Client-side analytics initialization component
- `test-analytics.js` - Testing utilities for analytics functionality
- `ANALYTICS_README.md` - This documentation file

### Modified Files
- `components/WaitlistForm.js` - Added analytics tracking for form interactions and submissions
- `app/page.tsx` - Integrated AnalyticsProvider for analytics initialization

## Analytics Functions

### Core Functions

#### `trackEvent(eventName, eventData)`
Base function for pushing events to GTM dataLayer.
- **Parameters**: 
  - `eventName` (string): Name of the event
  - `eventData` (object): Additional event data
- **Usage**: Used by all other tracking functions

#### `trackWaitlistSignup(formLocation)`
Tracks successful waitlist signups (Requirement 9.2).
- **Parameters**: 
  - `formLocation` (string): 'hero' or 'footer_cta'
- **GTM Event**: `waitlist_signup_success`
- **Data**: `form_location` parameter

#### `trackFormInteraction(formLocation, action)`
Tracks form interactions for engagement analysis.
- **Parameters**: 
  - `formLocation` (string): Location of the form
  - `action` (string): 'focus', 'blur', 'input'
- **GTM Event**: `form_interaction`

#### `trackError(errorType, errorMessage, location)`
Tracks errors for debugging and UX monitoring.
- **Parameters**: 
  - `errorType` (string): Type of error
  - `errorMessage` (string): Error description
  - `location` (string): Where error occurred
- **GTM Event**: `error_occurred`

### Additional Utility Functions

#### `trackScrollDepth(scrollPercentage)`
Tracks page scroll depth at 25%, 50%, 75%, 100% milestones.

#### `trackSectionView(sectionName)`
Tracks when sections become visible for engagement analysis.

#### `trackCTAClick(ctaLocation, ctaText)`
Tracks CTA button clicks for conversion funnel analysis.

#### `initializeAnalytics()`
Initializes analytics tracking with page view and scroll depth monitoring.

#### `isAnalyticsReady()`
Utility to check if GTM dataLayer is properly loaded.

## Implementation Details

### WaitlistForm Integration

The WaitlistForm component now tracks:
- **Form interactions**: Focus, blur, and input events
- **Successful submissions**: `waitlist_signup_success` event with form location
- **Errors**: Validation errors and network errors

### Analytics Provider

The AnalyticsProvider component:
- Initializes analytics on page load
- Waits for GTM to be ready before initialization
- Sets up scroll depth tracking automatically

### Event Data Structure

All events include:
- `timestamp`: ISO string of when event occurred
- Event-specific data (form_location, error_type, etc.)
- Automatic development mode logging

## Testing

### Manual Testing

1. **Browser Console Testing**:
   ```javascript
   // Run in browser console
   testAnalytics()
   ```

2. **GTM Preview Mode**:
   - Enable GTM Preview mode
   - Interact with forms and page elements
   - Verify events appear in GTM debug panel

3. **Developer Tools**:
   - Check console for analytics logs (development mode)
   - Inspect `window.dataLayer` contents
   - Monitor network requests to GTM

### Expected Events

| Event | Trigger | Data |
|-------|---------|------|
| `page_view` | Page load | page_title, page_url |
| `waitlist_signup_success` | Form submission success | form_location |
| `form_interaction` | Form focus/blur/input | form_location, interaction_type |
| `error_occurred` | Validation/network errors | error_type, error_message, error_location |
| `scroll_depth` | Scroll milestones | scroll_percentage |

### Testing Checklist

- [ ] GTM container loads properly
- [ ] Page view event fires on load
- [ ] Form interaction events fire on focus/blur/input
- [ ] Waitlist signup success event fires with correct form_location
- [ ] Error events fire for validation and network errors
- [ ] Scroll depth events fire at 25%, 50%, 75%, 100%
- [ ] Events include proper timestamps and data
- [ ] Development mode logging works
- [ ] Production mode doesn't log to console

## GTM Configuration

### Required GTM Setup

1. **Container Installation**: GTM container must be installed in `app/layout.tsx`
2. **Event Triggers**: Configure triggers for custom events
3. **Variables**: Set up variables for event data
4. **Tags**: Create tags for sending data to analytics platforms

### Recommended GTM Tags

- Google Analytics 4 (GA4) for web analytics
- Facebook Pixel for social media advertising
- LinkedIn Insight Tag for B2B tracking
- Custom HTML tags for additional tracking needs

## Requirements Compliance

### Requirement 9.2 ✅
> WHEN a user successfully signs up for the waitlist THEN the system SHALL fire 'waitlist_signup_success' event to dataLayer

**Implementation**: `trackWaitlistSignup()` function fires the exact event name with form_location parameter.

### Requirement 9.3 ✅
> WHEN the analytics event fires THEN the system SHALL include form_location parameter ('hero' or 'footer_cta')

**Implementation**: All waitlist signup events include the form_location parameter with the exact values specified.

### Requirement 9.4 ✅
> WHEN GTM is loaded THEN the system SHALL be ready to track additional custom events as needed

**Implementation**: Comprehensive analytics utilities provide functions for tracking various event types beyond just waitlist signups.

## Performance Considerations

- **Lazy Loading**: Analytics initialization waits for GTM to be ready
- **Throttling**: Scroll events are throttled to prevent performance issues
- **Error Handling**: Graceful fallback when GTM is not available
- **Development Mode**: Console logging only in development to avoid production noise

## Security and Privacy

- **No PII Storage**: Email addresses are not stored in analytics events
- **Anonymous Tracking**: User interactions are tracked anonymously
- **GDPR Compliance**: Events can be disabled based on user consent
- **Data Minimization**: Only necessary data is tracked

## Future Enhancements

- A/B testing framework integration
- Heatmap tracking capabilities
- User journey funnel analysis
- Performance metrics tracking
- Custom conversion goals setup