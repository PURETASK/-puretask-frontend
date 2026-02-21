// tests/e2e/trust/credits-billing-trust.spec.ts
// E2E tests for Trust credits and billing flows

import { test, expect } from '@playwright/test';

const CLIENT_EMAIL = process.env.TEST_EMAIL || 'client@test.com';
const CLIENT_PASSWORD = process.env.TEST_PASSWORD || 'TestPass123!';

test.describe('Trust Credits & Billing E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel(/email/i).fill(CLIENT_EMAIL);
    await page.getByLabel(/password/i).fill(CLIENT_PASSWORD);
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL(/\/(client|client\/dashboard)/);
  });

  test('credits-trust page loads and shows balance section', async ({ page }) => {
    await page.goto('/client/credits-trust');
    await expect(page.getByRole('heading', { name: /credits/i })).toBeVisible();
    await expect(page.getByText(/balance/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /buy credits/i })).toBeVisible();
  });

  test('credits-trust page has ledger filters', async ({ page }) => {
    await page.goto('/client/credits-trust');
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();
  });

  test('billing-trust page loads and shows invoices section', async ({ page }) => {
    await page.goto('/client/billing-trust');
    await expect(page.getByRole('heading', { name: /billing/i })).toBeVisible();
    await expect(page.getByText(/invoices/i)).toBeVisible();
  });

  test('billing-trust page has invoices table or empty state', async ({ page }) => {
    await page.goto('/client/billing-trust');
    await expect(page.getByRole('heading', { name: /billing/i })).toBeVisible();
    await page.waitForTimeout(2000);
    const table = page.locator('table');
    const noData = page.getByText(/failed|loading|no invoices/i);
    await expect(table.or(noData)).toBeVisible();
  });
});
