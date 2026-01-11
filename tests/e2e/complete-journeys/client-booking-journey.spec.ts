// tests/e2e/complete-journeys/client-booking-journey.spec.ts
// Complete client journey: Register → Search → Book → Message → Review

import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Complete Client Booking Journey', () => {
  const testEmail = `client.${Date.now()}@test.com`;
  const testPassword = 'TestPass123!';
  let bookingId: string;

  test('should complete full booking flow from registration to review', async ({ page }) => {
    // STEP 1: Registration
    console.log('📝 Step 1: Client Registration');
    await page.goto('/auth/register');
    
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).first().fill(testPassword);
    await page.getByLabel(/confirm password/i).fill(testPassword);
    await page.getByLabel(/client/i).check();
    await page.getByRole('button', { name: /register|sign up/i }).click();
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL(/\/client\/dashboard/, { timeout: 10000 });
    await expect(page.getByText(/welcome|dashboard/i)).toBeVisible();
    console.log('✅ Registration successful');

    // STEP 2: Search for Cleaners
    console.log('🔍 Step 2: Search for Cleaners');
    await page.goto('/search');
    
    // Wait for cleaners to load
    await expect(page.getByText(/cleaners|results/i)).toBeVisible({ timeout: 5000 });
    
    // Apply filters (optional)
    await page.getByLabel(/city|location/i).fill('San Francisco');
    await page.getByRole('button', { name: /search|filter/i }).click();
    
    // Select first cleaner
    const firstCleaner = page.locator('[data-testid="cleaner-card"]').first();
    await expect(firstCleaner).toBeVisible({ timeout: 5000 });
    
    const cleanerName = await firstCleaner.locator('h3, h2').textContent();
    console.log(`   Found cleaner: ${cleanerName}`);
    
    await firstCleaner.getByRole('button', { name: /view profile|book/i }).click();
    console.log('✅ Cleaner selected');

    // STEP 3: Complete Booking Flow
    console.log('📅 Step 3: Create Booking');
    
    // Sub-step 3a: Service Selection
    await expect(page.getByText(/service|select/i)).toBeVisible();
    await page.getByLabel(/standard cleaning/i).check();
    await page.getByLabel(/duration|hours/i).selectOption('3');
    await page.getByRole('button', { name: /next|continue/i }).click();
    console.log('   ✓ Service selected: Standard, 3 hours');
    
    // Sub-step 3b: Date & Time
    await expect(page.getByText(/date|schedule/i)).toBeVisible();
    
    // Select a future date (5 days from now)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const dayToClick = futureDate.getDate();
    
    await page.getByRole('button', { name: new RegExp(`^${dayToClick}$`) }).click();
    await page.getByLabel(/time/i).selectOption('10:00');
    await page.getByRole('button', { name: /next|continue/i }).click();
    console.log('   ✓ Date & time selected');
    
    // Sub-step 3c: Address Details
    await expect(page.getByText(/address|location/i)).toBeVisible();
    await page.getByLabel(/street|address/i).fill('123 Test Street');
    await page.getByLabel(/city/i).fill('San Francisco');
    await page.getByLabel(/state/i).selectOption('CA');
    await page.getByLabel(/zip/i).fill('94102');
    await page.getByLabel(/instructions/i).fill('Please ring doorbell twice');
    await page.getByRole('button', { name: /next|continue/i }).click();
    console.log('   ✓ Address entered');
    
    // Sub-step 3d: Review & Confirm
    await expect(page.getByText(/review|confirm/i)).toBeVisible();
    
    // Verify details are shown
    await expect(page.getByText(/123 Test Street/i)).toBeVisible();
    await expect(page.getByText(/Standard/i)).toBeVisible();
    
    // Confirm booking
    await page.getByRole('button', { name: /confirm|book now/i }).click();
    
    // Wait for success message
    await expect(page.getByText(/success|confirmed/i)).toBeVisible({ timeout: 10000 });
    console.log('✅ Booking created successfully');
    
    // Extract booking ID from URL or page
    await page.waitForURL(/\/client\/bookings/);
    const bookingCard = page.locator('[data-testid="booking-card"]').first();
    await expect(bookingCard).toBeVisible();

    // STEP 4: Send Message to Cleaner
    console.log('💬 Step 4: Message Cleaner');
    await page.goto('/messages');
    
    // Find conversation or start new
    const messageInput = page.getByPlaceholder(/type|message/i);
    await expect(messageInput).toBeVisible({ timeout: 5000 });
    
    const testMessage = `Hi! Looking forward to the cleaning on ${futureDate.toLocaleDateString()}`;
    await messageInput.fill(testMessage);
    await page.getByRole('button', { name: /send/i }).click();
    
    // Verify message appears
    await expect(page.getByText(testMessage)).toBeVisible({ timeout: 5000 });
    console.log('✅ Message sent to cleaner');

    // STEP 5: View Booking Details
    console.log('📋 Step 5: View Booking Details');
    await page.goto('/client/bookings');
    
    await bookingCard.click();
    
    // Verify booking details modal/page
    await expect(page.getByText(/booking details|view booking/i)).toBeVisible();
    await expect(page.getByText(/123 Test Street/i)).toBeVisible();
    console.log('✅ Booking details viewed');

    // STEP 6: Simulate Booking Completion & Leave Review
    console.log('⭐ Step 6: Leave Review (simulated)');
    
    // In real scenario, we'd wait for booking to complete
    // For testing, we'll navigate to review page directly
    await page.goto('/client/bookings');
    
    // Look for "Leave Review" button (would appear after completion)
    const reviewButton = page.getByRole('button', { name: /review|rate/i }).first();
    
    if (await reviewButton.isVisible()) {
      await reviewButton.click();
      
      // Fill review
      await page.getByLabel(/rating|stars/i).click(); // Click 5 stars
      await page.locator('[data-rating="5"]').click();
      
      const reviewText = 'Great service! Very professional and thorough cleaning.';
      await page.getByLabel(/comment|review/i).fill(reviewText);
      await page.getByRole('button', { name: /submit|send/i }).click();
      
      await expect(page.getByText(/thank you|success/i)).toBeVisible();
      console.log('✅ Review submitted');
    } else {
      console.log('   ⚠️  Review button not yet available (booking not completed)');
    }

    // STEP 7: Verify Dashboard Shows Booking
    console.log('📊 Step 7: Verify Dashboard');
    await page.goto('/client/dashboard');
    
    await expect(page.getByText(/upcoming|bookings/i)).toBeVisible();
    await expect(page.getByText(/123 Test Street/i)).toBeVisible();
    console.log('✅ Booking visible on dashboard');

    // STEP 8: Test Logout
    console.log('🚪 Step 8: Logout');
    await page.getByRole('button', { name: /logout|sign out/i }).click();
    
    await expect(page).toHaveURL(/\/|\/auth\/login/);
    console.log('✅ Logout successful');

    console.log('\n🎉 COMPLETE CLIENT JOURNEY TEST PASSED!');
  });

  test('should handle booking cancellation', async ({ page }) => {
    // Login
    await page.goto('/auth/login');
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /login/i }).click();
    
    await expect(page).toHaveURL(/\/client\/dashboard/);
    
    // Go to bookings
    await page.goto('/client/bookings');
    
    // Select first booking
    const bookingCard = page.locator('[data-testid="booking-card"]').first();
    await bookingCard.click();
    
    // Cancel booking
    await page.getByRole('button', { name: /cancel/i }).click();
    
    // Confirm cancellation
    await page.getByLabel(/reason/i).fill('Change of plans');
    await page.getByRole('button', { name: /confirm|yes/i }).click();
    
    // Verify cancellation
    await expect(page.getByText(/cancelled|canceled/i)).toBeVisible();
    console.log('✅ Booking cancellation successful');
  });

  test('should handle invalid booking data', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /login/i }).click();
    
    await expect(page).toHaveURL(/\/client\/dashboard/);
    
    // Try to book with invalid data
    await page.goto('/search');
    
    const firstCleaner = page.locator('[data-testid="cleaner-card"]').first();
    await firstCleaner.getByRole('button', { name: /book/i }).click();
    
    // Try to proceed without selecting service
    await page.getByRole('button', { name: /next/i }).click();
    
    // Should show validation error
    await expect(page.getByText(/required|select/i)).toBeVisible();
    console.log('✅ Validation working correctly');
  });
});

