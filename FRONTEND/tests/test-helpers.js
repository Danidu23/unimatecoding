import { expect } from '@playwright/test';

/**
 * Shared login helper that includes API mocking
 */
export async function login(page, email, password = 'password123') {
  // Set up common API mocks before navigation
  await setupMocks(page);

  await page.goto('/login');
  
  // Wait for page to be ready
  await expect(page.getByPlaceholder('you@sliit.lk')).toBeVisible();
  
  await page.getByPlaceholder('you@sliit.lk').fill(email);
  await page.getByPlaceholder('Enter your password').fill(password);
  await page.getByRole('button', { name: /Sign In/i }).click();

  // Wait for the URL to change to either home or admin
  await page.waitForURL(/home|admin/, { timeout: 10000 });
}

/**
 * Sets up global API mocks for the application
 */
export async function setupMocks(page) {
  // Mock Login
  await page.route('**/api/auth/login', async (route) => {
    const json = {
      _id: 'user_123',
      name: 'Test User',
      email: 'user@sliit.lk',
      role: route.request().postDataJSON().email.includes('admin') ? 'admin' : (route.request().postDataJSON().email.includes('staff') ? 'staff' : 'student'),
      token: 'mock_token_xyz'
    };
    await route.fulfill({ json });
  });

  // Mock Facilities
  await page.route('**/api/facilities**', async (route) => {
    const facilities = [
      { 
        _id: 'f1', 
        name: 'Badminton Court', 
        type: 'sport', 
        category: 'Indoor', 
        capacity: 4, 
        slotDurationMinutes: 60,
        description: 'High quality court',
        operatingHours: { open: '08:00', close: '20:00' },
        image: 'https://via.placeholder.com/300',
        averageRating: 4.5,
        totalRatings: 10
      },
      { 
        _id: 'f2', 
        name: 'Gymnasium', 
        type: 'sport', 
        category: 'Indoor', 
        capacity: 20, 
        slotDurationMinutes: 60,
        description: 'Modern gym',
        operatingHours: { open: '06:00', close: '22:00' },
        image: 'https://via.placeholder.com/300',
        averageRating: 4.2,
        totalRatings: 15
      },
      { 
        _id: 's1', 
        name: 'Counselling', 
        type: 'service', 
        category: 'Wellness', 
        capacity: 1, 
        slotDurationMinutes: 30,
        description: 'Student support',
        operatingHours: { open: '09:00', close: '17:00' },
        image: 'https://via.placeholder.com/300',
        averageRating: 4.8,
        totalRatings: 5
      }
    ];

    const url = route.request().url();
    // Check if it's a specific ID request (e.g., /api/facilities/f1)
    const idMatch = url.match(/\/api\/facilities\/([a-zA-Z0-9_-]+)/);
    if (idMatch) {
      const id = idMatch[1];
      const facility = facilities.find(f => f._id === id);
      if (facility) {
        await route.fulfill({ json: facility });
      } else {
        await route.fulfill({ status: 404, json: { message: 'Not found' } });
      }
    } else {
      await route.fulfill({ json: facilities });
    }
  });

  // Mock Rules
  await page.route('**/api/rules**', async (route) => {
    await route.fulfill({ json: {
      _id: 'rules_123',
      sportsCancelHoursBefore: 2,
      serviceCancelHoursBefore: 4,
      maxBookingsPerDay: 3
    }});
  });

  // Mock Slots
  await page.route('**/api/slots**', async (route) => {
    const slots = [];
    for (let i = 8; i < 18; i++) {
       const isFull = i === 12;
       slots.push({
         _id: `slot_${i}`,
         startTime: `${i}:00`,
         endTime: `${i+1}:00`,
         status: isFull ? 'full' : 'available',
         capacity: 4,
         booked: isFull ? 4 : 0
       });
    }
    await route.fulfill({ json: slots });
  });

  // Mock Bookings (My Bookings & Admin)
  await page.route('**/api/bookings**', async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (method === 'GET') {
      const bookings = [
        { 
          _id: 'b1', 
          facilityServiceId: { _id: 'f1', name: 'Badminton Court', type: 'sport' }, 
          userId: { _id: 'u1', name: 'Kaveesha' },
          date: new Date().toISOString().split('T')[0], 
          startTime: '10:00', 
          endTime: '11:00', 
          participants: 2,
          status: 'pending' 
        },
        { 
          _id: 'b2', 
          facilityServiceId: { _id: 'f2', name: 'Gymnasium', type: 'sport' }, 
          userId: { _id: 'u1', name: 'Kaveesha' },
          date: new Date().toISOString().split('T')[0], 
          startTime: '14:00', 
          endTime: '15:00', 
          participants: 1,
          status: 'completed' 
        }
      ];
      await route.fulfill({ json: bookings });
    } else if (method === 'POST') {
      if (url.includes('/scan')) {
        await route.fulfill({ json: { 
          message: 'Check-in Successful',
          booking: {
            _id: 'b1',
            userId: { name: 'Kaveesha' },
            facilityServiceId: { name: 'Badminton Court' },
            startTime: '10:00',
            endTime: '11:00',
            status: 'checked-in'
          }
        }});
      } else {
        await route.fulfill({ json: { _id: 'new_b', date: '2026-04-23', startTime: '09:00', endTime: '10:00', status: 'pending' } });
      }
    } else if (method === 'PATCH' || method === 'PUT') {
        await route.fulfill({ json: { message: 'Action successful' } });
    }
  });

  // Mock Smart Occupancy
  await page.route('**/api/smart/occupancy**', async (route) => {
    await route.fulfill({ json: { status: 'low', percentage: 25 } });
  });

  // Mock Notifications
  await page.route('**/api/notifications**', async (route) => {
    await route.fulfill({ json: [] });
  });
}
