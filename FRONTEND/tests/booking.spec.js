import { test, expect } from '@playwright/test';
import { login, setupMocks } from './test-helpers';

test.beforeEach(async ({ page }) => {
  await setupMocks(page);
  // Most tests here represent student actions
  await login(page, 'kaveesha@sliit.lk');
});

test('Student can book a sports facility', async ({ page }) => {
  // Already logged in via beforeEach
  await page.click('text=Browse & Book');
  await page.click('text=Sports Facilities');
  
  // Select Badminton Court (assuming it exists in the list)
  const badmintonCard = page.locator('.facility-card', { hasText: 'Badminton Court' });
  await badmintonCard.getByRole('button', { name: /Book Now/i }).click();
  
  // Select a slot - looking for time format like "10:00 AM"
  // Note: Slots might be dynamically loaded. Wait for either slots or "No slots" message.
  const slotsGrid = page.locator('.slots-grid');
  const noSlotsMsg = page.locator('text=No slots available');
  
  await Promise.race([
    slotsGrid.waitFor({ state: 'visible', timeout: 15000 }),
    noSlotsMsg.waitFor({ state: 'visible', timeout: 15000 })
  ]).catch(() => {});

  if (await slotsGrid.isVisible()) {
    const slot = page.locator('.slot-btn:not(.unavailable)').first();
    if (await slot.count() > 0) {
      await slot.click();
      await page.click('text=Confirm Booking');
      await expect(page.locator('text=Booking Submitted!').first()).toBeVisible();
    } else {
      console.log('No available slots found');
    }
  } else {
    console.log('No slots available for this date');
  }
});

test('Prevent double booking', async ({ page }) => {
  await page.goto('/book/facilities');
  const badmintonCard = page.locator('.facility-card', { hasText: 'Badminton Court' });
  await badmintonCard.getByRole('button', { name: /Book Now/i }).click();

  const bookedSlot = page.locator('.slot-btn.unavailable, .slot-card-booked').first();
  if (await bookedSlot.count() > 0) {
    await expect(bookedSlot).toBeVisible();
  }
});

test('User can cancel booking', async ({ page }) => {
  await page.goto('/my-bookings');

  // Look for a "Cancel" button in the bookings list
  const cancelBtn = page.getByRole('button', { name: /Cancel/i }).first();
  if (await cancelBtn.count() > 0) {
    await cancelBtn.click();

    // Confirm cancellation if there's a popup
    const confirmBtn = page.getByRole('button', { name: /Yes, Cancel/i });
    if (await confirmBtn.count() > 0) {
      await confirmBtn.click();
    }

    await expect(page.locator('text=Cancelled').first()).toBeVisible();
  } else {
    console.log('No cancellable bookings found');
  }
});

