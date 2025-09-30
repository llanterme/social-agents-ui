# AWS Amplify Deployment Guide

## Overview
This guide walks you through deploying the AI Content Generation Frontend to AWS Amplify.

## Prerequisites
- AWS Account
- Your backend API deployed and accessible (e.g., `https://your-api.com`)
- GitHub account (recommended) or ability to upload code to AWS

## Step 1: Prepare Your Repository

### 1.1 Ensure Clean Build
```bash
# Test the build locally
npm install
npm run build
```

The build should complete without errors. We've already fixed ESLint issues and configured the project for deployment.

### 1.2 Environment Variables
The following environment variables need to be configured in AWS Amplify:

- `NEXT_PUBLIC_API_URL` - Your backend API URL (e.g., `https://your-backend-api.com`)
- `NODE_ENV` - Set to `production`
- `NEXT_PUBLIC_DEBUG` - Set to `false` for production

## Step 2: Deploy to AWS Amplify

### Option A: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for AWS Amplify deployment"
   git push origin main
   ```

2. **Create Amplify App**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "New app" → "Host web app"
   - Choose "GitHub" as your repository service
   - Authorize AWS Amplify to access your GitHub account
   - Select your repository and branch (usually `main` or `master`)

3. **Configure Build Settings**
   - Amplify will auto-detect Next.js and use the `amplify.yml` file we created
   - Review the build settings (should match our `amplify.yml`)

4. **Configure Environment Variables**
   - In the Amplify Console, go to your app
   - Navigate to "Environment variables" in the left sidebar
   - Add the following variables:
     ```
     NEXT_PUBLIC_API_URL = https://your-backend-api.com
     NODE_ENV = production
     NEXT_PUBLIC_DEBUG = false
     ```

5. **Deploy**
   - Click "Save and deploy"
   - Amplify will build and deploy your application
   - Wait for the deployment to complete (5-10 minutes)

### Option B: Manual Deploy (ZIP Upload)

1. **Build the project locally**
   ```bash
   npm install
   npm run build
   ```

2. **Create a ZIP file**
   - Include all files except `node_modules` and `.git`
   - Include the `.next` directory

3. **Deploy to Amplify**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Choose "Deploy without Git provider"
   - Upload your ZIP file
   - Configure environment variables as shown above

## Step 3: Configure Custom Domain (Optional)

1. **In Amplify Console**
   - Go to your app → "Domain management"
   - Click "Add domain"
   - Follow the instructions to add your custom domain

2. **Update Environment Variables**
   - If using a custom domain, ensure CORS is configured on your backend
   - Update any callback URLs for OAuth (LinkedIn) to use your new domain

## Step 4: Post-Deployment Configuration

### 4.1 Update Backend CORS Settings
Ensure your backend API allows requests from your Amplify domain:
- Default domain: `https://[branch].[app-id].amplifyapp.com`
- Custom domain: `https://your-domain.com`

### 4.2 Update OAuth Redirect URLs
If using LinkedIn OAuth, update the redirect URL in your LinkedIn app settings:
- Add: `https://your-amplify-domain.com/settings/connections`

### 4.3 Test the Deployment
1. Visit your Amplify URL
2. Test user registration and login
3. Test content generation
4. Verify image loading
5. Test LinkedIn connection (if applicable)

## Monitoring and Maintenance

### View Logs
- In Amplify Console → "Monitoring" → "Logs"
- Check both build logs and runtime logs

### Update Deployment
Any push to your connected branch will trigger automatic deployment:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Manual Redeploy
- In Amplify Console → Click "Redeploy this version"

## Troubleshooting

### Build Failures
1. **ESLint errors**: Check `.eslintrc.json` configuration
2. **Missing dependencies**: Ensure all packages are in `package.json`
3. **Environment variables**: Verify all required variables are set

### Runtime Issues
1. **API connection failed**:
   - Check `NEXT_PUBLIC_API_URL` is correct
   - Verify backend is running and accessible
   - Check CORS configuration

2. **Images not loading**:
   - Verify image domains are configured in `next.config.js`
   - Check backend image serving configuration

3. **Authentication issues**:
   - Ensure backend JWT configuration matches
   - Check token expiry settings

### Common Environment Variables Issues

```bash
# Development (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8080

# Production (AWS Amplify Environment Variables)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Build Configuration Reference

The `amplify.yml` file configures the build process:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

## Security Considerations

1. **Environment Variables**
   - Never commit `.env.local` or `.env` files
   - Use AWS Amplify environment variables for sensitive data

2. **API Security**
   - Ensure your backend API uses HTTPS
   - Implement proper rate limiting
   - Use secure JWT tokens with appropriate expiry

3. **Content Security Policy**
   - Consider adding CSP headers for production
   - Configure in `next.config.js` or via AWS CloudFront

## Performance Optimization

1. **Enable Caching**
   - Amplify automatically caches static assets
   - Configure cache headers for API responses

2. **Image Optimization**
   - Next.js Image component handles optimization
   - Ensure CDN is configured for image delivery

3. **Code Splitting**
   - Next.js automatically code-splits
   - Monitor bundle sizes in build output

## Cost Considerations

AWS Amplify pricing includes:
- Build minutes (usually within free tier)
- Hosting (based on storage and bandwidth)
- Additional features (custom domains, etc.)

Monitor usage in AWS Console → Billing Dashboard

## Support and Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Next.js on AWS Amplify](https://docs.amplify.aws/guides/hosting/nextjs/q/platform/js/)
- [Project README](./README.md)
- [Backend Integration Guide](./FRONTEND_INTEGRATION.md)

## Quick Checklist

Before deploying:
- [ ] Local build succeeds (`npm run build`)
- [ ] Environment variables documented
- [ ] Backend API is accessible
- [ ] CORS configured on backend
- [ ] OAuth redirect URLs updated (if applicable)

After deploying:
- [ ] Application loads correctly
- [ ] Authentication works
- [ ] Content generation works
- [ ] Images load properly
- [ ] LinkedIn integration works (if applicable)
- [ ] Monitor initial performance and errors

## Contact

For issues specific to this application, refer to the project documentation or contact your development team.