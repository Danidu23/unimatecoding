const mongoose = require('mongoose');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const lostItemsData = [
    // Electronics
    {
        itemName: 'MacBook Pro 16"',
        category: 'Electronics',
        lastSeenLocation: 'Central Library, 3rd Floor',
        dateLost: new Date('2026-04-03'),
        description: 'Silver MacBook Pro 16 inch. Has a small sticker on the back. Last seen near the study tables.',
        contact: 'john.student@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80'
    },
    {
        itemName: 'iPhone 13 Pro',
        category: 'Electronics',
        lastSeenLocation: 'Engineering Building Hallway',
        dateLost: new Date('2026-04-02'),
        description: 'Gold iPhone 13 Pro with cracked screen. Has custom case with initials "AM".',
        contact: '+1-555-0100',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1592286927505-1def25115858?w=300&q=80'
    },
    {
        itemName: 'AirPods Pro',
        category: 'Electronics',
        lastSeenLocation: 'University Gym',
        dateLost: new Date('2026-03-28'),
        description: 'White AirPods Pro in charging case. Serial number visible inside case.',
        contact: '+1-555-0456',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80'
    },
    {
        itemName: 'Sony WH-1000XM5 Headphones',
        category: 'Electronics',
        lastSeenLocation: 'Student Cafeteria',
        dateLost: new Date('2026-04-01'),
        description: 'Black Sony noise-cancelling headphones. Battery nearly full. With carrying case.',
        contact: 'alex.chen@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80'
    },
    {
        itemName: 'iPad Air',
        category: 'Electronics',
        lastSeenLocation: 'Business School Computer Lab',
        dateLost: new Date('2026-03-31'),
        description: 'Space gray iPad Air with Apple Pencil. Case has university logo sticker.',
        contact: '+1-555-0200',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1585864299869-592a66ffc0d5?w=300&q=80'
    },
    {
        itemName: 'Dell XPS 13 Laptop Charger',
        category: 'Electronics',
        lastSeenLocation: 'Computer Lab Building',
        dateLost: new Date('2026-03-22'),
        description: 'Dell XPS 13 charger, 90W USB-C. Black with red indicator light.',
        contact: '+1-555-0789',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1591779033100-9f3019e08c16?w=300&q=80'
    },
    
    // Documents & Accessories
    {
        itemName: 'Student ID Card',
        category: 'Documents',
        lastSeenLocation: 'Cafe Zone B',
        dateLost: new Date('2026-04-01'),
        description: 'Blue student ID card with photo. Name: Sarah Johnson. Urgent - need for exams.',
        contact: '+1-555-0123',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1579546622759-f0ec0e442ab0?w=300&q=80'
    },
    {
        itemName: 'Passport',
        category: 'Documents',
        lastSeenLocation: 'International Student Office',
        dateLost: new Date('2026-03-29'),
        description: 'US Passport. Navy blue cover. Name: Michael Torres. Very important.',
        contact: 'torres.michael@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b1?w=300&q=80'
    },
    {
        itemName: 'Gold Watch',
        category: 'Accessories',
        lastSeenLocation: 'University Canteen',
        dateLost: new Date('2026-04-02'),
        description: 'Vintage gold watch with leather strap. Family heirloom. Very sentimental value.',
        contact: 'mark.student@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80'
    },
    {
        itemName: 'Prescription Glasses',
        category: 'Accessories',
        lastSeenLocation: 'Medical Office',
        dateLost: new Date('2026-04-04'),
        description: 'Black Ray-Ban prescription glasses. Very thick prescription. Need urgently.',
        contact: 'vision.student@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80'
    },
    {
        itemName: 'Backpack (North Face)',
        category: 'Accessories',
        lastSeenLocation: 'Main Entrance',
        dateLost: new Date('2026-03-25'),
        description: 'Black North Face backpack. Used for hiking. Many pockets. Has keys inside.',
        contact: '+1-555-0300',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80'
    },
    
    // Books & Course Materials
    {
        itemName: 'Organic Chemistry Textbook',
        category: 'Books',
        lastSeenLocation: 'Science Building Hallway',
        dateLost: new Date('2026-03-30'),
        description: 'Organic Chemistry 4th Edition. Red cover with yellow highlights. Very important for mid-term.',
        contact: 'chemistry.student@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&q=80'
    },
    {
        itemName: 'Calculus Textbook & Notes',
        category: 'Books',
        lastSeenLocation: 'Mathematics Building Lobby',
        dateLost: new Date('2026-03-28'),
        description: 'Stewart Calculus 8th Edition. Heavy blue textbook with extensive annotations.',
        contact: '+1-555-0400',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&q=80'
    },
    {
        itemName: 'Lab Notebook (Physics)',
        category: 'Books',
        lastSeenLocation: 'Physics Lab, Room 201',
        dateLost: new Date('2026-03-25'),
        description: 'Black spiral notebook with physics lab experiments. Contains important calculations and formulas.',
        contact: 'physics.lab@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1519652520304-e5e11011758f?w=300&q=80'
    },
    {
        itemName: 'Economics Lecture Notes',
        category: 'Books',
        lastSeenLocation: 'Economics Department',
        dateLost: new Date('2026-03-27'),
        description: 'Comprehensive lecture notes from Prof. Anderson. Covers 8 chapters. Handwritten.',
        contact: 'econ.student@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1519652520304-e5e11011758f?w=300&q=80'
    },
    {
        itemName: 'Programming Textbook (Python)',
        category: 'Books',
        lastSeenLocation: 'CS Building, Floor 2',
        dateLost: new Date('2026-04-03'),
        description: '"Learning Python" 2nd Edition. Used for CS101 course. Bookmarks inside.',
        contact: '+1-555-0500',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&q=80'
    },
    
    // Clothing & Personal Items
    {
        itemName: 'Winter Jacket (Black)',
        category: 'Clothing',
        lastSeenLocation: 'Student Union Building',
        dateLost: new Date('2026-03-20'),
        description: 'Black puffer jacket with hood. Size M. Has student union pass in pocket.',
        contact: 'winter.jacket@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=300&q=80'
    },
    {
        itemName: 'Red Sports Jacket',
        category: 'Clothing',
        lastSeenLocation: 'University Gym - Locker Room',
        dateLost: new Date('2026-03-26'),
        description: 'Red Adidas sports jacket with white stripes. Size L. Breathable material.',
        contact: '+1-555-0600',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80'
    },
    {
        itemName: 'Blue Sneakers (Nike)',
        category: 'Clothing',
        lastSeenLocation: 'Dormitory Main Hall',
        dateLost: new Date('2026-03-21'),
        description: 'Blue and white Nike Air Max. Size 11. Worn but in good condition.',
        contact: 'sports.student@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80'
    },
    
    // Other Items
    {
        itemName: 'Car Keys (Toyota)',
        category: 'Accessories',
        lastSeenLocation: 'Parking Lot Level 3',
        dateLost: new Date('2026-04-05'),
        description: 'Toyota car key with red keychain. Lost near campus parking. Need urgently.',
        contact: '+1-555-0700',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1486260377935-37e499bed265?w=300&q=80'
    },
    {
        itemName: 'House Keys (3 keys)',
        category: 'Accessories',
        lastSeenLocation: 'Library Study Area',
        dateLost: new Date('2026-03-24'),
        description: 'Three house keys on a blue keychain. Two silver, one gold-colored.',
        contact: 'home.keys@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1486260377935-37e499bed265?w=300&q=80'
    },
    {
        itemName: 'Student Planner',
        category: 'Books',
        lastSeenLocation: 'Main Lecture Hall',
        dateLost: new Date('2026-03-31'),
        description: 'Brown leather planner with pen. University calendar for 2026. Class schedule inside.',
        contact: '+1-555-0800',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1611407433556-8e7a0c1a1c1f?w=300&q=80'
    },
];

