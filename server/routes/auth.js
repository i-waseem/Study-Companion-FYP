const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to set cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
};

// Register route
router.post('/register', async (req, res) => {
  console.log('\n=== Registration Attempt ===');
  console.log('Request body:', {
    username: req.body.username,
    email: req.body.email,
    hasPassword: !!req.body.password
  });
  
  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      console.log('Missing required fields:', {
        hasUsername: !!username,
        hasEmail: !!email,
        hasPassword: !!password
      });
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    console.log('Checking if user exists:', email);
    let user = await User.findOne({ email });

    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    // Create new user
    console.log('Creating new user:', email);
    user = new User({
      username,
      email,
      password // Will be hashed by the model pre-save hook
    });

    // Save user
    await user.save();
    console.log('User saved successfully:', email);

    // Create token
    console.log('Creating JWT token...');
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in cookie
    setTokenCookie(res, token);

    // Return success
    console.log('Registration successful:', email);
    res.status(201).json({
      user: {
        userId: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    res.status(500).json({
      message: 'Registration failed',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        code: error.code
      } : undefined
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  console.log('\n=== Login Attempt ===');
  console.log('Request body:', {
    email: req.body.email,
    hasPassword: !!req.body.password
  });
  
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      console.log('Missing credentials:', { 
        hasEmail: !!email, 
        hasPassword: !!password 
      });
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email with password field
    console.log('Finding user with email:', email);
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    console.log('Comparing passwords...');
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    console.log('Creating JWT token...');
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in cookie
    setTokenCookie(res, token);

    // Return success
    console.log('Login successful:', email);
    res.json({
      user: {
        userId: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    res.status(500).json({
      message: 'Login failed',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        code: error.code
      } : undefined
    });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  console.log('\n=== Logout Attempt ===');
  
  // Clear the token cookie with the same settings
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
