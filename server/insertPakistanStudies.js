require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('./models/Curriculum');

const historyData = {
  gradeLevel: 'O-Level',
  subject: 'Pakistan Studies - History',
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
        },
        {
          name: 'Decline of the Mughal Empire',
          description: 'Understanding factors leading to Mughal decline',
          learningObjectives: [
            'Analyze political weaknesses',
            'Evaluate economic factors',
            'Understand social changes'
          ]
        }
      ]
    },
    {
      name: 'The Emergence of Pakistan (1906–1947)',
      subtopics: [
        {
          name: 'Formation of the Muslim League',
          description: 'Understanding the birth of Muslim political identity',
          learningObjectives: [
            'Analyze the formation process',
            'Evaluate early leadership',
            'Understand political objectives'
          ]
        },
        {
          name: 'Constitutional Developments',
          description: 'Understanding major constitutional milestones',
          learningObjectives: [
            'Analyze Jinnah\'s 14 Points',
            'Evaluate the Round Table Conferences',
            'Understand the Government of India Act 1935'
          ]
        }
      ]
    }
  ]
};

const geographyData = {
  gradeLevel: 'O-Level',
  subject: 'Pakistan Studies - Geography',
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
        },
        {
          name: 'Natural Resources',
          description: 'Understanding resource distribution',
          learningObjectives: [
            'Analyze mineral deposits',
            'Evaluate water resources',
            'Understand soil types'
          ]
        }
      ]
    },
    {
      name: 'Population and Employment',
      subtopics: [
        {
          name: 'Demographics',
          description: 'Understanding population patterns',
          learningObjectives: [
            'Analyze population growth',
            'Evaluate urban migration',
            'Understand age distribution'
          ]
        },
        {
          name: 'Employment Issues',
          description: 'Understanding labor market',
          learningObjectives: [
            'Analyze employment sectors',
            'Evaluate skill gaps',
            'Understand labor policies'
          ]
        }
      ]
    }
  ]
};

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
      console.log('Removed existing Pakistan Studies documents');

      // Insert new documents
      const history = await Curriculum.create(historyData);
      console.log('Inserted History curriculum:', history._id);

      const geography = await Curriculum.create(geographyData);
      console.log('Inserted Geography curriculum:', geography._id);

      // Verify the documents
      const docs = await Curriculum.find({
        subject: { 
          $in: ['Pakistan Studies - History', 'Pakistan Studies - Geography']
        }
      }).lean();

      console.log('\nVerifying inserted documents:');
      docs.forEach(doc => {
        console.log(`\n${doc.subject}:`);
        console.log('Topics:', doc.topics.map(t => t.name));
      });

    } catch (error) {
      console.error('Error:', error);
    }
    process.exit();
  });