const foundItemsData = [
    // Electronics Found Items
    {
        itemName: 'iPhone 14',
        locationFound: 'Library Main Entrance',
        dateFound: new Date('2026-04-05'),
        description: 'iPhone 14 in black. Found near the main entrance. Fingerprint unlock works. No cracks.',
        finderContact: '+1-555-1000',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1592286927505-1def25115858?w=300&q=80'
    },
    {
        itemName: 'Samsung Galaxy Watch',
        locationFound: 'Fitness Center',
        dateFound: new Date('2026-04-06'),
        description: 'Black Samsung Galaxy Watch 5. Battery working. Found on treadmill.',
        finderContact: 'fitness@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80'
    },
    {
        itemName: 'USB Drive (32GB)',
        locationFound: 'Computer Lab',
        dateFound: new Date('2026-04-04'),
        description: 'Blue USB drive with label "CS Project". Contains presentation files.',
        finderContact: '+1-555-1100',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&q=80'
    },
    {
        itemName: 'Wireless Mouse',
        locationFound: 'IT Building Ground Floor',
        dateFound: new Date('2026-04-03'),
        description: 'Black Logitech wireless mouse. Batteries included. Found near printer area.',
        finderContact: 'campus.lost.found@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&q=80'
    },
    {
        itemName: 'Phone Charger (USB-C)',
        locationFound: 'Student Cafeteria',
        dateFound: new Date('2026-04-02'),
        description: 'Fast charging USB-C cable. Black, 6ft long. Found on dining table.',
        finderContact: '+1-555-1200',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1591290619887-d38e796502ce?w=300&q=80'
    },
    
    // Clothing & Accessories Found Items
    {
        itemName: 'Blue Backpack (Nike)',
        locationFound: 'Cafeteria',
        dateFound: new Date('2026-04-04'),
        description: 'Blue Nike backpack with multiple pockets. Contains some class notes and water bottle.',
        finderContact: 'found.items@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80'
    },
    {
        itemName: 'Red Scarf (Wool)',
        locationFound: 'Main Library',
        dateFound: new Date('2026-04-05'),
        description: 'Cozy red wool scarf. Appears brand new. Found wrapped around library chair.',
        finderContact: '+1-555-1300',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1523746122535-47519d2b1f4f?w=300&q=80'
    },
    {
        itemName: 'Black Umbrella',
        locationFound: 'Student Center Entrance',
        dateFound: new Date('2026-04-01'),
        description: 'Black compact umbrella. Automatic open/close. Metal handle.',
        finderContact: 'security@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1590080876-a9b33e9c8f40?w=300&q=80'
    },
    {
        itemName: 'Pair of Headphones (Skullcandy)',
        locationFound: 'Business School Hallway',
        dateFound: new Date('2026-03-31'),
        description: 'Red Skullcandy headphones. Over-ear style. Slightly worn but functional.',
        finderContact: '+1-555-1400',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80'
    },
    
    // Books & Documents
    {
        itemName: 'Glasses (Prescription)',
        locationFound: 'Science Library Reading Area',
        dateFound: new Date('2026-04-03'),
        description: 'Black framed prescription glasses. Ray-Ban style. Left on study desk.',
        finderContact: '+1-555-2000',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80'
    },
    {
        itemName: 'Student Planner (Leather)',
        locationFound: 'Main Lecture Hall',
        dateFound: new Date('2026-03-31'),
        description: 'Brown leather planner with pen holder. Contains class schedule and contact info.',
        finderContact: '+1-555-3000',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1611407433556-8e7a0c1a1c1f?w=300&q=80'
    },
    {
        itemName: 'Math Notebook',
        locationFound: 'Dormitory Common Room',
        dateFound: new Date('2026-04-02'),
        description: 'Spiral-bound math notebook. Contains calculus formulas and diagrams.',
        finderContact: '+1-555-3100',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1519652520304-e5e11011758f?w=300&q=80'
    },
    {
        itemName: 'ID Card (Visitor)',
        locationFound: 'Engineering Building Entrance',
        dateFound: new Date('2026-04-04'),
        description: 'Visitor ID card with name partially visible. Blue and white design.',
        finderContact: 'building.security@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1579546622759-f0ec0e442ab0?w=300&q=80'
    },
    
    // Keys & Miscellaneous
    {
        itemName: 'Car Keys (Nissan)',
        locationFound: 'Parking Lot Level 2',
        dateFound: new Date('2026-03-28'),
        description: 'Nissan car keys with blue keychain. Red Nissan logo. Found near parking entrance.',
        finderContact: 'security@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1486260377935-37e499bed265?w=300&q=80'
    },
    {
        itemName: 'House Keys (4 keys)',
        locationFound: 'Library Study Area',
        dateFound: new Date('2026-04-05'),
        description: 'Four house keys on a silver keychain. Keys have different colors.',
        finderContact: '+1-555-3200',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1486260377935-37e499bed265?w=300&q=80'
    },
    {
        itemName: 'Bicycle Lock Key',
        locationFound: 'Bike Rack Area',
        dateFound: new Date('2026-04-01'),
        description: 'Master Lock key in red plastic holder. Number "2847" visible.',
        finderContact: 'campus@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1486260377935-37e499bed265?w=300&q=80'
    },
    {
        itemName: 'Wallet (Brown Leather)',
        locationFound: 'Student Union Coffee Shop',
        dateFound: new Date('2026-04-06'),
        description: 'Brown leather wallet. Contains cards but no ID. Found under chair.',
        finderContact: '+1-555-3300',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80'
    },
    {
        itemName: 'Sports Water Bottle',
        locationFound: 'Gym Weight Room',
        dateFound: new Date('2026-03-29'),
        description: 'Blue and black sports water bottle. 32 oz capacity. Contains residual water.',
        finderContact: 'fitness@uni.edu',
        status: 'Pending',
        image: 'https://images.unsplash.com/photo-1602088113235-229c19758e9f?w=300&q=80'
    }
];

const seedDatabase = async () => {
    try {
        // Clear existing data
        await LostItem.deleteMany({});
        await FoundItem.deleteMany({});
        console.log('🧹 Cleared existing data');

        // Insert lost items
        await LostItem.insertMany(lostItemsData);
        console.log(`✅ Added ${lostItemsData.length} lost items`);

        // Insert found items
        await FoundItem.insertMany(foundItemsData);
        console.log(`✅ Added ${foundItemsData.length} found items`);

        console.log('\n🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed
connectDB().then(seedDatabase);
