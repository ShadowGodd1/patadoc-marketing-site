import { NextResponse } from 'next/server';
import { addToEmailService } from '../../../lib/email-services.js';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting - simple in-memory store (for production, use Redis or similar)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

function isValidEmail(email) {
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

function sanitizeEmail(email) {
  return email.trim().toLowerCase();
}

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  
  const requests = rateLimitStore.get(ip);
  // Remove old requests outside the window
  const recentRequests = requests.filter(timestamp => timestamp > windowStart);
  
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitStore.set(ip, recentRequests);
  return true;
}

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }
    
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Invalid JSON in request body:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid request format',
          code: 'INVALID_JSON'
        },
        { status: 400 }
      );
    }
    
    const { email, source = 'unknown' } = body;
    
    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { 
          error: 'Email address is required',
          code: 'MISSING_EMAIL'
        },
        { status: 400 }
      );
    }
    
    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email);
    
    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { 
          error: 'Please enter a valid email address',
          code: 'INVALID_EMAIL'
        },
        { status: 400 }
      );
    }
    
    // Validate source parameter
    const validSources = ['hero', 'footer_cta', 'unknown'];
    const validatedSource = validSources.includes(source) ? source : 'unknown';
    
    // Add to email service
    try {
      const result = await addToEmailService(sanitizedEmail, validatedSource);
      
      // Handle duplicate email case
      if (result.duplicate) {
        console.log('Duplicate email signup attempt:', {
          email: sanitizedEmail,
          source: validatedSource,
          ip: ip,
          timestamp: new Date().toISOString()
        });
        
        return NextResponse.json(
          { 
            error: 'This email is already on our waitlist. Thank you for your interest!',
            code: 'DUPLICATE_EMAIL'
          },
          { status: 409 }
        );
      }
      
      // Log successful signup for analytics
      console.log('Waitlist signup:', {
        email: sanitizedEmail,
        source: validatedSource,
        ip: ip,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json(
        { 
          success: true,
          message: 'Successfully added to waitlist'
        },
        { status: 200 }
      );
      
    } catch (emailServiceError) {
      console.error('Email service integration failed:', emailServiceError);
      
      // Check if it's a specific service error
      if (emailServiceError.message.includes('duplicate') || emailServiceError.message.includes('already exists')) {
        return NextResponse.json(
          { 
            error: 'This email is already on our waitlist. Thank you for your interest!',
            code: 'DUPLICATE_EMAIL'
          },
          { status: 409 }
        );
      }
      
      // Check if it's a service unavailable error
      if (emailServiceError.message.includes('timeout') || emailServiceError.message.includes('unavailable')) {
        return NextResponse.json(
          { 
            error: 'Service temporarily unavailable. Please try again in a moment.',
            code: 'SERVICE_UNAVAILABLE'
          },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Unable to process signup. Please try again later.',
          code: 'EMAIL_SERVICE_ERROR'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Unexpected error in waitlist API:', error);
    
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred. Please try again later.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    },
    { status: 405 }
  );
}