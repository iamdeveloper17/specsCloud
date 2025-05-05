// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User'); // Correct path to User model

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const existingAdmin = await User.findOne({ email: 'admin@specscloud.com' });

    if (existingAdmin) {
      console.log('✅ Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const adminUser = new User({
      name: 'Super Admin',
      email: 'admin@specscloud.com',
      password: hashedPassword,
      isAdmin: true // 🧠
    });

    await adminUser.save();
    console.log('✅ Admin created successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Failed to create admin', error);
    process.exit(1);
  }
}

createAdmin();
