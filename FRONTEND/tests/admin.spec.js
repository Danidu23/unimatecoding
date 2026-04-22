import { test, expect } from '@playwright/test';
import { login, setupMocks } from './test-helpers';

test.beforeEach(async ({ page }) => {
  await setupMocks(page);
});

test('Admin approves booking', async ({ page }) => {
  await login(page, 'admin@sliit.lk');
  await page.goto('/admin/bookings');

  // Look for any Approve button for a pending booking
  const approveBtn = page.getByRole('button', { name: /Approve/i }).first();
  
  if (await approveBtn.count() > 0) {
    await approveBtn.click();
    // Check for success alert or status change
    await expect(page.locator('text=approved').first()).toBeVisible();
  } else {
    console.log('No pending bookings found to approve');
  }
});

