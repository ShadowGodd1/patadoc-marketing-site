// Email service integrations
// This file provides utility functions for different email marketing services

/**
 * Mailchimp API integration
 */
export async function addToMailchimp(email, source, apiKey, audienceId) {
  // Extract datacenter from API key (e.g., "us4" from "your-api-key-us4")
  const datacenter = apiKey.split('-')[1];
  const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
  
  const payload = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      SIGNUP_SOURCE: source,
      SIGNUP_DATE: new Date().toISOString()
    },
    tags: ['PataDoc_Waitlist', 'Pre_Launch']
  };
  
  console.log(`Adding email to Mailchimp: ${email} (source: ${source})`);
  console.log('Environment check:', { hasApiKey: !!apiKey, hasAudienceId: !!audienceId });
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `apikey ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Handle duplicate email gracefully
    if (response.status === 400 && errorData.title === 'Member Exists') {
      console.log(`Email already exists in Mailchimp: ${email}`);
      return { success: true, duplicate: true };
    }
    
    console.error('Mailchimp API error:', {
      status: response.status,
      error: errorData
    });
    
    throw new Error(`Mailchimp API error: ${response.status} - ${errorData.detail || response.statusText}`);
  }
  
  const data = await response.json();
  console.log(`Successfully added to Mailchimp: ${email}`);
  return { success: true, data };
}

/**
 * ConvertKit API integration
 */
export async function addToConvertKit(email, source, apiKey, formId) {
  const url = `https://api.convertkit.com/v3/forms/${formId}/subscribe`;
  
  const payload = {
    api_key: apiKey,
    email: email,
    fields: {
      signup_source: source,
      signup_date: new Date().toISOString()
    },
    tags: ['PataDoc_Waitlist', 'Pre_Launch']
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // ConvertKit returns 200 even for duplicates, but check for specific error messages
    if (errorData.message && errorData.message.includes('already subscribed')) {
      return { success: true, duplicate: true };
    }
    
    throw new Error(`ConvertKit API error: ${response.status} - ${errorData.message || response.statusText}`);
  }
  
  const data = await response.json();
  return { success: true, data };
}

/**
 * Generic email service handler
 * Automatically detects which service to use based on environment variables
 */
export async function addToEmailService(email, source) {
  const apiKey = process.env.EMAIL_SERVICE_API_KEY;
  const audienceId = process.env.EMAIL_SERVICE_AUDIENCE_ID;
  const serviceType = process.env.EMAIL_SERVICE_TYPE || 'mailchimp'; // default to mailchimp
  
  if (!apiKey || !audienceId) {
    throw new Error('Email service configuration missing');
  }
  
  try {
    switch (serviceType.toLowerCase()) {
      case 'convertkit':
        return await addToConvertKit(email, source, apiKey, audienceId);
      case 'mailchimp':
      default:
        return await addToMailchimp(email, source, apiKey, audienceId);
    }
  } catch (error) {
    console.error(`Email service (${serviceType}) error:`, error);
    throw error;
  }
}