# Deployment Guide

## Vercel Deployment

This project is optimized for deployment on Vercel with serverless functions.

### Prerequisites

1. Vercel account
2. Email marketing service account (Mailchimp or ConvertKit)
3. Environment variables configured

### Environment Variables

Set the following environment variables in your Vercel project settings:

```bash
# Required
EMAIL_SERVICE_TYPE=mailchimp
EMAIL_SERVICE_API_KEY=your_api_key_here
EMAIL_SERVICE_AUDIENCE_ID=your_list_id_here

# Optional
GTM_CONTAINER_ID=GTM-XXXXXXX
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Deployment Steps

1. **Validate Configuration**
   ```bash
   # Run deployment validation
   npm run deploy:validate
   ```

2. **Connect Repository**
   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel
   
   # Deploy from CLI
   vercel
   ```

3. **Set Environment Variables**
   - Go to Project Settings > Environment Variables in Vercel dashboard
   - Add all required variables for Production, Preview, and Development:
     - `EMAIL_SERVICE_TYPE`
     - `EMAIL_SERVICE_API_KEY`
     - `EMAIL_SERVICE_AUDIENCE_ID`
     - `NEXT_PUBLIC_GTM_CONTAINER_ID`
     - `NEXT_PUBLIC_SITE_URL`

4. **Configure Custom Domain**
   
   #### Option A: Domain purchased through Vercel
   - Go to Project Settings > Domains
   - Click "Add Domain"
   - Purchase domain directly through Vercel
   - DNS and SSL are automatically configured
   
   #### Option B: External domain (recommended for patadoc.com)
   - Go to Project Settings > Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `patadoc.com`)
   - Configure DNS records with your domain provider:
   
   **For root domain (patadoc.com):**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   ```
   
   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
   
   **Alternative: Use Vercel nameservers (recommended)**
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

5. **SSL Certificate Configuration**
   - SSL certificates are automatically provisioned by Vercel
   - Supports both Let's Encrypt and custom certificates
   - Automatic renewal every 90 days
   - HTTPS redirect is enabled by default
   
   **Custom SSL Certificate (if needed):**
   - Go to Project Settings > Domains
   - Click on your domain
   - Upload certificate files in the SSL section

6. **Deploy**
   ```bash
   # Validate and build
   npm run deploy:build
   
   # Deploy to production
   vercel --prod
   
   # Or push to main branch for automatic deployment
   git push origin main
   ```

### Email Service Setup

#### Mailchimp Setup
1. Create a Mailchimp account
2. Create a new audience/list
3. Get your API key from Account > Extras > API keys
4. Get your List ID from Audience > Settings > Audience name and defaults
5. Set `EMAIL_SERVICE_TYPE=mailchimp`

#### ConvertKit Setup
1. Create a ConvertKit account
2. Create a new form
3. Get your API key from Account Settings > API
4. Get your Form ID from the form settings
5. Set `EMAIL_SERVICE_TYPE=convertkit`

### Testing Deployment

After deployment, test the API endpoint:

```bash
curl -X POST https://your-domain.com/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"hero"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Successfully added to waitlist"
}
```

### Monitoring

1. **Vercel Analytics**: Automatically enabled for performance monitoring
2. **Function Logs**: Available in Vercel dashboard under Functions tab
3. **Error Tracking**: Consider adding Sentry for production error monitoring

### Performance Optimization

The site is optimized for:
- Core Web Vitals compliance
- Fast loading times
- Mobile responsiveness
- SEO optimization

### Domain Verification and DNS

#### DNS Propagation
- DNS changes can take 24-48 hours to propagate globally
- Use tools like `dig` or online DNS checkers to verify:
  ```bash
  dig patadoc.com
  dig www.patadoc.com
  ```

#### Domain Verification
1. **Verify domain ownership** in Vercel dashboard
2. **Check SSL certificate status** - should show "Valid"
3. **Test HTTPS redirect** - HTTP should automatically redirect to HTTPS
4. **Verify www redirect** - www.patadoc.com should redirect to patadoc.com (or vice versa)

#### Performance Optimization for Custom Domain
- Enable Vercel's Edge Network for global CDN
- Configure proper caching headers (already set in vercel.json)
- Use Vercel Analytics for performance monitoring

### Troubleshooting

#### Common Issues

1. **API Route Not Working**
   - Ensure `output: 'export'` is not set in next.config.ts
   - Check environment variables are set correctly
   - Verify email service credentials
   - Test API endpoint: `curl -X POST https://your-domain.com/api/waitlist -H "Content-Type: application/json" -d '{"email":"test@example.com","source":"hero"}'`

2. **Email Service Errors**
   - Check API key validity and format
   - Verify audience/list ID is correct
   - Test API key with service's API documentation
   - Check service-specific rate limits

3. **Build Failures**
   - Run `npm run deploy:validate` to check configuration
   - Ensure all dependencies are installed: `npm ci`
   - Check for TypeScript errors: `npm run build`
   - Verify environment variables for build-time usage

4. **Domain and SSL Issues**
   - Check DNS propagation: `dig your-domain.com`
   - Verify SSL certificate status in Vercel dashboard
   - Ensure domain is properly configured in Vercel
   - Wait 24-48 hours for DNS propagation

5. **Performance Issues**
   - Run Lighthouse audit to identify bottlenecks
   - Check image optimization settings
   - Verify CDN is working correctly
   - Monitor Core Web Vitals

#### Deployment Validation

Before deploying, always run:

```bash
# Validate configuration
npm run deploy:validate

# Test deployment pipeline
npm run deploy:test

# Build and validate
npm run deploy:build
```

#### Quick Deployment Checklist

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for a comprehensive pre-deployment and post-deployment checklist.

#### Support

- **Vercel Documentation:** https://vercel.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Email Service Documentation:** Check respective service docs
- **PataDoc Deployment Issues:** Use the deployment validation scripts and checklist