# Google Tag Manager Implementation

## Overview

The PataDoc marketing site now uses Google Tag Manager (GTM) container `GTM-W9CHQQN4` for comprehensive analytics and tracking.

## Implementation Details

### 1. GTM Container ID
- **Container ID**: `GTM-W9CHQQN4`
- **Environment**: Production ready
- **Location**: Implemented in `app/layout.tsx`

### 2. Code Placement

#### Head Section (High Priority)
```html
<!-- Google Tag Manager -->
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W9CHQQN4');
</script>
<!-- End Google Tag Manager -->
```

#### Body Section (Immediately after opening `<body>` tag)
```html
<!-- Google Tag Manager (noscript) -->
<noscript>
<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W9CHQQN4"
height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
<!-- End Google Tag Manager (noscript) -->
```

### 3. Environment Configuration

The GTM container ID is configured in `.env.local`:
```bash
# Google Tag Manager Container ID
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-W9CHQQN4
```

### 4. Analytics Integration

The site includes comprehensive event tracking through the analytics library (`lib/analytics.js`):

#### Available Events
- **Waitlist Signup**: Tracks successful form submissions
- **Form Interactions**: Tracks user engagement with forms
- **Scroll Depth**: Measures content engagement (25%, 50%, 75%, 100%)
- **Section Views**: Tracks when sections become visible
- **CTA Clicks**: Monitors call-to-action button performance
- **Error Tracking**: Captures and reports errors
- **Page Views**: Automatic page view tracking

#### Usage Examples
```javascript
import { trackWaitlistSignup, trackCTAClick, trackScrollDepth } from '../lib/analytics';

// Track waitlist signup
trackWaitlistSignup('hero');

// Track CTA click
trackCTAClick('hero', 'Join Waitlist');

// Track scroll depth (automatically handled)
trackScrollDepth(50);
```

### 5. Web Vitals Integration

Core Web Vitals are automatically tracked and sent to GTM:
- **Largest Contentful Paint (LCP)**
- **First Input Delay (FID)**
- **Cumulative Layout Shift (CLS)**
- **First Contentful Paint (FCP)**
- **Time to First Byte (TTFB)**

### 6. Data Layer Events

The following custom events are pushed to the GTM dataLayer:

#### Conversion Events
- `waitlist_signup_success`
- `cta_click`

#### Engagement Events
- `form_interaction`
- `scroll_depth`
- `section_view`

#### Technical Events
- `page_view`
- `error_occurred`
- `web_vitals`

### 7. GTM Configuration Recommendations

#### Tags to Configure in GTM Dashboard

1. **Google Analytics 4 (GA4)**
   - Track page views and custom events
   - Configure enhanced ecommerce (future)
   - Set up conversion goals

2. **Facebook Pixel** (if needed)
   - Track website visitors
   - Create custom audiences
   - Optimize ad campaigns

3. **LinkedIn Insight Tag** (if needed)
   - B2B audience tracking
   - Conversion tracking for LinkedIn ads

4. **Custom HTML Tags**
   - Additional tracking scripts
   - Third-party integrations

#### Triggers to Set Up

1. **Page View Trigger**
   - Fire on all pages
   - Used for GA4 page tracking

2. **Custom Event Triggers**
   - `waitlist_signup_success` - for conversion tracking
   - `cta_click` - for engagement analysis
   - `scroll_depth` - for content engagement
   - `web_vitals` - for performance monitoring

3. **Form Submission Trigger**
   - Track waitlist form submissions
   - Monitor form abandonment

#### Variables to Configure

1. **Built-in Variables**
   - Page URL
   - Page Title
   - Referrer
   - Click Element
   - Form Element

2. **Custom Variables**
   - Form Location (hero, footer_cta)
   - CTA Location
   - Section Name
   - Error Type

### 8. Testing and Validation

#### GTM Preview Mode
1. Open GTM dashboard
2. Click "Preview" button
3. Enter site URL to test
4. Verify all tags fire correctly

#### Browser Developer Tools
1. Check `window.dataLayer` in console
2. Verify events are pushed correctly
3. Monitor network requests to GTM

#### Google Tag Assistant
1. Install Chrome extension
2. Navigate to site
3. Verify GTM container loads
4. Check for any errors or warnings

### 9. Performance Considerations

#### Optimizations Implemented
- **Async Loading**: GTM script loads asynchronously
- **DNS Prefetch**: Pre-resolve GTM domain
- **Resource Hints**: Optimize loading performance
- **Error Handling**: Graceful fallbacks if GTM fails

#### Performance Impact
- **Initial Load**: ~20KB additional JavaScript
- **Runtime**: Minimal impact on Core Web Vitals
- **Caching**: GTM scripts are cached by CDN

### 10. Privacy and Compliance

#### GDPR Considerations
- Implement consent management if targeting EU users
- Configure GTM to respect user consent choices
- Document data collection practices

#### Data Retention
- Configure appropriate data retention periods
- Implement data deletion procedures
- Monitor data usage and storage

### 11. Monitoring and Maintenance

#### Regular Checks
- Verify GTM container is loading correctly
- Monitor for JavaScript errors
- Check data quality in connected platforms

#### Updates and Changes
- Test changes in GTM preview mode
- Use GTM versioning for rollbacks
- Document all configuration changes

### 12. Troubleshooting

#### Common Issues
1. **GTM not loading**: Check container ID and network connectivity
2. **Events not firing**: Verify trigger configuration and dataLayer pushes
3. **Duplicate events**: Check for multiple GTM implementations

#### Debug Commands
```javascript
// Check if GTM is loaded
console.log(window.dataLayer);

// Check GTM container
console.log(window.google_tag_manager);

// View recent dataLayer events
console.log(window.dataLayer.slice(-10));
```

## Next Steps

1. **Configure GTM Dashboard**
   - Set up GA4 tracking
   - Create conversion goals
   - Configure custom dimensions

2. **Test Implementation**
   - Use GTM preview mode
   - Verify all events fire correctly
   - Test on different devices/browsers

3. **Monitor Performance**
   - Track Core Web Vitals
   - Monitor conversion rates
   - Analyze user behavior data

4. **Optimize Based on Data**
   - A/B test different CTAs
   - Optimize form placement
   - Improve user experience based on analytics

The GTM implementation is now complete and ready for production use with comprehensive tracking and analytics capabilities.