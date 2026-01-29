// tests/e2e/booking-flow.spec.ts
// E2E test for client booking flow

import { test, expect } from '@playwright/test';

test.describe('Client Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
  });

  test('complete booking flow from signup to confirmation', async ({ page }) => {
    // Step 1: Sign up as client
    await page.click('text=Sign Up');
    await page.click('text=Client');
    await page.fill('[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.fill('[name="firstName"]', 'Test');
    await page.fill('[name="lastName"]', 'User');
    await page.click('button:has-text("Sign Up")');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/client\/dashboard/, { timeout: 10000 });

    // Step 2: Navigate to booking
    await page.click('text=Book Cleaning');
    await expect(page).toHaveURL(/\/booking/);

    // Step 3: Select cleaning type
    await page.click('text=Regular Clean');
    await page.click('button:has-text("Continue")');

    // Step 4: Select date and time
    await page.click('[data-testid="date-picker"]');
    // Select tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click(`[data-date="${tomorrow.toISOString().split('T')[0]}"]`);
    await page.click('text=2:00 PM');
    await page.click('button:has-text("Continue")');

    // Step 5: Enter address
    await page.fill('[name="address"]', '123 Main St');
    await page.fill('[name="city"]', 'New York');
    await page.fill('[name="state"]', 'NY');
    await page.fill('[name="zipCode"]', '10001');
    await page.click('button:has-text("Continue")');

    // Step 6: Select cleaner (if available)
    // Wait for cleaner list to load
    await page.waitForSelector('[data-testid="cleaner-card"]', { timeout: 5000 });
    // Select first available cleaner
    await page.click('[data-testid="cleaner-card"]:first-child button:has-text("Select")');
    await page.click('button:has-text("Continue")');

    // Step 7: Review and confirm
    await expect(page.locator('text=Review Booking')).toBeVisible();
    await page.click('button:has-text("Confirm Booking")');

    // Step 8: Verify booking confirmation
    await expect(page).toHaveURL(/\/booking\/confirm\//);
    await expect(page.locator('text=Booking Confirmed')).toBeVisible();
  });

  test('handles insufficient credits', async ({ page }) => {
    // Login as existing client with 0 credits
    await page.goto('/auth/login');
    await page.fill('[name="email"]', 'low-credits@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button:has-text("Log In")');

    await page.waitForURL(/\/client\/dashboard/);

    // Try to book
    await page.click('text=Book Cleaning');
    await page.click('text=Regular Clean');
    await page.click('button:has-text("Continue")');

    // Should show insufficient credits error
    await expect(page.locator('text=Insufficient credits')).toBeVisible();
  });
});
