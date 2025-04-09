require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Curriculum = require('../models/Curriculum');

async function loadCurriculum() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Read curriculum data
    const dataPath = path.join(__dirname, '..', 'data', 'curriculum.json');
    const rawData = await fs.readFile(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // Clear existing curriculum data
    await Curriculum.deleteMany({});
    console.log('Cleared existing curriculum data');

    // Insert new curriculum data
    const result = await Curriculum.insertMany(data.curricula);
    console.log(`Inserted ${result.length} curriculum documents`);

    console.log('Curriculum data loaded successfully');
  } catch (error) {
    console.error('Error loading curriculum data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

loadCurriculum();
