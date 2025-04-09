const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Curriculum = require('../models/Curriculum');
const mongoose = require('mongoose');

// Helper function to convert URL-friendly format back to display format
const fromUrlFriendly = (urlSubject) => {
  if (!urlSubject) return '';
  
  // Special case for Pakistan Studies
  if (urlSubject.startsWith('pakistan-studies-')) {
    const type = urlSubject.replace('pakistan-studies-', '');
    return `Pakistan Studies - ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  }
  
  // General case
  return urlSubject
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get all subjects
router.get('/subjects', async (req, res) => {
  try {
    console.log('=== Fetching Subjects ===');
    
    const curricula = await Curriculum.find({}).select('subject').lean();
    console.log('Raw curricula from DB:', curricula);
    
    // Just return the subject names
    const subjects = curricula.map(c => c.subject);
    console.log('Subjects:', subjects);
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Error fetching subjects', error: error.message });
  }
});

// Get curriculum by subject
router.get('/o-level/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    console.log('=== Fetching Curriculum ===');
    console.log('Requested subject:', subject);
    
    // Convert URL-friendly subject back to proper format
    const displaySubject = subject
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    console.log('Display subject:', displaySubject);
    
    const curriculum = await Curriculum.findOne({
      subject: displaySubject
    }).lean();
    
    if (!curriculum) {
      console.log('No curriculum found for:', displaySubject);
      return res.status(404).json({ message: 'Curriculum not found' });
    }
    
    console.log('Found curriculum:', {
      subject: curriculum.subject,
      topicCount: curriculum.topics?.length || 0
    });
    res.json(curriculum);
  } catch (error) {
    console.error('Error fetching curriculum:', error);
    res.status(500).json({ message: 'Error fetching curriculum', error: error.message });
  }
});

module.exports = router;
