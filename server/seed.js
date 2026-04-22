require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Club = require('./models/Club');
const Application = require('./models/Application');

const CLUBS = [
  // Technology & Academic
  {
    name: "FOSS Community",
    category: "Technology",
    memberCount: 250,
    description: "Centering on Free and Open Source Software advocacy.",
    about: "The FOSS Community at SLIIT is one of the most active groups, focusing on advocacy for Free and Open Source Software. we organize hackathons, workshops, and contribute to global open-source projects. Our mission is to promote software freedom and digital privacy through hands-on learning.",
    logoUrl: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=400",
    tags: ["opensource", "linux", "git", "hackathons"],
    gallery: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    name: "Microsoft Student Community",
    category: "Technology",
    memberCount: 180,
    description: "Focusing on Cloud, AI, and Microsoft technologies.",
    about: "The Microsoft Student Community empowers students to learn and grow with cutting-edge technologies. We host Azure bootcamps, AI workshops, and prepare students for Microsoft certifications. Join us to build your career in the modern tech ecosystem.",
    logoUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=400",
    tags: ["azure", "ai", "dotnet", "cloud"],
    gallery: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1451187530230-b237ee3269d0?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    name: "SLIIT Software Engineering Community (SSEC)",
    category: "Academic",
    memberCount: 300,
    description: "A specialized community for developers to collaborate.",
    about: "SSEC is the main hub for software engineering students. We focus on software architecture, design patterns, and helping students build their first production-grade applications. We collaborate on internal tools and university-wide software projects.",
    logoUrl: "https://images.unsplash.com/photo-1461749280684-dccba63032d6?auto=format&fit=crop&q=80&w=400",
    tags: ["software_engineering", "sdlc", "agile", "coding"],
    gallery: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    name: "Cyber Security Community",
    category: "Technology",
    memberCount: 120,
    description: "Dedicated to ethical hacking and digital security.",
    about: "The Cyber Security Community is for those interested in white-hat hacking, CTF competitions, and network defense. We organize sessions on vulnerability assessment, cryptography, and modern security protocols to keep the digital world safe.",
    logoUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400",
    tags: ["security", "hacking", "ctf", "privacy"],
    gallery: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1510511459019-5dee997d7db4?auto=format&fit=crop&q=80&w=800"
    ]
  },
  // Professional & Leadership
  {
    name: "AIESEC in SLIIT",
    category: "Leadership",
    memberCount: 450,
    description: "Global youth-led leadership development.",
    about: "AIESEC is the world's largest youth-led organization. We focus on cross-cultural exchanges and leadership development. Members get opportunities to work on international internships and volunteer projects that address the SDGs.",
    logoUrl: "https://images.unsplash.com/photo-1522071823991-b1ae5e6a30c8?auto=format&fit=crop&q=80&w=400",
    tags: ["leadership", "exchange", "global", "volunteering"],
    gallery: [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    name: "Gavel Club",
    category: "Leadership",
    memberCount: 95,
    description: "Improving public speaking and communication skills.",
    about: "The SLIIT Gavel Club provides a safe environment for students to improve their public speaking, impromptu speaking, and constructive feedback skills. Following Toastmasters guidelines, we help students find their true voice.",
    logoUrl: "https://images.unsplash.com/photo-1475721027785-f7496038755b?auto=format&fit=crop&q=80&w=400",
    tags: ["public_speaking", "communication", "soft_skills", "debating"],
    gallery: [
      "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    name: "Rotaract Club of SLIIT",
    category: "Community",
    memberCount: 520,
    description: "Service-based club for professional development.",
    about: "Rotaract SLIIT is a premier service organization. We focus on community service, professional development, and fellowship. From blood donation drives to entrepreneurship workshops, we make a lasting impact on society.",
    logoUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400",
    tags: ["community_service", "volunteering", "networking", "professional_development"],
    gallery: [
      "https://images.unsplash.com/photo-1521791136064-7986c29596a3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    name: "LEO Club of SLIIT",
    category: "Community",
    memberCount: 380,
    description: "Leadership through community service projects.",
    about: "The LEO Club empowers students to serve their local communities while developing vital leadership skills. We organize environmental projects, educational support for underprivileged children, and health camps across the country.",
    logoUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=400",
    tags: ["leadership", "experience", "opportunity", "volunteering"],
    gallery: [
      "https://images.unsplash.com/photo-1461896756913-c35467367673?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"
    ]
  },
  // Media & Creative Arts
  {
    name: "Media Unit",
    category: "Media",
    memberCount: 150,
    description: "Centering on Photography, Videography, and Content Creation.",
    about: "The Media Unit is the primary content creation body of SLIIT. We cover all university events, from sports to ceremonies. Our members get exposure to professional cameras, editing software, and digital marketing strategies.",
    logoUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400",
    tags: ["media", "photography", "videography", "editing"],
    gallery: [
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1478720143907-6f018e6924ec?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    name: "Drama Society",
    category: "Arts",
    memberCount: 80,
    description: "Exploring the world of Performing Arts and Theater.",
    about: "The Drama Society is for those who love the stage. We produce several plays throughout the year, focusing on both traditional and contemporary theater. Members can explore acting, scriptwriting, and stage management.",
    logoUrl: "https://images.unsplash.com/photo-1503091315242-cb8bb2321c8e?auto=format&fit=crop&q=80&w=400",
    tags: ["drama", "acting", "theater", "performance"],
    gallery: [
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800"
    ]
  },
  // Wellness & Special Interest
  {
    name: "Student Wellness Club",
    category: "Wellness",
    memberCount: 130,
    description: "Focusing on Mental Health and Well-being.",
    about: "The Wellness Club advocate for student mental health. We organize yoga sessions, meditation retreats, and awareness seminars to help students cope with academic stress and maintain a balanced lifestyle.",
    logoUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400",
    tags: ["wellness", "mental_health", "wellbeing", "yoga"],
    gallery: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    name: "Sports Council",
    category: "Sports",
    memberCount: 600,
    description: "Managing various campus sports teams.",
    about: "The Sports Council is the central body for all inter-university sports. We manage teams for Cricket, Rugby, Basketball, Athletics, and more. Our goal is to promote fitness and bring glory to SLIIT in the national arena.",
    logoUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400",
    tags: ["sports", "fitness", "teamwork", "cricket", "rugby"],
    gallery: [
      "https://images.unsplash.com/photo-1461896756913-c35467367673?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=800"
    ]
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Club.deleteMany();
    await Application.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin accounts
    const admin1 = await User.create({
      name: 'Admin One',
      email: 'admin@unimate.lk',
      password: 'admin123',
      role: 'admin',
    });
    const admin2 = await User.create({
      name: 'Admin Two',
      email: 'admin2@unimate.lk',
      password: 'admin456',
      role: 'admin',
    });
    console.log('👤 Admin accounts created: admin@unimate.lk / admin123');

    // Create sample student
    const student = await User.create({
      name: 'Kamal Perera',
      studentId: 'IT2324616',
      email: 'kamal@slit.lk',
      password: 'kamal123',
      role: 'student',
    });
    console.log('🎓 Sample student created: kamal@slit.lk / kamal123');

    // Create clubs
    const clubs = await Club.insertMany(CLUBS);
    console.log(`🏛️  ${clubs.length} clubs seeded`);

    // Create a sample application
    await Application.create({
      studentId: student._id,
      clubId: clubs[0]._id,
      studentName: 'Kamal Perera',
      studentIdNumber: 'IT2324616',
      preferredRole: 'Member',
      reason: 'I am passionate about software development and want to expand my skills through collaborative projects and hackathons.',
      status: 'Pending',
    });
    console.log('📄 Sample application created');

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
