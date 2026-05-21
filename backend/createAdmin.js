const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@gedshop.com' });
    
    if (!adminExists) {
      const admin = await User.create({
        name: 'Super Admin',
        email: 'admin@gedshop.com',
        password: 'admin123456',
        role: 'admin',
        phone: '+251-XXX-XXXXXX',
        isActive: true
      });
      console.log('✅ Admin user created!');
      console.log('📧 Email: admin@gedshop.com');
      console.log('🔑 Password: admin123456');
    } else {
      console.log('⚠️ Admin user already exists!');
    }

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();
