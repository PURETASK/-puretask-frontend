# PureTask Frontend

Professional cleaning services platform - Frontend application built with Next.js, React, and TypeScript.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:3001
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── (client)/          # Client-facing pages
│   ├── (cleaner)/         # Cleaner-facing pages
│   ├── (admin)/           # Admin pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── features/         # Feature-specific components
│   ├── layout/           # Layout components
│   └── forms/            # Form components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
│   ├── api.ts           # API client
│   ├── validation/      # Validation schemas
│   ├── analytics.ts     # Analytics utilities
│   └── errorTracking.ts # Error tracking
├── services/            # API service functions
├── contexts/            # React contexts
└── styles/              # Global styles
```

## 🧩 Key Features

### Components

- **Loading States**: Skeleton loaders, spinners, progress bars
- **Error Handling**: Error displays, retry buttons
- **Forms**: Validated form fields with Zod
- **Navigation**: Mobile nav, bottom nav
- **Maps**: Google Maps integration
- **File Upload**: Drag & drop file uploads
- **Date/Time Pickers**: Custom date and time selection
- **Notifications**: Notification center with unread badges
- **Onboarding**: Multi-step onboarding wizard
- **Dark Mode**: System preference detection

### Utilities

- **Analytics**: Google Analytics integration
- **Error Tracking**: Sentry-ready error tracking
- **SEO**: Metadata generation, structured data
- **Validation**: Zod schemas for all forms
- **Retry Logic**: Exponential backoff retry

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📊 Audits

```bash
# Run accessibility audit
npm run audit:a11y

# Run performance audit
npm run audit:perf

# Run all audits
npm run audit:all
```

## 🚢 Deployment

The app is configured to deploy to Railway. The CI/CD pipeline runs on push to main branch.

### Environment Variables

Required environment variables:

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID (optional)
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN (optional)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key (optional)

## 📚 Documentation

- [Component Documentation](./docs/components.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

Proprietary - All rights reserved
