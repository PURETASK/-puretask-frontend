// tests/e2e/cleaner-onboarding.spec.ts
// E2E test for cleaner onboarding flow

import { test, expect } from '@playwright/test';

test.describe('Cleaner Onboarding Flow', () => {
  test('complete 10-step onboarding flow', async ({ page }) => {
    // Step 1: Sign up as cleaner
    await page.goto('/auth/register');
    await page.click('text=Cleaner');
    await page.fill('[name="email"]', `cleaner-${Date.now()}@example.com`);
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.click('button:has-text("Sign Up")');

    // Should redirect to onboarding
    await expect(page).toHaveURL(/\/cleaner\/onboarding/, { timeout: 10000 });

    // Step 2: Terms & Agreements
    await expect(page.locator('text=Terms & Agreements')).toBeVisible();
    await page.check('[name="terms_of_service"]');
    await page.check('[name="independent_contractor"]');
    await page.click('button:has-text("Continue")');

    // Step 3: Basic Info
    await expect(page.locator('text=Basic Information')).toBeVisible();
    await page.fill('[name="first_name"]', 'John');
    await page.fill('[name="last_name"]', 'Doe');
    await page.fill('[name="bio"]', 'Experienced cleaner with 5 years of professional cleaning experience');
    await page.fill('[name="professional_headline"]', 'Professional House Cleaner');
    await page.click('button:has-text("Continue")');

    // Step 4: Phone Verification
    await expect(page.locator('text=Phone Verification')).toBeVisible();
    await page.fill('[name="phone_number"]', '+11234567890');
    await page.click('button:has-text("Send Code")');
    
    // Wait for OTP input
    await page.waitForSelector('[name="otp_code"]', { timeout: 5000 });
    // In test environment, OTP might be logged to console
    await page.fill('[name="otp_code"]', '123456'); // Mock OTP
    await page.click('button:has-text("Verify")');

    // Step 5: Face Photo
    await expect(page.locator('text=Profile Photo')).toBeVisible();
    // Upload test image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-photo.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data'),
    });
    await page.click('button:has-text("Continue")');

    // Step 6: ID Verification
    await expect(page.locator('text=ID Verification')).toBeVisible();
    await page.selectOption('[name="document_type"]', 'drivers_license');
    const idInput = page.locator('input[type="file"]').last();
    await idInput.setInputFiles({
      name: 'test-id.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake-pdf-data'),
    });
    await page.click('button:has-text("Continue")');

    // Step 7: Background Check Consent
    await expect(page.locator('text=Background Check')).toBeVisible();
    await page.check('[name="fcra_consent"]');
    await page.check('[name="accuracy_consent"]');
    await page.click('button:has-text("Continue")');

    // Step 8: Service Areas
    await expect(page.locator('text=Service Areas')).toBeVisible();
    await page.fill('[name="zip_codes"]', '10001, 10002, 10003');
    await page.fill('[name="travel_radius_km"]', '25');
    await page.click('button:has-text("Continue")');

    // Step 9: Availability
    await expect(page.locator('text=Availability')).toBeVisible();
    // Enable Monday
    await page.click('[data-day="1"]');
    await page.fill('[name="monday_start"]', '09:00');
    await page.fill('[name="monday_end"]', '17:00');
    await page.click('button:has-text("Continue")');

    // Step 10: Rates
    await expect(page.locator('text=Rates & Pricing')).toBeVisible();
    await page.fill('[name="hourly_rate_credits"]', '300');
    await page.fill('[name="travel_radius_km"]', '20');
    await page.click('button:has-text("Continue")');

    // Step 11: Review & Complete
    await expect(page.locator('text=Review & Complete')).toBeVisible();
    await page.click('button:has-text("Activate")');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/cleaner\/dashboard/, { timeout: 10000 });
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('resumes from saved step', async ({ page }) => {
    // Login as cleaner who started onboarding
    await page.goto('/auth/login');
    await page.fill('[name="email"]', 'incomplete-cleaner@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button:has-text("Log In")');

    // Should redirect to onboarding at saved step
    await expect(page).toHaveURL(/\/cleaner\/onboarding/);
    // Should show progress indicator
    await expect(page.locator('[data-testid="onboarding-progress"]')).toBeVisible();
  });
});
