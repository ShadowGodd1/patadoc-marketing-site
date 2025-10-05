#!/usr/bin/env node

/**
 * Deployment script for PataDoc Marketing Site
 * Validates environment variables and prepares for deployment
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env files
function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const envContent = fs.readFileSync(filePath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    });
  }
}

// Load environment variables in order of precedence
loadEnvFile(path.join(process.cwd(), '.env.local'));
loadEnvFile(path.join(process.cwd(), '.env'));

// Required environment variables for production
const REQUIRED_ENV_VARS = [
  'EMAIL_SERVICE_TYPE',
  'EMAIL_SERVICE_API_KEY',
  'EMAIL_SERVICE_AUDIENCE_ID',
  'NEXT_PUBLIC_SITE_URL'
];

// Optional environment variables
const OPTIONAL_ENV_VARS = [
  'NEXT_PUBLIC_GTM_CONTAINER_ID',
  'NODE_ENV'
];

function validateEnvironmentVariables() {
  console.log('🔍 Validating environment variables...\n');
  
  const missing = [];
  const present = [];
  
  // Check required variables
  REQUIRED_ENV_VARS.forEach(varName => {
    if (process.env[varName]) {
      present.push(varName);
      console.log(`✅ ${varName}: ${varName.includes('API_KEY') ? '***' : process.env[varName]}`);
    } else {
      missing.push(varName);
      console.log(`❌ ${varName}: Missing`);
    }
  });
  
  // Check optional variables
  console.log('\nOptional variables:');
  OPTIONAL_ENV_VARS.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: ${process.env[varName]}`);
    } else {
      console.log(`⚠️  ${varName}: Not set (optional)`);
    }
  });
  
  if (missing.length > 0) {
    console.log('\n❌ Deployment validation failed!');
    console.log('Missing required environment variables:');
    missing.forEach(varName => console.log(`  - ${varName}`));
    console.log('\nPlease set these variables in your Vercel project settings or .env.local file.');
    process.exit(1);
  }
  
  console.log('\n✅ All required environment variables are present!');
}

function validateEmailServiceConfig() {
  console.log('\n🔍 Validating email service configuration...\n');
  
  const serviceType = process.env.EMAIL_SERVICE_TYPE;
  const apiKey = process.env.EMAIL_SERVICE_API_KEY;
  const audienceId = process.env.EMAIL_SERVICE_AUDIENCE_ID;
  
  if (serviceType === 'mailchimp') {
    // Validate Mailchimp API key format
    if (!apiKey.includes('-')) {
      console.log('❌ Mailchimp API key should contain a hyphen (e.g., key-us4)');
      process.exit(1);
    }
    console.log('✅ Mailchimp configuration looks valid');
  } else if (serviceType === 'convertkit') {
    // ConvertKit API keys are typically alphanumeric
    if (apiKey.length < 10) {
      console.log('❌ ConvertKit API key seems too short');
      process.exit(1);
    }
    console.log('✅ ConvertKit configuration looks valid');
  } else {
    console.log(`❌ Unsupported email service type: ${serviceType}`);
    console.log('Supported types: mailchimp, convertkit');
    process.exit(1);
  }
}

function validateSiteUrl() {
  console.log('\n🔍 Validating site URL...\n');
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
    console.log('❌ NEXT_PUBLIC_SITE_URL must start with http:// or https://');
    process.exit(1);
  }
  
  if (siteUrl.includes('localhost') && process.env.NODE_ENV === 'production') {
    console.log('⚠️  Warning: Using localhost URL in production environment');
  }
  
  console.log(`✅ Site URL is valid: ${siteUrl}`);
}

function checkBuildFiles() {
  console.log('\n🔍 Checking build configuration...\n');
  
  const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(nextConfigPath)) {
    console.log('❌ next.config.ts not found');
    process.exit(1);
  }
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json not found');
    process.exit(1);
  }
  
  console.log('✅ Build configuration files present');
}

function main() {
  console.log('🚀 PataDoc Marketing Site - Deployment Validation\n');
  console.log('='.repeat(50));
  
  try {
    validateEnvironmentVariables();
    validateEmailServiceConfig();
    validateSiteUrl();
    checkBuildFiles();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Deployment validation successful!');
    console.log('Your site is ready to deploy to Vercel.');
    console.log('\nNext steps:');
    console.log('1. Push your code to your Git repository');
    console.log('2. Connect your repository to Vercel');
    console.log('3. Set environment variables in Vercel dashboard');
    console.log('4. Deploy!');
    
  } catch (error) {
    console.error('\n❌ Deployment validation failed:', error.message);
    process.exit(1);
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  validateEnvironmentVariables,
  validateEmailServiceConfig,
  validateSiteUrl,
  checkBuildFiles
};