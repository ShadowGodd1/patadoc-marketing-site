# Waitlist API Documentation

## Overview

The waitlist API endpoint handles email signups for the PataDoc app waitlist. It provides server-side validation, rate limiting, and integration with email marketing services.

## Endpoint

```
POST /api/waitlist
```

## Request Format

```json
{
  "email": "user@example.com",
  "source": "hero" // optional: "hero", "footer_cta", or "unknown"
}
```

## Response Formats

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Successfully added to waitlist"
}
```

### Error Responses

#### Invalid Email (400 Bad Request)
```json
{
  "error": "Please enter a valid email address",
  "code": "INVALID_EMAIL"
}
```

#### Missing Email (400 Bad Request)
```json
{
  "error": "Email address is required",
  "code": "MISSING_EMAIL"
}
```

#### Rate Limit Exceeded (429 Too Many Requests)
```json
{
  "error": "Too many requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

#### Server Error (500 Internal Server Error)
```json
{
  "error": "Unable to process signup. Please try again later.",
  "code": "EMAIL_SERVICE_ERROR"
}
```

#### Method Not Allowed (405)
```json
{
  "error": "Method not allowed",
  "code": "METHOD_NOT_ALLOWED"
}
```

## Features

### Email Validation
- Client-side and server-side email format validation
- Email sanitization (trim and lowercase)
- Maximum email length validation (254 characters)

### Rate Limiting
- 5 requests per minute per IP address
- In-memory rate limiting store (suitable for serverless)
- Automatic cleanup of old request records

### Email Service Integration
- Support for Mailchimp and ConvertKit
- Graceful handling of duplicate email addresses
- Automatic service detection based on configuration
- Comprehensive error handling and logging

### Security Features
- Input sanitization
- CORS protection
- Environment variable protection
- Request validation

## Environment Variables

Required environment variables:

```bash
# Email service type (mailchimp or convertkit)
EMAIL_SERVICE_TYPE=mailchimp

# API key for your email service
EMAIL_SERVICE_API_KEY=your_api_key_here

# Audience/List ID for your email service
EMAIL_SERVICE_AUDIENCE_ID=your_list_id_here
```

### Mailchimp Configuration
1. Get your API key from [Mailchimp API Keys](https://mailchimp.com/help/about-api-keys/)
2. Find your List ID in your list settings
3. Set `EMAIL_SERVICE_TYPE=mailchimp`

### ConvertKit Configuration
1. Get your API key from [ConvertKit API](https://help.convertkit.com/en/articles/2502591-getting-started-with-the-convertkit-api)
2. Use your Form ID as the audience ID
3. Set `EMAIL_SERVICE_TYPE=convertkit`

## Testing

Run the test script to verify the API functionality:

```bash
# Start the development server
npm run dev

# In another terminal, run the test script
node test-api.js
```

The test script will verify:
- Valid email submission
- Invalid email format handling
- Missing email handling
- Unsupported HTTP methods
- Rate limiting functionality

## Error Handling

The API implements comprehensive error handling:

1. **Client Errors (4xx)**: Invalid input, missing data, rate limiting
2. **Server Errors (5xx)**: Email service failures, unexpected errors
3. **Network Errors**: Handled gracefully with user-friendly messages

All errors are logged server-side for debugging while returning user-friendly messages to the client.

## Analytics Integration

Successful signups trigger analytics events that can be tracked:

```javascript
// Event fired on successful signup
{
  event: 'waitlist_signup_success',
  form_location: 'hero' | 'footer_cta' | 'unknown',
  timestamp: '2024-01-01T00:00:00.000Z'
}
```

## Production Considerations

### Rate Limiting
- Current implementation uses in-memory storage
- For high-traffic production, consider Redis or similar
- Rate limits can be adjusted in the API route file

### Email Service Reliability
- API handles service downtime gracefully
- Duplicate emails are handled without errors
- Failed requests are logged for monitoring

### Monitoring
- All operations are logged with appropriate levels
- Error tracking should be implemented (e.g., Sentry)
- Monitor signup conversion rates and error rates

### Security
- HTTPS is required in production
- Environment variables must be properly secured
- Consider implementing additional spam protection if needed