# 🧪 Interactive Testing Guide - PureTask Platform

**Start Date:** January 10, 2026  
**Status:** Testing in Progress  

---

## ✅ COMPLETED TESTS

### Phase 1: Infrastructure ✅
- ✅ Backend server running (http://localhost:4000)
- ✅ Frontend server running (http://localhost:3001)
- ✅ Database connected (PostgreSQL via Neon)
- ✅ API health check passed

### Phase 2: Authentication API ✅
- ✅ Registration API working
- ✅ Login API working
- ✅ Test accounts created

---

## 🎯 CURRENT PHASE: Authentication UI Testing

### Test Accounts Available:
- **Client:** `client@test.com` / `TestPass123!`
- **Cleaner:** `cleaner@test.com` / `TestPass123!`

---

## 📝 TEST 1: Login Flow (CLIENT)

### Steps:
1. **Open browser:** http://localhost:3001/auth/login

2. **Enter credentials:**
   - Email: `client@test.com`
   - Password: `TestPass123!`

3. **Click "Login" button**

### Expected Results:
- ✅ Success toast notification appears
- ✅ Redirect to `/client/dashboard`
- ✅ Dashboard shows client data
- ✅ Header shows user avatar/name
- ✅ Navigation menu appears

### What to Report:
- [ ] Did login succeed?
- [ ] Where were you redirected?
- [ ] Any error messages?
- [ ] Does the dashboard load correctly?

---

## 📝 TEST 2: Login Flow (CLEANER)

### Steps:
1. **Logout** (click logout in header menu)

2. **Navigate to:** http://localhost:3001/auth/login

3. **Enter credentials:**
   - Email: `cleaner@test.com`
   - Password: `TestPass123!`

4. **Click "Login" button**

### Expected Results:
- ✅ Success toast notification
- ✅ Redirect to `/cleaner/dashboard`
- ✅ Cleaner-specific dashboard displays
- ✅ Different navigation menu (cleaner options)

### What to Report:
- [ ] Did login succeed?
- [ ] Is the cleaner dashboard different from client?
- [ ] Any issues?

---

## 📝 TEST 3: Protected Routes

### Steps:
1. **Logout completely**

2. **Try to access:** http://localhost:3001/client/dashboard

### Expected Results:
- ✅ Redirect to `/auth/login`
- ✅ Cannot access protected page without login

### What to Report:
- [ ] Were you redirected to login?
- [ ] Any error messages?

---

## 📝 TEST 4: Registration Flow

### Steps:
1. **Navigate to:** http://localhost:3001/auth/register

2. **Fill in form:**
   - Full Name: `New Test Client`
   - Email: `newclient@test.com`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
   - Role: **Client**

3. **Click "Register" or "Create Account"**

### Expected Results:
- ✅ Success message
- ✅ Auto-login and redirect to dashboard
- ✅ New account created in database

### What to Report:
- [ ] Did registration work?
- [ ] Were you auto-logged in?
- [ ] Any validation errors?

---

## 📝 TEST 5: Form Validation

### Steps:
1. **Go to registration page**

2. **Try to submit with:**
   - Invalid email: `notanemail`
   - Weak password: `123`
   - Mismatched passwords

### Expected Results:
- ✅ Form shows validation errors
- ✅ Cannot submit with invalid data
- ✅ Error messages are clear

### What to Report:
- [ ] Are validation messages showing?
- [ ] Are they clear and helpful?

---

## 📝 TEST 6: Logout Flow

### Steps:
1. **Login as client**
2. **Click logout button** (in header menu)

### Expected Results:
- ✅ Redirect to home or login
- ✅ Cannot access protected routes
- ✅ Token is cleared

### What to Report:
- [ ] Did logout work?
- [ ] Where were you redirected?

---

## 📝 TEST 7: Password Reset

### Steps:
1. **Navigate to:** http://localhost:3001/auth/forgot-password

2. **Enter email:** `client@test.com`

3. **Click "Send Reset Link"**

### Expected Results:
- ✅ Success message displayed
- ✅ API call successful
- ⚠️ Note: Email won't actually send in dev mode

### What to Report:
- [ ] Did the form submit successfully?
- [ ] Was there a success message?

---

## 🎨 NEXT TESTS: After Auth Testing

Once authentication is confirmed working:

### Phase 3: Core Features
1. **Search cleaners** (`/search`)
2. **View cleaner profile** (`/cleaner/[id]`)
3. **Create booking** (`/booking?cleanerId=X`)
4. **View bookings** (`/client/bookings`)
5. **Send messages** (`/messages`)

### Phase 4: Real-time Features
1. **WebSocket connection**
2. **Live notifications**
3. **Real-time chat**

### Phase 5: Admin Panel
1. **Admin login** (needs admin account)
2. **User management**
3. **System analytics**

---

## 🐛 BUG REPORTING FORMAT

If you find a bug, report it like this:

**Bug Title:** Login button doesn't work

**Steps to Reproduce:**
1. Go to login page
2. Enter credentials
3. Click login button

**Expected:** Should redirect to dashboard

**Actual:** Button does nothing, no error

**Console Errors:** (Press F12 > Console tab)
- [Copy any red errors here]

---

## 📊 TESTING PROGRESS

- ✅ Phase 1: Infrastructure (Complete)
- ⏳ Phase 2: Authentication (In Progress - Needs UI Testing)
- ⏳ Phase 3: Core Features (Pending)
- ⏳ Phase 4: Real-time (Pending)
- ⏳ Phase 5: Admin Panel (Pending)
- ⏳ Phase 6: UI/UX (Pending)
- ⏳ Phase 7: Performance (Pending)
- ⏳ Phase 8: Security (Pending)

---

## 🚀 QUICK START

**Right now, please test:**

1. **Login as Client:**
   - URL: http://localhost:3001/auth/login
   - Email: `client@test.com`
   - Password: `TestPass123!`

2. **Explore the dashboard**

3. **Report back what you see!**

Tell me:
- ✅ What works?
- ❌ What doesn't work?
- 🤔 Any questions or issues?

Then we'll move to the next tests! 🎯

