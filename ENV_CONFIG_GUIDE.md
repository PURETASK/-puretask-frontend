# 🔐 Environment Configuration Guide

## Overview
This guide explains how to configure environment variables for the PureTask frontend application.

---

## 📋 Setup Instructions

### 1. Create Environment File

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

### 2. Required Variables

These variables are **required** for the application to work:

```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Frontend Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3001

# WebSocket URL
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

### 3. Optional Variables

#### Payment Processing (Stripe)
```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```
Get your key from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

#### Analytics
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### Error Tracking
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project
```

#### Feature Flags
```env
NEXT_PUBLIC_ENABLE_REVIEWS=true
NEXT_PUBLIC_ENABLE_REFERRALS=true
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_RECURRING=true
```

---

## 🌍 Environment-Specific Configuration

### Development
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_BASE_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:4000
NODE_ENV=development
```

### Production
```env
NEXT_PUBLIC_API_BASE_URL=https://api.puretask.com
NEXT_PUBLIC_BASE_URL=https://puretask.com
NEXT_PUBLIC_WS_URL=wss://api.puretask.com
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_live_key
NODE_ENV=production
```

---

## 🔑 Variable Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | Backend API endpoint | `http://localhost:4000` |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Frontend URL | `http://localhost:3001` |
| `NEXT_PUBLIC_WS_URL` | ✅ | WebSocket endpoint | `ws://localhost:4000` |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | ⚠️ | Stripe publishable key | `pk_test_...` |
| `NEXT_PUBLIC_GA_ID` | ❌ | Google Analytics ID | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_SENTRY_DSN` | ❌ | Sentry error tracking | `https://...` |
| `NEXT_PUBLIC_ENABLE_REVIEWS` | ❌ | Enable reviews (default: true) | `true` |
| `NEXT_PUBLIC_ENABLE_REFERRALS` | ❌ | Enable referrals (default: true) | `true` |
| `NEXT_PUBLIC_ENABLE_CHAT` | ❌ | Enable chat (default: true) | `true` |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | ❌ | Google Maps API key | `AIza...` |

Legend:
- ✅ Required
- ⚠️ Required for feature
- ❌ Optional

---

## ⚠️ Important Notes

### Security
1. **Never commit `.env.local` to version control**
2. **Use test keys** (`pk_test_...`) in development
3. **Use live keys** (`pk_live_...`) in production only
4. **Rotate keys** if accidentally exposed

### Next.js Environment Variables
1. Variables with `NEXT_PUBLIC_` prefix are exposed to the browser
2. Variables without prefix are server-side only
3. Restart dev server after changing variables
4. Build process embeds variables at build time

### Deployment Platforms

#### Vercel
1. Go to Project Settings → Environment Variables
2. Add all `NEXT_PUBLIC_*` variables
3. Select appropriate environments (Production, Preview, Development)

#### Netlify
1. Go to Site Settings → Build & Deploy → Environment
2. Add all required variables
3. Redeploy site after adding variables

#### AWS Amplify
1. Go to App Settings → Environment Variables
2. Add variables in key-value format
3. Redeploy application

---

## 🧪 Testing Configuration

### Verify Environment Variables

Create a test page to verify variables are loaded:

```typescript
// src/app/env-test/page.tsx
export default function EnvTest() {
  return (
    <div>
      <h1>Environment Variables</h1>
      <ul>
        <li>API URL: {process.env.NEXT_PUBLIC_API_BASE_URL}</li>
        <li>Base URL: {process.env.NEXT_PUBLIC_BASE_URL}</li>
        <li>WS URL: {process.env.NEXT_PUBLIC_WS_URL}</li>
      </ul>
    </div>
  );
}
```

---

## 🔧 Troubleshooting

### Variables Not Loading
- Restart the dev server: `npm run dev`
- Check file is named exactly `.env.local`
- Verify variables have `NEXT_PUBLIC_` prefix for client-side

### API Connection Failed
- Verify backend is running
- Check `NEXT_PUBLIC_API_BASE_URL` matches backend port
- Check for CORS issues

### Build Errors
- Ensure all required variables are set
- Check for typos in variable names
- Verify values don't have quotes (unless needed)

---

## 📝 Example Complete Configuration

```env
# Required
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_BASE_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:4000

# Payments
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_51abc123xyz

# Optional
NEXT_PUBLIC_GA_ID=G-ABC123XYZ
NEXT_PUBLIC_ENABLE_REVIEWS=true
NEXT_PUBLIC_ENABLE_REFERRALS=true
NEXT_PUBLIC_ENABLE_CHAT=true

# Environment
NODE_ENV=development
```

---

## 🆘 Need Help?

- Review [Next.js Environment Variables Docs](https://nextjs.org/docs/basic-features/environment-variables)
- Check [Project Documentation](./PROJECT_DOCUMENTATION.md)
- Contact: dev@puretask.com

