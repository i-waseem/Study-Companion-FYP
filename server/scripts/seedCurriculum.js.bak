require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('../models/Curriculum');
const curriculumData = require('../data/curriculumData');

async function seedCurriculum() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing curriculum data
    await Curriculum.deleteMany({});
    console.log('Cleared existing curriculum data');

    // Insert new curriculum data
    const result = await Curriculum.insertMany(curriculumData);
    console.log(`Seeded ${result.length} curriculum documents`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding curriculum data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedCurriculum();
