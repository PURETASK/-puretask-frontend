// tests/e2e/auth/login.spec.ts
// E2E test for complete login flow

import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test('should show validation errors for empty submission', async ({ page }) => {
    await page.getByRole('button', { name: /login/i }).click();
    
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should successfully login as client', async ({ page }) => {
    await page.getByLabel(/email/i).fill('client@test.com');
    await page.getByLabel(/password/i).fill('TestPass123!');
    await page.getByRole('button', { name: /login/i }).click();

    // Should redirect to client dashboard
    await expect(page).toHaveURL(/\/client\/dashboard/);
    
    // Should see welcome message or dashboard content
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('should successfully login as cleaner', async ({ page }) => {
    await page.getByLabel(/email/i).fill('cleaner@test.com');
    await page.getByLabel(/password/i).fill('TestPass123!');
    await page.getByRole('button', { name: /login/i }).click();

    // Should redirect to cleaner dashboard
    await expect(page).toHaveURL(/\/cleaner\/dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('wrong@test.com');
    await page.getByLabel(/password/i).fill('WrongPassword!');
    await page.getByRole('button', { name: /login/i }).click();

    // Should show error message
    await expect(page.getByText(/invalid/i)).toBeVisible();
    
    // Should stay on login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.getByText(/don't have an account/i).click();
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByText(/forgot password/i).click();
    await expect(page).toHaveURL(/\/auth\/forgot-password/);
  });

  test('should remember email on failed login attempt', async ({ page }) => {
    const email = 'test@test.com';
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill('WrongPassword');
    await page.getByRole('button', { name: /login/i }).click();

    // Email should still be filled after failed attempt
    await expect(page.getByLabel(/email/i)).toHaveValue(email);
  });
});

