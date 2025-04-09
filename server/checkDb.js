require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('./models/Curriculum');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      // Get all collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('\nCollections in database:', collections.map(c => c.name));

      // Get all documents from curricula collection
      const curricula = await Curriculum.find({}).lean();
      console.log('\nTotal curricula found:', curricula.length);
      
      curricula.forEach(curr => {
        console.log('\n===================');
        console.log('Grade:', curr.gradeLevel);
        console.log('Subject:', curr.subject);
        console.log('Topics:', curr.topics ? curr.topics.length : 0);
        console.log('Raw document:', JSON.stringify(curr, null, 2));
      });
    } catch (error) {
      console.error('Error:', error);
    }
    process.exit();
  });
