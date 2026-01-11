# 🚀 DEPLOYMENT GUIDE - PureTask Platform

**Version:** 1.0.0  
**Last Updated:** January 10, 2026

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Vercel Deployment (Recommended)](#vercel-deployment)
4. [Netlify Deployment](#netlify-deployment)
5. [AWS Amplify Deployment](#aws-amplify-deployment)
6. [Self-Hosted Deployment](#self-hosted-deployment)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## ✅ PREREQUISITES

### Required
- [x] Backend API deployed and accessible
- [x] Database setup and migrations run
- [x] Domain name purchased (optional but recommended)
- [x] Stripe account with live keys
- [x] Git repository (GitHub/GitLab/Bitbucket)

### Recommended
- [x] Email service configured (SendGrid, Mailgun)
- [x] Error tracking setup (Sentry)
- [x] Analytics account (Google Analytics)
- [x] CDN configured (often included with hosting)

---

## 🎯 DEPLOYMENT OPTIONS

| Platform | Difficulty | Cost | Best For |
|----------|------------|------|----------|
| **Vercel** | ⭐ Easy | Free/Pro | Next.js apps (Recommended) |
| **Netlify** | ⭐ Easy | Free/Pro | Static sites & Next.js |
| **AWS Amplify** | ⭐⭐ Medium | Pay-as-you-go | AWS ecosystem |
| **Self-Hosted** | ⭐⭐⭐ Hard | Variable | Full control |

**Recommendation:** Use **Vercel** for the easiest deployment with best Next.js support.

---

## 🚀 VERCEL DEPLOYMENT (RECOMMENDED)

### Why Vercel?
- ✅ Built by Next.js creators
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Preview deployments
- ✅ Free tier available

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Verify `.gitignore` includes:**
```
node_modules
.next
.env.local
.DS_Store
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your repositories

### Step 3: Import Project

1. Click "Add New..." → "Project"
2. Select your `puretask-frontend` repository
3. Click "Import"

### Step 4: Configure Project

**Framework Preset:** Next.js (auto-detected)

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
npm install
```

### Step 5: Environment Variables

Click "Environment Variables" and add:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_live_key
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
```

**Important:** Use your production URLs and live keys!

### Step 6: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Vercel will provide a URL: `your-project.vercel.app`

### Step 7: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain: `yourdomain.com`
3. Follow DNS configuration instructions
4. Add DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
5. Wait for DNS propagation (5-60 minutes)
6. Vercel auto-configures SSL

### Step 8: Verify Deployment

1. Visit your deployed URL
2. Test login functionality
3. Test booking creation
4. Check console for errors
5. Verify API connection

---

## 🌐 NETLIFY DEPLOYMENT

### Step 1: Prepare Repository

Same as Vercel - push code to GitHub

### Step 2: Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Authorize Netlify

### Step 3: Create New Site

1. Click "Add new site" → "Import an existing project"
2. Choose GitHub
3. Select `puretask-frontend` repository

### Step 4: Build Settings

**Build command:**
```bash
npm run build
```

**Publish directory:**
```
.next
```

**Base directory:**
```
(leave empty)
```

### Step 5: Environment Variables

Go to Site settings → Environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_key
```

### Step 6: Deploy

1. Click "Deploy site"
2. Wait for build (3-7 minutes)
3. Get URL: `random-name.netlify.app`

### Step 7: Custom Domain

1. Go to Domain settings
2. Add custom domain
3. Follow DNS instructions
4. SSL is automatic

---

## ☁️ AWS AMPLIFY DEPLOYMENT

### Step 1: AWS Account Setup

1. Create AWS account
2. Go to AWS Amplify console
3. Click "Get Started" under "Host your web app"

### Step 2: Connect Repository

1. Choose "GitHub"
2. Authorize AWS Amplify
3. Select repository and branch

### Step 3: Build Settings

Amplify auto-detects Next.js. Verify:

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
```

### Step 4: Environment Variables

Add in Build settings:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_key
```

### Step 5: Deploy

1. Click "Save and deploy"
2. Build process starts automatically
3. Get URL: `random.amplifyapp.com`

### Step 6: Custom Domain

1. Go to Domain management
2. Add domain
3. Follow DNS configuration
4. SSL is automatic

---

## 🖥 SELF-HOSTED DEPLOYMENT

### Option 1: Docker (Recommended)

**Create `Dockerfile`:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Create `docker-compose.yml`:**
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
      - NEXT_PUBLIC_BASE_URL=https://yourdomain.com
      - NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
      - NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_key
    restart: always
```

**Deploy:**
```bash
docker-compose up -d
```

### Option 2: Traditional Server (Ubuntu)

**1. Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**2. Clone and Setup:**
```bash
cd /var/www
git clone https://github.com/your-org/puretask-frontend.git
cd puretask-frontend
npm install
```

**3. Create `.env.production`:**
```bash
nano .env.production
# Add all environment variables
```

**4. Build:**
```bash
npm run build
```

**5. Setup PM2:**
```bash
sudo npm install -g pm2
pm2 start npm --name "puretask-frontend" -- start
pm2 startup
pm2 save
```

**6. Setup Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**7. SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## ✅ POST-DEPLOYMENT

### Immediate Checks (First 30 Minutes)

1. **Verify Site is Live:**
   - Visit your domain
   - Check HTTPS is working
   - Verify no certificate errors

2. **Test Core Features:**
   - User registration
   - User login
   - Create a test booking
   - Send a test message
   - Check admin panel

3. **Monitor Errors:**
   - Check browser console
   - Check Sentry (if configured)
   - Check server logs

4. **Performance Check:**
   - Run Google PageSpeed Insights
   - Check Lighthouse scores
   - Verify images load quickly

### First 24 Hours

1. **Monitor continuously:**
   - Error rates
   - User signups
   - Booking conversions
   - API response times

2. **User Feedback:**
   - Watch for support tickets
   - Monitor social media
   - Check email responses

3. **Database:**
   - Monitor connections
   - Check query performance
   - Verify backups running

### First Week

1. **Analytics Review:**
   - User acquisition
   - Conversion rates
   - Popular pages
   - Bounce rates

2. **Performance:**
   - Identify slow endpoints
   - Optimize if needed
   - Check CDN effectiveness

3. **Bug Fixes:**
   - Prioritize critical bugs
   - Deploy hotfixes as needed
   - Document issues

---

## 🐛 TROUBLESHOOTING

### Build Fails

**Issue:** Build command fails

**Solutions:**
1. Check Node version (should be 18+)
2. Verify all dependencies installed
3. Check for TypeScript errors
4. Review build logs for specific errors

```bash
# Local test
npm run build

# Check Node version
node --version
```

### Environment Variables Not Working

**Issue:** API calls fail, features broken

**Solutions:**
1. Verify all `NEXT_PUBLIC_*` variables set
2. Restart deployment after adding variables
3. Check variable names are exact
4. Verify no typos in values

### API Connection Errors

**Issue:** "Failed to fetch" errors

**Solutions:**
1. Verify backend is running
2. Check CORS settings on backend
3. Verify API URL is correct
4. Check SSL certificate on API
5. Test API directly with curl

```bash
curl https://api.yourdomain.com/health
```

### WebSocket Connection Fails

**Issue:** Real-time features not working

**Solutions:**
1. Verify WebSocket URL is correct
2. Use `wss://` for HTTPS sites
3. Check firewall rules
4. Verify backend WebSocket server running

### Stripe Payments Not Working

**Issue:** Payment processing fails

**Solutions:**
1. Verify using live keys (pk_live_...)
2. Check Stripe dashboard for errors
3. Verify webhook endpoints configured
4. Test with Stripe test cards first

### Performance Issues

**Issue:** Site loads slowly

**Solutions:**
1. Enable caching headers
2. Optimize images
3. Use CDN for assets
4. Enable compression
5. Check API response times

---

## 📝 DEPLOYMENT CHECKLIST

Before marking deployment as complete:

- [ ] Site is accessible via HTTPS
- [ ] Custom domain configured (if applicable)
- [ ] All environment variables set
- [ ] Login/Registration working
- [ ] Booking flow tested
- [ ] Payments processing (test mode)
- [ ] Real-time messaging working
- [ ] Admin panel accessible
- [ ] Error tracking active
- [ ] Analytics tracking
- [ ] Performance acceptable
- [ ] Mobile responsive verified
- [ ] No console errors
- [ ] Backup strategy in place
- [ ] Monitoring configured

---

## 🆘 SUPPORT

### Documentation
- [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)
- [ENV_CONFIG_GUIDE.md](./ENV_CONFIG_GUIDE.md)
- [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)
- [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)

### Platform Support
- **Vercel:** [vercel.com/support](https://vercel.com/support)
- **Netlify:** [netlify.com/support](https://netlify.com/support)
- **AWS:** [aws.amazon.com/support](https://aws.amazon.com/support)

### Emergency Contacts
- **Project Lead:** _______________
- **DevOps:** _______________
- **Backend Team:** _______________

---

## 🎉 CONGRATULATIONS!

Your PureTask platform is now deployed and live! 🚀

**Next steps:**
1. Complete [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)
2. Monitor for first 24-48 hours
3. Gather user feedback
4. Plan feature iterations

**Happy launching! 🎊**

