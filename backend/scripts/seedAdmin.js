const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jellof', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function seedAdminUser() {
  try {
    console.log('🌱 Seeding admin user...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@jellof.com' });
    
    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      console.log('Email: admin@jellof.com');
      console.log('If you forgot the password, delete the user and run this script again.');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const admin = new User({
      name: 'Admin',
      email: 'admin@jellof.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    await admin.save();

    console.log('\n✓ Admin user created successfully!');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:    admin@jellof.com');
    console.log('🔐 Password: Admin@123');
    console.log('═══════════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
    console.log('\nYou can now login at: http://localhost:4200/admin/login\n');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✓ Connected to MongoDB');
  seedAdminUser();
});

mongoose.connection.on('error', (err) => {
  console.error('✗ MongoDB connection error:', err);
  process.exit(1);
});