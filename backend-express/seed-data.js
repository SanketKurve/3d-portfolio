require('dotenv').config();
const mongoose = require('mongoose');
const AdminUser = require('./models/AdminUser');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Certificate = require('./models/Certificate');

async function seedDatabase() {
  console.log('🌱 Seeding database...');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await AdminUser.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Certificate.deleteMany({});

    // Create admin user
    const adminUser = new AdminUser({
      username: 'SanketKurve',
      email: 'sanketkurve.2005@gmail.com',
      passwordHash: 'sanket2005', // Will be hashed by pre-save hook
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created');

    // Seed projects
    const projects = [
      {
        title: 'Hajeeri',
        tagline: 'AI-powered attendance system',
        description: 'Revolutionary attendance tracking system using AI face recognition to automate attendance marking and generate insights.',
        longDescription: 'Hajeeri transforms traditional attendance systems with cutting-edge AI technology. Using advanced face recognition algorithms, it automatically marks attendance, eliminating manual errors and saving valuable time. The system provides real-time analytics and comprehensive reporting features.',
        tech: ['Python', 'AI/ML', 'Django', 'React', 'MongoDB'],
        features: [
          'Real-time face recognition',
          'Automated attendance marking',
          'Analytics dashboard',
          'Report generation'
        ],
        year: 2024,
        category: 'ai',
        status: 'completed',
        featured: true,
        visible: true
      },
      {
        title: 'Gradient',
        tagline: 'AI-powered student expense tracker',
        description: 'Smart expense tracking app for students with AI-powered insights and budget recommendations.',
        longDescription: 'Gradient helps students take control of their finances with intelligent expense tracking and AI-powered budget suggestions. The app categorizes expenses automatically, provides spending insights, and sends timely reminders for bills and payments.',
        tech: ['React', 'Node.js', 'AI/ML', 'MongoDB'],
        features: [
          'Expense categorization',
          'AI budget suggestions',
          'Spending analytics',
          'Bill reminders'
        ],
        year: 2024,
        category: 'web',
        status: 'completed',
        featured: true,
        visible: true
      }
    ];

    await Project.insertMany(projects);
    console.log(`✅ ${projects.length} projects seeded`);

    // Seed skills
    const skills = [
      { name: 'C', category: 'Programming', level: 80, icon: '⚡', yearsOfExperience: 3, order: 1, visible: true },
      { name: 'Java', category: 'Programming', level: 85, icon: '☕', yearsOfExperience: 3, order: 2, visible: true },
      { name: 'Python', category: 'Programming', level: 90, icon: '🐍', yearsOfExperience: 4, projects: ['Hajeeri'], order: 3, visible: true },
      { name: 'React', category: 'Frontend', level: 85, icon: '⚛️', yearsOfExperience: 2, projects: ['Hajeeri', 'Gradient'], order: 4, visible: true },
      { name: 'Node.js', category: 'Backend', level: 80, icon: '🟢', yearsOfExperience: 2, projects: ['Gradient'], order: 5, visible: true },
      { name: 'Express.js', category: 'Backend', level: 80, icon: '🚂', yearsOfExperience: 2, projects: ['Gradient'], order: 6, visible: true },
      { name: 'Django', category: 'Backend', level: 75, icon: '🎸', yearsOfExperience: 2, projects: ['Hajeeri'], order: 7, visible: true },
      { name: 'MongoDB', category: 'Database', level: 75, icon: '🍃', yearsOfExperience: 2, projects: ['Hajeeri', 'Gradient'], order: 8, visible: true }
    ];

    await Skill.insertMany(skills);
    console.log(`✅ ${skills.length} skills seeded`);

    // Seed certificates
    const certificates = [
      {
        name: 'Python for Data Science',
        issuer: 'Coursera',
        date: '2024',
        description: 'Completed comprehensive Python course for data science applications',
        credentialId: 'CERT-123456',
        verifyUrl: '',
        status: 'active',
        category: 'Programming',
        priority: 1,
        visible: true
      },
      {
        name: 'Full Stack Web Development',
        issuer: 'Udemy',
        date: '2023',
        description: 'Mastered MERN stack development',
        credentialId: 'CERT-789012',
        verifyUrl: '',
        status: 'active',
        category: 'Web Development',
        priority: 2,
        visible: true
      }
    ];

    await Certificate.insertMany(certificates);
    console.log(`✅ ${certificates.length} certificates seeded`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Admin Credentials:');
    console.log('   Username: SanketKurve');
    console.log('   Password: sanket2005');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📴 Disconnected from MongoDB');
  }
}

seedDatabase();
