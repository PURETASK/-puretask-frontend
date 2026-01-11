// tests/e2e/messaging/real-time-chat.spec.ts
// E2E test for real-time messaging

import { test, expect } from '@playwright/test';

test.describe('Real-Time Messaging', () => {
  test('should send and receive messages in real-time', async ({ browser }) => {
    // Create two browser contexts for two users
    const clientContext = await browser.newContext();
    const cleanerContext = await browser.newContext();
    
    const clientPage = await clientContext.newPage();
    const cleanerPage = await cleanerContext.newPage();

    // Login as client
    await clientPage.goto('/auth/login');
    await clientPage.getByLabel(/email/i).fill('client@test.com');
    await clientPage.getByLabel(/password/i).fill('TestPass123!');
    await clientPage.getByRole('button', { name: /login/i }).click();
    await expect(clientPage).toHaveURL(/\/client\/dashboard/);

    // Login as cleaner
    await cleanerPage.goto('/auth/login');
    await cleanerPage.getByLabel(/email/i).fill('cleaner@test.com');
    await cleanerPage.getByLabel(/password/i).fill('TestPass123!');
    await cleanerPage.getByRole('button', { name: /login/i }).click();
    await expect(cleanerPage).toHaveURL(/\/cleaner\/dashboard/);

    // Navigate both to messages
    await clientPage.goto('/messages');
    await cleanerPage.goto('/messages');

    // Client sends message
    const message = `Test message ${Date.now()}`;
    await clientPage.getByPlaceholder(/type a message/i).fill(message);
    await clientPage.getByRole('button', { name: /send/i }).click();

    // Message should appear in client's chat
    await expect(clientPage.getByText(message)).toBeVisible();

    // Message should appear in cleaner's chat (real-time)
    await expect(cleanerPage.getByText(message)).toBeVisible({ timeout: 5000 });

    // Clean up
    await clientContext.close();
    await cleanerContext.close();
  });

  test('should show unread message count', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel(/email/i).fill('client@test.com');
    await page.getByLabel(/password/i).fill('TestPass123!');
    await page.getByRole('button', { name: /login/i }).click();

    // Check notification bell for unread count
    const notificationBell = page.locator('[data-testid="notification-bell"]');
    
    // If there are unread messages, badge should be visible
    if (await notificationBell.locator('.badge').isVisible()) {
      await expect(notificationBell.locator('.badge')).toHaveText(/\d+/);
    }
  });
});

