# 🚀 PureTask Testing Suite - Quick Start Guide

**Get started testing PureTask in 5 minutes!**

---

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- Both backend and frontend repositories cloned

---

## ⚡ Quick Setup (Copy & Paste)

### Option 1: Automatic Setup (Recommended)

```powershell
# Navigate to frontend directory
cd C:\Users\onlyw\Documents\GitHub\puretask-frontend

# Run automated setup script
.\setup-testing.ps1
```

This will automatically:
- Install all testing dependencies
- Create test directory structure
- Configure Jest and Playwright
- Install browser binaries

### Option 2: Manual Setup

**Backend Setup:**
```bash
cd puretask-backend

# Install testing dependencies
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest @faker-js/faker nock @types/nock jest-mock-extended

# Create jest.config.js (already created for you)
```

**Frontend Setup:**
```bash
cd puretask-frontend

# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event msw jest-axe

# Install Playwright
npm install --save-dev @playwright/test
npx playwright install
```

---

## 🧪 Running Your First Tests

### 1. Backend Tests

```bash
cd C:\Users\onlyw\Documents\GitHub\puretask-backend

# Run all tests
npm test

# Expected output:
# PASS  src/__tests__/integration/api/auth.test.ts
# PASS  src/__tests__/unit/services/authService.test.ts
# Test Suites: 2 passed, 2 total
# Tests:       15 passed, 15 total
```

### 2. Frontend Tests

```bash
cd C:\Users\onlyw\Documents\GitHub\puretask-frontend

# Run all tests
npm test

# Expected output:
# PASS  src/__tests__/unit/components/ui/Button.test.tsx
# PASS  src/__tests__/integration/pages/login.test.tsx
# Test Suites: 2 passed, 2 total
# Tests:       12 passed, 12 total
```

### 3. E2E Tests

```bash
cd C:\Users\onlyw\Documents\GitHub\puretask-frontend

# Make sure servers are running first:
# Terminal 1: cd ..\puretask-backend && npm run dev
# Terminal 2: cd puretask-frontend && npm run dev

# Terminal 3: Run E2E tests
npm run test:e2e

# Expected output:
# Running 10 tests using 3 workers
# ✓ [chromium] › auth/login.spec.ts:5:7 › Login Flow › should display login form (1s)
# All tests passed!
```

---

## 📊 Viewing Coverage Reports

```bash
# Backend coverage
cd puretask-backend
npm run test:coverage
# Open: coverage/lcov-report/index.html in browser

# Frontend coverage
cd puretask-frontend
npm run test:coverage
# Open: coverage/lcov-report/index.html in browser
```

---

## 🎯 Common Testing Scenarios

### Test 1: Verify Authentication Works
```bash
cd puretask-backend
npm test -- auth.test.ts
```

### Test 2: Test a Specific Component
```bash
cd puretask-frontend
npm test -- Button.test.tsx
```

### Test 3: Run Tests in Watch Mode (for TDD)
```bash
# Backend
cd puretask-backend
npm test -- --watch

# Frontend
cd puretask-frontend
npm test -- --watch
```

### Test 4: Debug E2E Test
```bash
cd puretask-frontend
npx playwright test --debug auth/login.spec.ts
```

---

## 📁 Test File Locations

### Backend Tests:
```
puretask-backend/src/__tests__/
├── unit/              # Fast unit tests
├── integration/       # API endpoint tests
├── security/          # Security tests
└── performance/       # Load tests
```

### Frontend Tests:
```
puretask-frontend/
├── src/__tests__/     # Unit & integration tests
└── tests/e2e/         # E2E Playwright tests
```

---

## 🔥 Most Used Commands

```bash
# Backend
npm test                    # Run all tests
npm run test:coverage       # With coverage
npm test -- --watch         # Watch mode
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only

# Frontend
npm test                    # Run all tests
npm run test:coverage       # With coverage
npm test -- --watch         # Watch mode
npm run test:e2e            # E2E tests
npm run test:e2e:headed     # E2E with visible browser
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Database connection failed"
**Solution:**
- Check your `.env` file has correct DATABASE_URL
- Ensure database is running
- Try: `npm run db:migrate`

### Issue: "Playwright browsers not installed"
**Solution:**
```bash
cd puretask-frontend
npx playwright install
```

### Issue: "Port already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Kill and restart servers
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Backend tests run: `cd puretask-backend && npm test`
- [ ] Frontend tests run: `cd puretask-frontend && npm test`
- [ ] E2E tests run: `npm run test:e2e` (with servers running)
- [ ] Coverage reports generate: `npm run test:coverage`
- [ ] Watch mode works: `npm test -- --watch`

---

## 📚 Next Steps

1. **Read Documentation:**
   - `TESTING_ARCHITECTURE.md` - Understand the testing philosophy
   - `TEST_SUITE_INDEX.md` - See all available tests
   - `TEST_SUITE_COMPLETE.md` - Complete overview

2. **Write Your First Test:**
   - Create a file in `src/__tests__/unit/`
   - Follow the examples in existing test files
   - Run it with `npm test -- your-file.test.ts`

3. **Set Up CI/CD:**
   - Copy `.github-workflows-ci.yml` to `.github/workflows/ci.yml`
   - Push to GitHub
   - Tests will run automatically on every commit

4. **Monitor Coverage:**
   - Sign up for Codecov.io
   - Connect your GitHub repository
   - Get coverage badges and reports

---

## 🎓 Learning Resources

### Test Examples:
- **Simple Component Test:** `src/__tests__/unit/components/ui/Button.test.tsx`
- **API Integration Test:** `src/__tests__/integration/api/auth.test.ts`
- **E2E Test:** `tests/e2e/auth/login.spec.ts`
- **Security Test:** `src/__tests__/security/auth.test.ts`

### Documentation:
- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Docs](https://playwright.dev/)

---

## 💡 Pro Tips

1. **Run tests frequently** - Catch bugs early
2. **Use watch mode** - Instant feedback during development
3. **Write tests first** - TDD makes better code
4. **Keep tests simple** - One assertion per test when possible
5. **Mock external services** - Tests should be fast and isolated

---

## 🆘 Getting Help

1. **Check Documentation:**
   - `TESTING_ARCHITECTURE.md` - Architecture details
   - `TEST_SUITE_INDEX.md` - All test files
   - `TESTING_CHECKLIST.md` - Testing checklist

2. **Review Examples:**
   - Look at existing test files
   - Follow the patterns used

3. **Common Issues:**
   - Most issues are dependency-related
   - Try `npm install` first
   - Check `.env` configuration

---

## 🎉 You're Ready!

**Your testing suite is now set up and ready to use!**

Start with:
```bash
cd puretask-backend && npm test
```

If all tests pass, you're good to go! 🚀

---

**Happy Testing!** 🧪

*Last Updated: January 11, 2026*

