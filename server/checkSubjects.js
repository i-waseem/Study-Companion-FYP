require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('./models/Curriculum');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      // Get all O-Level subjects
      const subjects = await Curriculum.find({ gradeLevel: 'O-Level' }).select('subject topics').lean();
      
      console.log('\nO-Level Subjects:', subjects.length);
      subjects.forEach(s => {
        console.log('\nSubject:', s.subject);
        console.log('Topics:', s.topics ? s.topics.length : 0);
        if (s.topics) {
          s.topics.forEach(t => {
            console.log(`- ${t.name}`);
            if (t.subtopics) {
              t.subtopics.forEach(st => console.log(`  * ${st.name}`));
            }
          });
        }
      });

      // Get raw document for Pakistan Studies subjects
      console.log('\nPakistan Studies - History Document:');
      const historyDoc = await Curriculum.findOne({ 
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies - History'
      }).lean();
      console.log(JSON.stringify(historyDoc, null, 2));

      console.log('\nPakistan Studies - Geography Document:');
      const geoDoc = await Curriculum.findOne({ 
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies - Geography'
      }).lean();
      console.log(JSON.stringify(geoDoc, null, 2));

    } catch (error) {
      console.error('Error:', error);
    }
    process.exit();
  });
