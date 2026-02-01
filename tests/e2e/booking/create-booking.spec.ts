// tests/e2e/booking/create-booking.spec.ts
// E2E test for complete booking flow

import { test, expect } from '@playwright/test';

test.describe('Booking Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as client first
    await page.goto('/auth/login');
    await page.getByLabel(/email/i).fill('client@test.com');
    await page.getByLabel(/password/i).fill('TestPass123!');
    await page.getByRole('button', { name: /login/i }).click();
    
    await expect(page).toHaveURL(/\/client\/dashboard/);
  });

  test('should complete full booking flow', async ({ page }) => {
    // 1. Navigate to search page
    await page.goto('/search');
    await expect(page.getByText(/find cleaners/i)).toBeVisible();

    // 2. Select a cleaner
    await page.getByRole('button', { name: /view profile/i }).first().click();
    
    // 3. Click Book Now
    await page.getByRole('button', { name: /book now/i }).click();

    // 4. Step 1: Service Selection
    await expect(page.getByText(/select service/i)).toBeVisible();
    await page.getByLabel(/standard cleaning/i).check();
    await page.getByLabel(/duration/i).selectOption('3');
    await page.getByRole('button', { name: /next/i }).click();

    // 5. Step 2: Date & Time
    await expect(page.getByText(/select date/i)).toBeVisible();
    // Select a future date
    await page.getByRole('button', { name: /calendar/i }).click();
    await page.getByRole('button', { name: /15/i }).first().click();
    // Select time
    await page.getByLabel(/time/i).selectOption('10:00');
    await page.getByRole('button', { name: /next/i }).click();

    // 6. Step 3: Address
    await expect(page.getByText(/enter address/i)).toBeVisible();
    await page.getByLabel(/street address/i).fill('123 Main St');
    await page.getByLabel(/city/i).fill('San Francisco');
    await page.getByLabel(/state/i).selectOption('CA');
    await page.getByLabel(/zip code/i).fill('94102');
    await page.getByRole('button', { name: /next/i }).click();

    // 7. Step 4: Review & Confirm
    await expect(page.getByText(/review booking/i)).toBeVisible();
    await expect(page.getByText(/123 Main St/i)).toBeVisible();
    await page.getByRole('button', { name: /confirm/i}).click();

    // 8. Should redirect to booking confirmation
    await expect(page).toHaveURL(/\/client\/bookings/);
    await expect(page.getByText(/booking confirmed/i)).toBeVisible();
  });

  test('should show price calculation', async ({ page }) => {
    await page.goto('/search');
    await page.getByRole('button', { name: /view profile/i }).first().click();
    await page.getByRole('button', { name: /book now/i }).click();

    // Select service
    await page.getByLabel(/standard cleaning/i).check();
    await page.getByLabel(/duration/i).selectOption('3');

    // Price should be visible in sidebar
    await expect(page.getByText(/\$\d+/)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/search');
    await page.getByRole('button', { name: /view profile/i }).first().click();
    await page.getByRole('button', { name: /book now/i }).click();

    // Try to proceed without selecting service
    await page.getByRole('button', { name: /next/i }).click();
    
    await expect(page.getByText(/required/i)).toBeVisible();
  });
});

