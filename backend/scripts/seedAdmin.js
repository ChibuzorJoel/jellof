const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jellof');

async function seedAdminUser() {
  try {
    console.log('🌱 Seeding admin user...');

    await User.deleteOne({ email: 'admin@jellof.com' }); // 🔥 remove old broken admin

    const admin = new User({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@jellof.com',
      password: 'Admin@124', // ✅ PLAIN PASSWORD
      role: 'admin',
      isActive: true
    });

    await admin.save(); // 🔐 hashing happens here automatically

    console.log('✅ Admin user created');
    console.log('Email: admin@jellof.com');
    console.log('Password: Admin@124');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

mongoose.connection.once('connected', seedAdminUser);