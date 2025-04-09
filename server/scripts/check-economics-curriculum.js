require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('../models/Curriculum');

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if Economics curriculum exists
    const economicsCurriculum = await Curriculum.findOne({ subject: 'Economics' });
    
    if (economicsCurriculum) {
      console.log('Economics curriculum already exists:');
      console.log(JSON.stringify(economicsCurriculum, null, 2));
    } else {
      console.log('Economics curriculum does not exist. Creating it...');
      
      // Create a new Economics curriculum
      const newCurriculum = new Curriculum({
        gradeLevel: 'O-Level',
        subject: 'Economics',
        topics: [
          {
            name: 'Basic Economic Concepts',
            subtopics: [
              {
                name: 'Scarcity, Choice and Resource Allocation',
                description: 'Understanding the fundamental economic problem of scarcity and how it leads to choices and resource allocation.',
                learningObjectives: [
                  'Define scarcity, choice and resource allocation',
                  'Explain the economic problem of unlimited wants and finite resources',
                  'Understand opportunity cost and its implications',
                  'Analyze how different economic systems allocate resources'
                ]
              },
              {
                name: 'Production Possibility Curves',
                description: 'Understanding how economies make choices about resource allocation using production possibility curves.',
                learningObjectives: [
                  'Interpret production possibility curves',
                  'Explain the concepts of efficiency and inefficiency',
                  'Analyze shifts in production possibility curves',
                  'Apply the concept to real-world economic decisions'
                ]
              }
            ]
          },
          {
            name: 'Market Systems',
            subtopics: [
              {
                name: 'Demand and Supply Analysis',
                description: 'Understanding how markets work through the interaction of demand and supply.',
                learningObjectives: [
                  'Define demand and supply',
                  'Explain the factors affecting demand and supply',
                  'Analyze market equilibrium and disequilibrium',
                  'Evaluate the impact of changes in demand and supply on market outcomes'
                ]
              },
              {
                name: 'Price Elasticity',
                description: 'Understanding how responsive quantity demanded and supplied are to changes in price.',
                learningObjectives: [
                  'Define price elasticity of demand and supply',
                  'Calculate price elasticity coefficients',
                  'Analyze factors affecting elasticity',
                  'Evaluate the implications of elasticity for businesses and government policy'
                ]
              }
            ]
          },
          {
            name: 'Macroeconomics',
            subtopics: [
              {
                name: 'National Income',
                description: 'Understanding how to measure a country\'s economic performance.',
                learningObjectives: [
                  'Define GDP, GNP, and other national income measures',
                  'Explain methods of calculating national income',
                  'Analyze limitations of national income statistics',
                  'Evaluate the use of national income data for comparing living standards'
                ]
              },
              {
                name: 'Inflation and Unemployment',
                description: 'Understanding two key macroeconomic problems and their causes and consequences.',
                learningObjectives: [
                  'Define inflation and unemployment',
                  'Explain types and causes of inflation and unemployment',
                  'Analyze the relationship between inflation and unemployment',
                  'Evaluate government policies to address these issues'
                ]
              }
            ]
          }
        ]
      });

      const savedCurriculum = await newCurriculum.save();
      console.log('Economics curriculum created successfully:');
      console.log(JSON.stringify(savedCurriculum, null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

main();
