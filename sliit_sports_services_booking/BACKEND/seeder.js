const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const FacilityService = require('./models/FacilityService');
const GlobalRules = require('./models/GlobalRules');

dotenv.config();

const FACILITIES = [
  // --- SPORTS ---
  {
    name: 'Gym',
    type: 'sport',
    category: 'indoor',
    description: 'Modern fitness center with cardio and strength equipment',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    operatingHours: { open: '06:00', close: '22:00' },
    capacity: 20,
    slotDurationMinutes: 60,
    active: true,
    tags: ['popular', 'almost-full']
  },
  {
    name: 'Badminton Court',
    type: 'sport',
    category: 'indoor',
    description: 'Professional indoor badminton courts with synthetic flooring',
    image: '/images/badminton.jpg',
    operatingHours: { open: '07:00', close: '21:00' },
    capacity: 4,
    slotDurationMinutes: 60,
    active: true,
    tags: ['popular']
  },
  {
    name: 'Basketball Court',
    type: 'sport',
    category: 'indoor',
    description: 'Standard size indoor basketball court with wooden flooring',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80',
    operatingHours: { open: '07:00', close: '21:00' },
    capacity: 10,
    slotDurationMinutes: 60,
    active: true,
    tags: []
  },
  {
    name: 'Cricket Ground',
    type: 'sport',
    category: 'outdoor',
    description: 'Full-size cricket ground with practice nets',
    image: '/images/cricket.jpg',
    operatingHours: { open: '06:00', close: '18:00' },
    capacity: 22,
    slotDurationMinutes: 120,
    active: true,
    tags: []
  },
  {
    name: 'Tennis Court',
    type: 'sport',
    category: 'outdoor',
    description: 'Synthetic hard court for tennis enthusiasts',
    image: '/images/tennis.jpg',
    operatingHours: { open: '06:00', close: '20:00' },
    capacity: 4,
    slotDurationMinutes: 60,
    active: true,
    tags: []
  },
  {
    name: 'Volleyball Court',
    type: 'sport',
    category: 'outdoor',
    description: 'Outdoor volleyball court with sand and net',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&q=80',
    operatingHours: { open: '08:00', close: '18:00' },
    capacity: 12,
    slotDurationMinutes: 60,
    active: true,
    tags: []
  },
  // --- SERVICES ---
  {
    name: 'Doctor Channeling',
    type: 'service',
    category: 'medical',
    description: 'Consult with the on-campus doctor for medical concerns',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80',
    operatingHours: { open: '09:00', close: '17:00' },
    capacity: 1,
    slotDurationMinutes: 30,
    active: true,
    tags: ['popular'],
    provider: 'Dr. Nimal Perera'
  },
  {
    name: 'Student Counseling',
    type: 'service',
    category: 'wellness',
    description: 'Confidential mental health and academic counseling',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80',
    operatingHours: { open: '09:00', close: '16:00' },
    capacity: 1,
    slotDurationMinutes: 45,
    active: true,
    tags: [],
    provider: 'Ms. Sarah Fernando'
  },
  {
    name: 'Physiotherapy',
    type: 'service',
    category: 'wellness',
    description: 'Physical therapy and sports injury rehab center',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    operatingHours: { open: '10:00', close: '15:00' },
    capacity: 2,
    slotDurationMinutes: 45,
    active: true,
    tags: [],
    provider: 'Dr. Kasun Silva'
  }
];

const USERS = [
  { name: 'Kaveesha Perera', email: 'kaveesha@sliit.lk', password: 'password123', role: 'student' },
  { name: 'Admin User', email: 'admin@sliit.lk', password: 'password123', role: 'admin' },
  { name: 'Staff User', email: 'staff@sliit.lk', password: 'password123', role: 'staff' },
];

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await FacilityService.deleteMany();
    await GlobalRules.deleteMany();

    for (const u of USERS) {
      await User.create(u);
    }
    await FacilityService.insertMany(FACILITIES);
    await GlobalRules.create({});

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
