# 🧪 COMPREHENSIVE TESTING CHECKLIST

**Project:** PureTask Platform  
**Version:** 1.0.0  
**Date:** January 10, 2026

---

## 📋 PRE-TESTING SETUP

### Environment Verification
- [ ] Backend server is running (http://localhost:4000)
- [ ] Frontend server is running (http://localhost:3001)
- [ ] Database is connected and migrations are run
- [ ] Environment variables are configured
- [ ] WebSocket connection is enabled

### Test Accounts Setup
Create test accounts for each role:
- [ ] Client account (email: client@test.com)
- [ ] Cleaner account (email: cleaner@test.com)
- [ ] Admin account (email: admin@test.com)

---

## 🔐 AUTHENTICATION TESTS

### Registration Flow
- [ ] Navigate to `/auth/register`
- [ ] Register as Client
  - [ ] Fill in all required fields
  - [ ] Submit form
  - [ ] Verify success message
  - [ ] Verify redirect to dashboard
- [ ] Register as Cleaner
  - [ ] Fill in all required fields
  - [ ] Submit form
  - [ ] Verify success message
  - [ ] Verify redirect to cleaner dashboard
- [ ] Test validation errors
  - [ ] Empty email field
  - [ ] Invalid email format
  - [ ] Weak password
  - [ ] Password mismatch

### Login Flow
- [ ] Navigate to `/auth/login`
- [ ] Login with valid credentials
  - [ ] Verify success message
  - [ ] Verify redirect to appropriate dashboard
  - [ ] Verify token is stored
- [ ] Login with invalid credentials
  - [ ] Verify error message
  - [ ] Verify no redirect
- [ ] Test "Remember Me" (if implemented)

### Password Reset
- [ ] Navigate to `/auth/forgot-password`
- [ ] Enter valid email
- [ ] Verify success message
- [ ] Check backend logs for reset email

### Logout
- [ ] Click logout button
- [ ] Verify redirect to login/home
- [ ] Verify token is cleared
- [ ] Verify cannot access protected routes

---

## 👤 USER PROFILE TESTS

### View Profile
- [ ] Navigate to `/client/settings`
- [ ] Verify profile data loads correctly
- [ ] Check avatar displays

### Edit Profile
- [ ] Update full name
- [ ] Update phone number
- [ ] Update bio (if available)
- [ ] Save changes
- [ ] Verify success message
- [ ] Reload page and verify changes persist

### Change Password
- [ ] Navigate to Security tab
- [ ] Enter current password
- [ ] Enter new password
- [ ] Confirm new password
- [ ] Submit form
- [ ] Verify success message
- [ ] Logout and login with new password

### Avatar Upload
- [ ] Click on avatar/upload button
- [ ] Select image file
- [ ] Verify upload progress
- [ ] Verify new avatar displays
- [ ] Refresh page and verify persistence

---

## 📅 BOOKING SYSTEM TESTS

### Search Cleaners
- [ ] Navigate to `/search`
- [ ] Verify cleaners load from API
- [ ] Test search functionality
- [ ] Test filters (if implemented)
- [ ] Click on cleaner card
- [ ] Verify cleaner profile loads

### Create Booking (4-Step Flow)
- [ ] From cleaner profile, click "Book Now"
- [ ] **Step 1: Service Selection**
  - [ ] Select service type (Standard/Deep/Move In Out)
  - [ ] Select duration (hours)
  - [ ] Select add-ons (if any)
  - [ ] Verify price updates in sidebar
  - [ ] Click "Next"
- [ ] **Step 2: Date & Time**
  - [ ] Select date (future date)
  - [ ] Select time slot
  - [ ] Verify availability check
  - [ ] Click "Next"
- [ ] **Step 3: Address**
  - [ ] Fill in street address
  - [ ] Fill in city, state, zip
  - [ ] Add special instructions
  - [ ] Click "Next"
- [ ] **Step 4: Review & Confirm**
  - [ ] Verify all details are correct
  - [ ] Verify final price
  - [ ] Click "Confirm & Book"
  - [ ] Verify success message
  - [ ] Verify redirect to booking details

### View Bookings
- [ ] Navigate to `/client/bookings`
- [ ] Verify booking appears in list
- [ ] Check booking status
- [ ] Click on booking
- [ ] Verify details page loads

### Cancel Booking
- [ ] From booking details, click "Cancel"
- [ ] Enter cancellation reason
- [ ] Confirm cancellation
- [ ] Verify status updates to "cancelled"
- [ ] Verify refund information (if applicable)

### Recurring Bookings
- [ ] Navigate to recurring booking setup
- [ ] Select frequency (Weekly/Bi-weekly/Monthly)
- [ ] Select day and time
- [ ] Complete setup
- [ ] Verify recurring booking appears
- [ ] Test Pause functionality
- [ ] Test Resume functionality
- [ ] Test Cancel functionality

---

## 💬 REAL-TIME MESSAGING TESTS

### Send Message
- [ ] Navigate to `/messages`
- [ ] Select conversation or start new
- [ ] Type message
- [ ] Click send
- [ ] Verify message appears immediately
- [ ] Verify timestamp displays

### Receive Message (Two Browser Test)
- [ ] Open second browser/incognito
- [ ] Login as different user
- [ ] Navigate to messages
- [ ] Send message from first browser
- [ ] Verify message appears in second browser without refresh
- [ ] Verify notification badge updates

### Message History
- [ ] Scroll through message history
- [ ] Verify messages load correctly
- [ ] Verify timestamps
- [ ] Verify sender/receiver identification

### Unread Messages
- [ ] Send message to user
- [ ] Login as recipient
- [ ] Verify unread count on NotificationBell
- [ ] Open messages
- [ ] Verify unread count clears

---

## ⭐ REVIEWS & RATINGS TESTS

### Leave Review
- [ ] Navigate to completed booking
- [ ] Click "Leave Review"
- [ ] Select star rating (1-5)
- [ ] Write review text
- [ ] Submit review
- [ ] Verify success message
- [ ] Verify review appears on cleaner profile

### View Reviews
- [ ] Navigate to cleaner profile
- [ ] Scroll to reviews section
- [ ] Verify reviews display
- [ ] Verify rating distribution chart
- [ ] Verify average rating

### Helpful Votes
- [ ] Click "Helpful" on a review
- [ ] Verify count increments
- [ ] Refresh page
- [ ] Verify vote persists

---

## ❤️ FAVORITES TESTS

### Add to Favorites
- [ ] Navigate to cleaner profile
- [ ] Click "Add to Favorites" (heart icon)
- [ ] Verify success message
- [ ] Verify icon changes state

### View Favorites
- [ ] Navigate to `/favorites`
- [ ] Verify cleaner appears in list
- [ ] Verify statistics update
- [ ] Click "Book Again"
- [ ] Verify redirects to booking flow

### Remove from Favorites
- [ ] From favorites page, click "Remove"
- [ ] Confirm removal
- [ ] Verify cleaner is removed from list
- [ ] Verify statistics update

---

## 🎁 REFERRAL PROGRAM TESTS

### View Referral Page
- [ ] Navigate to `/referral`
- [ ] Verify referral code displays
- [ ] Verify referral link displays
- [ ] Verify statistics display

### Copy Referral Link
- [ ] Click "Copy" button
- [ ] Verify "Copied!" confirmation
- [ ] Paste link in new tab
- [ ] Verify link includes referral code

### Send Email Invitation
- [ ] Enter friend's email
- [ ] Click "Send Invite"
- [ ] Verify success message
- [ ] Check backend logs for email

### Track Referrals
- [ ] Verify recent referrals display
- [ ] Check referral status badges
- [ ] Verify earning amounts

---

## 🔔 NOTIFICATIONS TESTS

### Notification Bell
- [ ] Trigger notification (new message, booking update)
- [ ] Verify bell icon shows badge
- [ ] Click on bell
- [ ] Verify dropdown opens
- [ ] Verify notifications display
- [ ] Click on notification
- [ ] Verify redirects to relevant page

### Mark as Read
- [ ] Click on unread notification
- [ ] Verify notification marked as read
- [ ] Verify badge count decrements

### Clear All
- [ ] Click "Clear All" (if implemented)
- [ ] Verify all notifications cleared
- [ ] Verify badge disappears

---

## 👑 ADMIN PANEL TESTS

### Admin Dashboard
- [ ] Login as admin
- [ ] Navigate to `/admin/dashboard`
- [ ] Verify statistics load
- [ ] Verify charts render
- [ ] Verify activity feed loads
- [ ] Test period toggle (week/month/year)

### User Management
- [ ] Navigate to `/admin/users`
- [ ] Verify users list loads
- [ ] Test search functionality
- [ ] Test role filter
- [ ] Test status filter
- [ ] Click on user
- [ ] Verify detail modal opens
- [ ] Test status change (suspend user)
- [ ] Verify status updates
- [ ] Test role change
- [ ] Verify role updates

### Booking Management
- [ ] Navigate to `/admin/bookings`
- [ ] Verify bookings list loads
- [ ] Test search functionality
- [ ] Test status filter
- [ ] Click on booking
- [ ] Verify detail modal opens
- [ ] Test status update
- [ ] Verify status changes

### Financial Management
- [ ] Navigate to `/admin/finance`
- [ ] Verify transactions load
- [ ] Verify charts display
- [ ] Test search functionality
- [ ] Click on transaction
- [ ] Verify detail modal opens
- [ ] Test refund processing (if applicable)

### System Settings
- [ ] Navigate to `/admin/settings`
- [ ] Switch between tabs
- [ ] Update a setting
- [ ] Save changes
- [ ] Verify success message
- [ ] Reload page
- [ ] Verify changes persist

---

## 📄 STATIC PAGES TESTS

### Help Center
- [ ] Navigate to `/help`
- [ ] Test FAQ search
- [ ] Click on FAQ item
- [ ] Verify answer expands
- [ ] Click on category card
- [ ] Test contact support links

### Terms of Service
- [ ] Navigate to `/terms`
- [ ] Verify all sections load
- [ ] Test scroll functionality
- [ ] Check footer link works

### Privacy Policy
- [ ] Navigate to `/privacy`
- [ ] Verify all sections load
- [ ] Test scroll functionality
- [ ] Check footer link works

---

## 🐛 ERROR HANDLING TESTS

### 404 Page
- [ ] Navigate to `/invalid-page-url`
- [ ] Verify 404 page displays
- [ ] Test "Go Home" button
- [ ] Test "Find Cleaners" button
- [ ] Test "Go Back" button
- [ ] Test quick links

### Error Boundary
- [ ] Trigger an error (if possible)
- [ ] Verify error page displays
- [ ] Test "Try Again" button
- [ ] Test "Go Home" button

### Network Errors
- [ ] Stop backend server
- [ ] Try to load data
- [ ] Verify error message displays
- [ ] Verify user-friendly message
- [ ] Restart backend
- [ ] Retry action
- [ ] Verify recovery

### Form Validation
- [ ] Try to submit forms with invalid data
- [ ] Verify validation messages
- [ ] Verify form doesn't submit
- [ ] Fix errors
- [ ] Verify form submits successfully

---

## 📱 RESPONSIVE DESIGN TESTS

### Mobile (375px)
- [ ] Test on mobile viewport
- [ ] Verify header collapses properly
- [ ] Verify navigation works
- [ ] Test forms are usable
- [ ] Test booking flow works
- [ ] Verify buttons are tappable

### Tablet (768px)
- [ ] Test on tablet viewport
- [ ] Verify layout adjusts
- [ ] Test navigation
- [ ] Verify all features work

### Desktop (1920px)
- [ ] Test on large desktop
- [ ] Verify max-width constraints
- [ ] Verify no layout breaks
- [ ] Test all features

---

## ⚡ PERFORMANCE TESTS

### Page Load Speed
- [ ] Clear cache
- [ ] Navigate to home page
- [ ] Verify loads under 3 seconds
- [ ] Check Network tab for slow requests
- [ ] Verify images load progressively

### API Response Time
- [ ] Check Network tab
- [ ] Verify API calls complete quickly
- [ ] Look for slow endpoints
- [ ] Check for unnecessary requests

### Real-time Performance
- [ ] Send multiple messages rapidly
- [ ] Verify no lag
- [ ] Check WebSocket connection stability
- [ ] Monitor memory usage

---

## 🔒 SECURITY TESTS

### Protected Routes
- [ ] Logout
- [ ] Try to access `/client/dashboard`
- [ ] Verify redirect to login
- [ ] Try to access `/admin/dashboard`
- [ ] Verify redirect to login

### Role-Based Access
- [ ] Login as Client
- [ ] Try to access `/admin/dashboard`
- [ ] Verify access denied or redirect
- [ ] Login as Cleaner
- [ ] Try to access `/client/bookings`
- [ ] Verify appropriate access control

### XSS Protection
- [ ] Try to input `<script>alert('XSS')</script>` in forms
- [ ] Verify script doesn't execute
- [ ] Verify input is sanitized

---

## 🎨 UI/UX TESTS

### Loading States
- [ ] Verify loading spinners appear during API calls
- [ ] Verify skeleton screens (if implemented)
- [ ] Verify loading doesn't block UI unnecessarily

### Toast Notifications
- [ ] Trigger success action
- [ ] Verify success toast appears
- [ ] Verify auto-dismisses
- [ ] Trigger error action
- [ ] Verify error toast appears

### Empty States
- [ ] View page with no data (empty bookings, messages, etc.)
- [ ] Verify friendly empty state message
- [ ] Verify helpful action buttons

### Hover States
- [ ] Hover over buttons
- [ ] Verify hover effects
- [ ] Hover over links
- [ ] Verify cursor changes

---

## ✅ BROWSER COMPATIBILITY

### Chrome
- [ ] Test all core features
- [ ] Verify no console errors
- [ ] Check responsiveness

### Firefox
- [ ] Test all core features
- [ ] Verify no console errors
- [ ] Check responsiveness

### Safari
- [ ] Test all core features
- [ ] Verify no console errors
- [ ] Check responsiveness

### Edge
- [ ] Test all core features
- [ ] Verify no console errors
- [ ] Check responsiveness

---

## 📊 FINAL VERIFICATION

### Data Integrity
- [ ] Verify bookings save correctly
- [ ] Verify user data persists
- [ ] Verify no data loss on refresh
- [ ] Verify relationships are correct (user-booking, etc.)

### Console Errors
- [ ] Open Developer Console
- [ ] Navigate through app
- [ ] Verify no critical errors
- [ ] Verify no broken images
- [ ] Verify no 404s for assets

### Accessibility
- [ ] Test keyboard navigation
- [ ] Test screen reader (basic)
- [ ] Verify color contrast
- [ ] Check alt text on images

---

## 🎯 TESTING SUMMARY

### Priority Levels
- **🔴 Critical:** Must work (Authentication, Booking, Payments)
- **🟡 Important:** Should work (Messaging, Admin, Reviews)
- **🟢 Nice-to-have:** Good to work (Referrals, Favorites)

### Bug Tracking
- Document bugs in a spreadsheet or issue tracker
- Prioritize by severity
- Fix critical bugs before launch

### Sign-Off
- [ ] All critical features tested ✅
- [ ] All important features tested ✅
- [ ] Major bugs fixed ✅
- [ ] Browser compatibility verified ✅
- [ ] Responsive design verified ✅
- [ ] Security checks passed ✅

---

## 📝 NOTES

**Tester Name:** _______________  
**Date:** _______________  
**Environment:** Development / Staging / Production  
**Backend Version:** _______________  
**Frontend Version:** 1.0.0

**Additional Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

---

**Testing Complete:** [ ] Yes [ ] No  
**Ready for Launch:** [ ] Yes [ ] No  
**Approved By:** _______________  
**Date:** _______________

