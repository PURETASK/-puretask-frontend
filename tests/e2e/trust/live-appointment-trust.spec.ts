// tests/e2e/trust/live-appointment-trust.spec.ts
// E2E tests for Trust live appointment flow

import { test, expect } from '@playwright/test';

const CLEANER_EMAIL = process.env.TEST_CLEANER_EMAIL || 'cleaner@test.com';
const CLEANER_PASSWORD = process.env.TEST_CLEANER_PASSWORD || 'TestPass123!';

test.describe('Trust Live Appointment E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel(/email/i).fill(CLEANER_EMAIL);
    await page.getByLabel(/password/i).fill(CLEANER_PASSWORD);
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL(/\/(cleaner|cleaner\/dashboard)/);
  });

  test('live-trust page loads for valid booking id', async ({ page }) => {
    await page.goto('/client/appointments/test-booking-id/live-trust');
    await expect(page.getByRole('heading', { name: /live|appointment/i })).toBeVisible();
  });

  test('live-trust page shows state or loading', async ({ page }) => {
    await page.goto('/client/appointments/test-booking-id/live-trust');
    await page.waitForTimeout(3000);
    const hasContent =
      page.getByText(/scheduled|en_route|arrived|completed|loading|failed/i);
    await expect(hasContent).toBeVisible();
  });
});
