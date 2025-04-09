require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('./models/Curriculum');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      // First remove any existing Pakistan Studies documents
      await Curriculum.deleteMany({
        subject: { 
          $in: ['Pakistan Studies - History', 'Pakistan Studies - Geography']
        }
      });
      console.log('Removed modified Pakistan Studies documents');

      // Create History document with original data
      const historyData = {
        gradeLevel: 'O-Level',
        subject: 'History',
        topics: [
          {
            name: 'Cultural and Historical Background to the Pakistan Movement',
            subtopics: [
              {
                name: 'Religious Thinkers and the Spread of Islam',
                description: 'Understanding Islamic influence in the subcontinent',
                learningObjectives: [
                  'Analyze the role of Sufis and scholars',
                  'Evaluate the spread of Islamic teachings',
                  'Understand cultural synthesis'
                ]
              }
            ]
          }
        ]
      };

      // Create Geography document with original data
      const geographyData = {
        gradeLevel: 'O-Level',
        subject: 'Geography',
        topics: [
          {
            name: 'The Land of Pakistan',
            subtopics: [
              {
                name: 'Physical Geography',
                description: 'Understanding Pakistan\'s landscape',
                learningObjectives: [
                  'Analyze topographical features',
                  'Evaluate climate patterns',
                  'Understand geological formations'
                ]
              }
            ]
          }
        ]
      };

      // Insert original documents
      const history = await Curriculum.create(historyData);
      console.log('Restored History curriculum:', history._id);

      const geography = await Curriculum.create(geographyData);
      console.log('Restored Geography curriculum:', geography._id);

      // Verify the documents
      const docs = await Curriculum.find({
        subject: { 
          $in: ['History', 'Geography']
        }
      }).lean();

      console.log('\nVerifying restored documents:');
      docs.forEach(doc => {
        console.log(`\n${doc.subject}:`);
        console.log('Topics:', doc.topics.map(t => t.name));
      });

    } catch (error) {
      console.error('Error:', error);
    }
    process.exit();
  });
