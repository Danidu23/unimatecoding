import { test, expect } from '@playwright/test';

async function login(page, email, password = 'password123') {
  await page.goto('/login');
  await page.getByPlaceholder('you@sliit.lk').fill(email);
  await page.getByPlaceholder('Enter your password').fill(password);
  await page.getByRole('button', { name: /Sign In/i }).click();
  await page.waitForURL(/home|admin/);
}

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

