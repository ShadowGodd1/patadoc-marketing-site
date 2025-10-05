# Deployment Checklist

This checklist ensures a smooth deployment of the PataDoc Marketing Site to Vercel.

## Pre-Deployment Checklist

### 1. Environment Variables Setup ✅

- [ ] **Email Service Configuration**
  - [ ] `EMAIL_SERVICE_TYPE` set to `mailchimp` or `convertkit`
  - [ ] `EMAIL_SERVICE_API_KEY` configured with valid API key
  - [ ] `EMAIL_SERVICE_AUDIENCE_ID` set to correct list/audience ID

- [ ] **Site Configuration**
  - [ ] `NEXT_PUBLIC_SITE_URL` set to production domain (e.g., `https://patadoc.com`)
  - [ ] `NEXT_PUBLIC_GTM_CONTAINER_ID` configured (optional but recommended)

### 2. Code Quality Checks ✅

- [ ] Run deployment validation: `npm run deploy:validate`
- [ ] Run deployment tests: `npm run deploy:test`
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No ESLint errors

### 3. Build Verification ✅

- [ ] Local build successful: `npm run build`
- [ ] No build errors or warnings
- [ ] Static export working correctly
- [ ] API routes functioning

## Vercel Deployment Steps

### 1. Repository Setup

- [ ] Code pushed to main branch
- [ ] Repository connected to Vercel
- [ ] Automatic deployments enabled

### 2. Environment Variables in Vercel

Navigate to **Project Settings > Environment Variables** and add:

**Production Environment:**
```
EMAIL_SERVICE_TYPE=mailchimp
EMAIL_SERVICE_API_KEY=[your-mailchimp-api-key]
EMAIL_SERVICE_AUDIENCE_ID=[your-mailchimp-list-id]
NEXT_PUBLIC_SITE_URL=https://patadoc.com
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-W9CHQQN4
NODE_ENV=production
```

**Preview Environment:**
```
EMAIL_SERVICE_TYPE=mailchimp
EMAIL_SERVICE_API_KEY=[your-mailchimp-api-key]
EMAIL_SERVICE_AUDIENCE_ID=[your-mailchimp-list-id]
NEXT_PUBLIC_SITE_URL=https://patadoc-git-[branch].vercel.app
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-W9CHQQN4
NODE_ENV=preview
```

**Development Environment:**
```
EMAIL_SERVICE_TYPE=mailchimp
EMAIL_SERVICE_API_KEY=[your-mailchimp-api-key]
EMAIL_SERVICE_AUDIENCE_ID=[your-mailchimp-list-id]
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-W9CHQQN4
NODE_ENV=development
```

### 3. Domain Configuration

#### For patadoc.com:

1. **Add Domain in Vercel:**
   - Go to Project Settings > Domains
   - Add `patadoc.com` and `www.patadoc.com`

2. **DNS Configuration:**
   
   **Option A: Use Vercel Nameservers (Recommended)**
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
   
   **Option B: Manual DNS Records**
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL Certificate:**
   - Automatically provisioned by Vercel
   - Verify certificate status shows "Valid"

### 4. Deployment Verification

- [ ] **Build Success:** Deployment completed without errors
- [ ] **Domain Access:** Site accessible at https://patadoc.com
- [ ] **HTTPS Redirect:** HTTP automatically redirects to HTTPS
- [ ] **WWW Redirect:** www.patadoc.com redirects correctly
- [ ] **API Functionality:** Waitlist signup working
- [ ] **Analytics:** GTM events firing correctly
- [ ] **Performance:** Lighthouse score 90+ on mobile
- [ ] **SEO:** Meta tags and Open Graph working
- [ ] **Responsive:** Mobile and desktop layouts correct

## Post-Deployment Testing

### 1. Functional Testing

- [ ] **Waitlist Signup (Hero Section):**
  - [ ] Valid email submission works
  - [ ] Success message displays
  - [ ] Email added to marketing service
  - [ ] Analytics event fired

- [ ] **Waitlist Signup (Footer CTA):**
  - [ ] Valid email submission works
  - [ ] Success message displays
  - [ ] Email added to marketing service
  - [ ] Analytics event fired

- [ ] **Error Handling:**
  - [ ] Invalid email shows error
  - [ ] Network errors handled gracefully
  - [ ] Duplicate emails handled correctly

### 2. Performance Testing

- [ ] **Core Web Vitals:**
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1

- [ ] **Page Speed:**
  - [ ] Mobile Lighthouse score 90+
  - [ ] Desktop Lighthouse score 95+
  - [ ] Images loading optimally (WebP format)

### 3. Cross-Browser Testing

- [ ] **Desktop Browsers:**
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Edge (latest)

- [ ] **Mobile Browsers:**
  - [ ] iOS Safari
  - [ ] Chrome Mobile
  - [ ] Samsung Internet

### 4. SEO Verification

- [ ] **Meta Tags:**
  - [ ] Title tag correct
  - [ ] Meta description present
  - [ ] Open Graph tags working
  - [ ] Twitter Card tags working

- [ ] **Social Sharing:**
  - [ ] Facebook preview correct
  - [ ] Twitter preview correct
  - [ ] LinkedIn preview correct

## Monitoring Setup

### 1. Analytics Verification

- [ ] Google Tag Manager container loading
- [ ] Waitlist signup events firing
- [ ] Page view tracking working
- [ ] Custom events configured

### 2. Error Monitoring (Optional)

- [ ] Sentry or similar error tracking configured
- [ ] Error alerts set up
- [ ] Performance monitoring enabled

### 3. Uptime Monitoring (Optional)

- [ ] Uptime monitoring service configured
- [ ] Alert notifications set up
- [ ] Status page created (if needed)

## Rollback Plan

In case of deployment issues:

1. **Immediate Rollback:**
   ```bash
   vercel rollback [deployment-url] --token=[token]
   ```

2. **Environment Variable Issues:**
   - Check Vercel dashboard environment variables
   - Verify API keys are correct
   - Test email service connectivity

3. **Domain Issues:**
   - Verify DNS propagation: `dig patadoc.com`
   - Check SSL certificate status
   - Confirm domain configuration in Vercel

## Support Contacts

- **Vercel Support:** https://vercel.com/help
- **Email Service Support:** Check respective service documentation
- **DNS Provider Support:** Contact domain registrar

## Deployment Commands Reference

```bash
# Validate deployment configuration
npm run deploy:validate

# Test deployment pipeline
npm run deploy:test

# Build and validate
npm run deploy:build

# Deploy via CLI
vercel --prod

# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]
```

---

**Last Updated:** [Current Date]
**Deployment Version:** 1.0.0
**Environment:** Production