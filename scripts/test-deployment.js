#!/usr/bin/env node

/**
 * Test script for deployment pipeline and environment variable access
 * This script validates that all deployment components work correctly
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

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

// Test configuration
const TEST_CONFIG = {
  timeout: 30000, // 30 seconds timeout for tests
  testEmail: 'test@patadoc.com',
  expectedFiles: [
    'next.config.ts',
    'vercel.json',
    'package.json',
    '.env.example',
    'app/api/waitlist/route.js'
  ]
};

class DeploymentTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runTest(name, testFn) {
    this.log(`Running test: ${name}`);
    
    try {
      await testFn();
      this.results.passed++;
      this.results.tests.push({ name, status: 'passed' });
      this.log(`Test passed: ${name}`, 'success');
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'failed', error: error.message });
      this.log(`Test failed: ${name} - ${error.message}`, 'error');
    }
  }

  async testFileStructure() {
    for (const file of TEST_CONFIG.expectedFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Required file missing: ${file}`);
      }
    }
  }

  async testEnvironmentVariables() {
    const requiredVars = [
      'EMAIL_SERVICE_TYPE',
      'EMAIL_SERVICE_API_KEY',
      'EMAIL_SERVICE_AUDIENCE_ID',
      'NEXT_PUBLIC_SITE_URL'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }

    // Test email service type validation
    const serviceType = process.env.EMAIL_SERVICE_TYPE;
    if (!['mailchimp', 'convertkit'].includes(serviceType)) {
      throw new Error(`Invalid EMAIL_SERVICE_TYPE: ${serviceType}`);
    }

    // Test site URL format
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
      throw new Error('NEXT_PUBLIC_SITE_URL must start with http:// or https://');
    }
  }

  async testNextJSBuild() {
    return new Promise((resolve, reject) => {
      this.log('Testing Next.js build process...');
      
      const buildProcess = spawn('npm', ['run', 'build'], {
        stdio: 'pipe',
        cwd: process.cwd()
      });

      let buildOutput = '';
      let buildError = '';

      buildProcess.stdout.on('data', (data) => {
        buildOutput += data.toString();
      });

      buildProcess.stderr.on('data', (data) => {
        buildError += data.toString();
      });

      const timeout = setTimeout(() => {
        buildProcess.kill();
        reject(new Error('Build process timed out'));
      }, TEST_CONFIG.timeout);

      buildProcess.on('close', (code) => {
        clearTimeout(timeout);
        
        if (code === 0) {
          this.log('Build completed successfully');
          resolve();
        } else {
          reject(new Error(`Build failed with code ${code}: ${buildError}`));
        }
      });

      buildProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(new Error(`Build process error: ${error.message}`));
      });
    });
  }

  async testAPIEndpoint() {
    // This test requires the build to be completed first
    const routePath = path.join(process.cwd(), 'app/api/waitlist/route.js');
    
    if (!fs.existsSync(routePath)) {
      throw new Error('API route file not found');
    }

    // Read and validate the API route file
    const routeContent = fs.readFileSync(routePath, 'utf8');
    
    if (!routeContent.includes('export async function POST')) {
      throw new Error('API route missing POST handler');
    }

    if (!routeContent.includes('email')) {
      throw new Error('API route missing email handling');
    }

    this.log('API endpoint structure validated');
  }

  async testVercelConfiguration() {
    const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
    
    if (!fs.existsSync(vercelConfigPath)) {
      throw new Error('vercel.json configuration file not found');
    }

    const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));

    // Validate required configuration
    if (!config.version) {
      throw new Error('vercel.json missing version');
    }

    if (!config.functions) {
      throw new Error('vercel.json missing functions configuration');
    }

    if (!config.headers) {
      throw new Error('vercel.json missing security headers');
    }

    this.log('Vercel configuration validated');
  }

  async testDeploymentScripts() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const requiredScripts = ['build', 'start', 'deploy:validate', 'deploy:build'];
    const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);

    if (missingScripts.length > 0) {
      throw new Error(`Missing deployment scripts: ${missingScripts.join(', ')}`);
    }

    this.log('Deployment scripts validated');
  }

  async testImageOptimization() {
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    const configContent = fs.readFileSync(nextConfigPath, 'utf8');

    if (!configContent.includes('images:')) {
      throw new Error('Next.js image optimization not configured');
    }

    if (!configContent.includes('webp')) {
      throw new Error('WebP format not enabled in image optimization');
    }

    this.log('Image optimization configuration validated');
  }

  async runAllTests() {
    this.log('🚀 Starting deployment pipeline tests...\n');

    await this.runTest('File Structure', () => this.testFileStructure());
    await this.runTest('Environment Variables', () => this.testEnvironmentVariables());
    await this.runTest('Vercel Configuration', () => this.testVercelConfiguration());
    await this.runTest('Deployment Scripts', () => this.testDeploymentScripts());
    await this.runTest('API Endpoint', () => this.testAPIEndpoint());
    await this.runTest('Image Optimization', () => this.testImageOptimization());
    
    // Build test is optional and can be skipped in CI environments
    if (!process.env.SKIP_BUILD_TEST) {
      await this.runTest('Next.js Build', () => this.testNextJSBuild());
    } else {
      this.log('Skipping build test (SKIP_BUILD_TEST=true)', 'warning');
    }

    this.printResults();
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 DEPLOYMENT TEST RESULTS');
    console.log('='.repeat(60));
    
    this.results.tests.forEach(test => {
      const status = test.status === 'passed' ? '✅' : '❌';
      console.log(`${status} ${test.name}`);
      if (test.error) {
        console.log(`   Error: ${test.error}`);
      }
    });

    console.log('\n' + '-'.repeat(60));
    console.log(`Total Tests: ${this.results.tests.length}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    
    if (this.results.failed === 0) {
      console.log('\n🎉 All tests passed! Deployment pipeline is ready.');
      console.log('\nNext steps:');
      console.log('1. Set environment variables in Vercel dashboard');
      console.log('2. Configure custom domain');
      console.log('3. Deploy to production');
    } else {
      console.log('\n❌ Some tests failed. Please fix the issues before deploying.');
      process.exit(1);
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const tester = new DeploymentTester();
  tester.runAllTests().catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}

module.exports = DeploymentTester;