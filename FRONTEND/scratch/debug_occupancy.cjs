const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Login
  await page.goto('http://localhost:5173/login');
  await page.getByPlaceholder('you@sliit.lk').fill('kaveesha@sliit.lk');
  await page.getByPlaceholder('Enter your password').fill('password123');
  await page.getByRole('button', { name: /Sign In/i }).click();
  await page.waitForURL(/home/);
  
  // Go to facilities
  await page.goto('http://localhost:5173/book/facilities');
  await page.waitForSelector('text=Badminton Court');
  await page.click('text=Badminton Court');
  
  // Wait for some time to load
  await page.waitForTimeout(5000);
  
  console.log('Current URL:', page.url());
  const content = await page.content();
  console.log('Page content contains "Occupancy":', content.includes('Occupancy'));
  console.log('Page content contains "indicator-item":', content.includes('indicator-item'));
  
  // List all text on page
  const text = await page.evaluate(() => document.body.innerText);
  console.log('Body Text (first 500 chars):', text.substring(0, 500));
  
  await browser.close();
})();
