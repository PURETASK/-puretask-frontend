# 🏠 PureTask - Complete Project Documentation

**Version:** 1.0.0  
**Last Updated:** January 10, 2026  
**Status:** Production Ready ✅

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Available Scripts](#available-scripts)
7. [Features](#features)
8. [Pages & Routes](#pages--routes)
9. [Components](#components)
10. [API Integration](#api-integration)
11. [State Management](#state-management)
12. [Authentication & Authorization](#authentication--authorization)
13. [Testing](#testing)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**PureTask** is a modern, full-featured cleaning service marketplace that connects clients with professional cleaners. The platform provides a seamless booking experience, real-time communication, secure payments, and comprehensive management tools.

### Key Capabilities:
- **For Clients:** Find, book, and manage cleaning services
- **For Cleaners:** Receive bookings, manage schedule, track earnings
- **For Admins:** Oversee platform operations, manage users, handle finances

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Query (TanStack Query) + Context API
- **Real-time:** Socket.IO Client
- **HTTP Client:** Axios
- **Date Handling:** date-fns
- **Icons:** Lucide React
- **Notifications:** Custom Toast System

### Backend (Separate Repository)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Authentication:** JWT
- **Real-time:** Socket.IO
- **Payments:** Stripe
- **File Storage:** AWS S3 (planned)

---

## 📁 Project Structure

```
puretask-frontend/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── admin/                    # Admin panel pages
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── bookings/
│   │   │   ├── finance/
│   │   │   └── settings/
│   │   ├── client/                   # Client pages
│   │   │   ├── dashboard/
│   │   │   ├── bookings/
│   │   │   └── settings/
│   │   ├── cleaner/                  # Cleaner pages
│   │   │   ├── dashboard/
│   │   │   └── bookings/
│   │   ├── booking/                  # Booking flow
│   │   ├── messages/                 # Real-time chat
│   │   ├── search/                   # Find cleaners
│   │   ├── favorites/                # Saved cleaners
│   │   ├── referral/                 # Referral program
│   │   ├── help/                     # Help center
│   │   ├── terms/                    # Terms of service
│   │   ├── privacy/                  # Privacy policy
│   │   ├── error.tsx                 # Error boundary
│   │   ├── not-found.tsx             # 404 page
│   │   └── layout.tsx                # Root layout
│   ├── components/
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Charts.tsx
│   │   │   └── ...
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── features/                 # Feature-specific components
│   │   │   ├── booking/
│   │   │   ├── dashboard/
│   │   │   ├── messaging/
│   │   │   ├── profile/
│   │   │   ├── reviews/
│   │   │   └── search/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx
│   │   └── error/
│   │       └── ErrorBoundary.tsx
│   ├── contexts/                     # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── ToastContext.tsx
│   │   ├── WebSocketContext.tsx
│   │   └── NotificationContext.tsx
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useBookings.ts
│   │   ├── useCleaners.ts
│   │   ├── useMessages.ts
│   │   ├── useProfile.ts
│   │   ├── useAdmin.ts
│   │   └── ...
│   ├── services/                     # API service layer
│   │   ├── auth.service.ts
│   │   ├── booking.service.ts
│   │   ├── cleaner.service.ts
│   │   ├── message.service.ts
│   │   ├── profile.service.ts
│   │   ├── admin.service.ts
│   │   └── ...
│   ├── lib/                          # Utilities & config
│   │   ├── api.ts                    # Axios configuration
│   │   ├── config.ts                 # Environment config
│   │   ├── utils.ts                  # Utility functions
│   │   └── seo.ts                    # SEO metadata
│   └── styles/
│       └── globals.css               # Global styles
├── public/                           # Static assets
├── .env.local                        # Environment variables (local)
├── .env.example                      # Environment template
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend server running (see backend repository)
- PostgreSQL database (Neon recommended)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/puretask-frontend.git
cd puretask-frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration (see Environment Variables section)

4. **Start development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:3001`

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_BASE_URL=http://localhost:3001

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:4000

# Stripe (Client-side)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key_here

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_REVIEWS=true
NEXT_PUBLIC_ENABLE_REFERRALS=true
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 3001)
npm run dev:clean        # Clean cache and start dev server

# Building
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # Check TypeScript types

# Testing (when configured)
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

---

## ✨ Features

### Core Features
- ✅ User authentication (JWT-based)
- ✅ Role-based access control (Client, Cleaner, Admin)
- ✅ Real-time messaging (Socket.IO)
- ✅ Real-time notifications
- ✅ Multi-step booking flow
- ✅ Payment processing (Stripe ready)
- ✅ Review & rating system
- ✅ Search & filter cleaners
- ✅ Recurring bookings
- ✅ Favorites system
- ✅ Referral program

### Admin Features
- ✅ Dashboard analytics
- ✅ User management
- ✅ Booking oversight
- ✅ Financial management
- ✅ Transaction processing
- ✅ System settings

### Advanced Features
- ✅ Help center with FAQs
- ✅ Legal pages (Terms, Privacy)
- ✅ Error handling (404, error boundary)
- ✅ SEO optimization
- ✅ Responsive design
- ✅ Loading states
- ✅ Toast notifications

---

## 🗺 Pages & Routes

### Public Routes
| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/search` | Find cleaners |
| `/help` | Help center & FAQs |
| `/terms` | Terms of service |
| `/privacy` | Privacy policy |

### Authentication Routes
| Route | Description |
|-------|-------------|
| `/auth/login` | User login |
| `/auth/register` | User registration |
| `/auth/forgot-password` | Password reset |

### Client Routes (Protected)
| Route | Description |
|-------|-------------|
| `/client/dashboard` | Client dashboard |
| `/client/bookings` | Manage bookings |
| `/client/settings` | Account settings |
| `/favorites` | Saved cleaners |
| `/referral` | Referral program |

### Cleaner Routes (Protected)
| Route | Description |
|-------|-------------|
| `/cleaner/dashboard` | Cleaner dashboard |
| `/cleaner/bookings` | Job management |
| `/cleaner/schedule` | Schedule view |

### Shared Routes (Protected)
| Route | Description |
|-------|-------------|
| `/booking?cleaner=:id` | Book a service |
| `/messages` | Real-time chat |

### Admin Routes (Admin Only)
| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Admin dashboard |
| `/admin/users` | User management |
| `/admin/bookings` | Booking oversight |
| `/admin/finance` | Financial management |
| `/admin/settings` | System settings |

---

## 🧩 Components

### UI Components (`src/components/ui/`)
- `Button` - Primary, secondary, outline, ghost variants
- `Input` - Text, email, password, number inputs
- `Card` - Container with header/content sections
- `Badge` - Status indicators
- `Avatar` - User profile images
- `Modal` - Overlay dialogs
- `Charts` - Line, Bar, Pie, Donut charts
- `Loading` - Loading spinners
- `Rating` - Star rating display
- `Toggle` - Switch components
- `Tabs` - Tab navigation
- `Table` - Data tables
- `Tooltip` - Hover information

### Feature Components (`src/components/features/`)
- **Booking:** DateTimePicker, ServiceSelection, RecurringBooking
- **Dashboard:** StatsOverview, ActivityFeed, BookingCard
- **Messaging:** ChatWindow
- **Reviews:** ReviewList, ReviewForm, ReviewSummary
- **Search:** SearchFilters, CleanerCard
- **Profile:** ProfileEditForm, ChangePasswordForm
- **Notifications:** NotificationBell

---

## 🔌 API Integration

### API Client Configuration
Located in `src/lib/api.ts`, uses Axios with:
- Base URL from environment
- JWT token interceptor
- Error handling
- Request/response transformers

### Service Layer
Each feature has a dedicated service file:
- `auth.service.ts` - Authentication
- `booking.service.ts` - Bookings
- `cleaner.service.ts` - Cleaner operations
- `message.service.ts` - Messaging
- `admin.service.ts` - Admin operations

### React Query Hooks
Custom hooks in `src/hooks/` provide:
- Automatic caching
- Background refetching
- Loading/error states
- Optimistic updates
- Query invalidation

---

## 📊 State Management

### React Query (TanStack Query)
Used for server state management:
- API data caching
- Background updates
- Pagination
- Infinite scroll (ready)

### React Context API
Used for global client state:
- `AuthContext` - User authentication
- `ToastContext` - Notifications
- `WebSocketContext` - Real-time connections
- `NotificationContext` - Push notifications

---

## 🔒 Authentication & Authorization

### Flow
1. User logs in via `/auth/login`
2. JWT token received and stored in localStorage
3. Token attached to all API requests
4. `AuthContext` provides auth state globally

### Protected Routes
`ProtectedRoute` component handles:
- Authentication check
- Role-based access
- Automatic redirects
- Loading states

### Usage
```typescript
<ProtectedRoute requiredRole="client">
  <ClientDashboard />
</ProtectedRoute>
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login/Logout flow
- [ ] Client booking flow (4 steps)
- [ ] Real-time messaging
- [ ] Admin user management
- [ ] Payment flow (when configured)
- [ ] Responsive design on mobile
- [ ] Error handling (404, errors)

### API Integration Test
Visit `/api-test` to verify:
- Backend connectivity
- Authentication
- Service endpoints

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Other Platforms
- **Netlify:** Compatible with Next.js
- **AWS Amplify:** Full Next.js support
- **Self-hosted:** Use `npm run build` + `npm start`

### Pre-Deployment Checklist
- [ ] Environment variables configured
- [ ] Backend URL updated
- [ ] Stripe keys (production)
- [ ] SEO metadata verified
- [ ] Error tracking configured
- [ ] Analytics enabled

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3001
npx kill-port 3001
npm run dev
```

**Backend connection failed:**
- Verify backend is running on port 4000
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`

**Build errors:**
```bash
# Clean Next.js cache
rm -rf .next
npm run dev
```

**Type errors:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Support

- **Documentation:** This file
- **Issues:** GitHub Issues
- **Email:** dev@puretask.com

---

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ by the PureTask Team**

