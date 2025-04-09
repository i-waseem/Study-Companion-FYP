require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Curriculum = require('../models/Curriculum');

async function backupCurriculum() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all curriculum data
    const curricula = await Curriculum.find({}).lean();
    console.log(`Found ${curricula.length} curriculum documents`);

    // Create backup directory if it doesn't exist
    const backupDir = path.join(__dirname, '..', 'backups');
    await fs.mkdir(backupDir, { recursive: true });

    // Create backup file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `curriculum-backup-${timestamp}.json`);
    
    // Save backup
    await fs.writeFile(backupFile, JSON.stringify(curricula, null, 2));
    console.log(`Backup saved to: ${backupFile}`);

  } catch (error) {
    console.error('Error backing up curriculum data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

backupCurriculum();
