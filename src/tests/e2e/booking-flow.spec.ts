import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to booking page
    await page.goto('/booking');
  });

  test('should display booking form', async ({ page }) => {
    await expect(page.getByText(/book a cleaner/i)).toBeVisible();
    await expect(page.getByLabel(/service type/i)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling form
    await page.getByRole('button', { name: /confirm/i }).click();
    
    // Should show validation errors
    await expect(page.getByText(/required/i)).toBeVisible();
  });

  test('should calculate price estimate', async ({ page }) => {
    // Fill in booking details
    await page.selectOption('select[name="service_type"]', 'standard');
    await page.fill('input[name="duration_hours"]', '3');
    
    // Should show price estimate
    await expect(page.getByText(/\$/)).toBeVisible();
  });
});
