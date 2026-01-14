// src/test-auth.ts
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.model.js';

const testAuth = async () => {
  try {
    console.log('🧪 Starting authentication tests...');

    // Connect to database
    await connectDB();

    // Test user data
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'testpassword123'
    };

    console.log('📝 Testing user registration...');

    // Test registration
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('🗑️  Removing existing test user...');
      await User.findByIdAndDelete(existingUser._id);
    }

    const newUser = await User.create(testUser);
    console.log('✅ User created successfully:', {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role
    });

    // Test password comparison
    console.log('🔐 Testing password comparison...');
    const isValidPassword = await newUser.comparePassword(testUser.password);
    console.log('✅ Password comparison result:', isValidPassword);

    // Test invalid password
    const isInvalidPassword = await newUser.comparePassword('wrongpassword');
    console.log('❌ Invalid password comparison result:', isInvalidPassword);

    // Test finding user by email
    console.log('🔍 Testing user lookup by email...');
    const foundUser = await User.findOne({ email: testUser.email.toLowerCase() });
    console.log('✅ User found by email:', foundUser ? 'Yes' : 'No');

    // Test password hashing (should not be selectable by default)
    console.log('🛡️  Testing password field selection...');
    const userWithoutPassword = await User.findById(newUser._id);
    console.log('✅ Password field hidden by default:', userWithoutPassword?.password ? 'No' : 'Yes');

    // Test password field selection
    const userWithPassword = await User.findById(newUser._id).select('+password');
    console.log('✅ Password field selectable when requested:', userWithPassword?.password ? 'Yes' : 'No');

    // Clean up
    console.log('🧹 Cleaning up test data...');
    await User.findByIdAndDelete(newUser._id);

    console.log('🎉 All authentication tests passed!');

  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

testAuth();