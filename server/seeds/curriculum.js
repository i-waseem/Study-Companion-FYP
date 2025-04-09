const mongoose = require('mongoose');
const Curriculum = require('../models/Curriculum');
require('dotenv').config();

const economicsCurriculum = {
  gradeLevel: 'O-Level',
  subject: 'Economics',
  topics: [
    {
      name: 'Basic Economic Concepts',
      subtopics: [
        {
          name: 'Scarcity and Choice',
          description: 'Understanding the fundamental economic problem of unlimited wants and limited resources',
          learningObjectives: [
            'Define scarcity and explain why it is the fundamental economic problem',
            'Understand how economic agents make choices based on unlimited wants and limited resources',
            'Explain the concept of opportunity cost and its role in decision making',
            'Analyze how different economic systems address the basic economic questions'
          ]
        },
        {
          name: 'Factors of Production',
          description: 'Understanding the four main factors of production',
          learningObjectives: [
            'Identify and explain the four factors of production: land, labor, capital, and enterprise',
            'Understand how factors of production are combined to produce goods and services',
            'Analyze the rewards to factors of production: rent, wages, interest, and profit',
            'Evaluate the importance of entrepreneurship in the modern economy'
          ]
        }
      ]
    },
    {
      name: 'Market Forces',
      subtopics: [
        {
          name: 'Demand and Supply',
          description: 'Understanding how market prices are determined',
          learningObjectives: [
            'Define demand and explain the factors affecting demand',
            'Define supply and explain the factors affecting supply',
            'Understand how market equilibrium is achieved',
            'Analyze the effects of changes in demand and supply on market equilibrium'
          ]
        },
        {
          name: 'Price Elasticity',
          description: 'Understanding how responsive quantity is to price changes',
          learningObjectives: [
            'Define price elasticity of demand and supply',
            'Calculate price elasticity using various methods',
            'Understand the factors affecting price elasticity',
            'Analyze the relationship between elasticity and total revenue'
          ]
        }
      ]
    }
  ]
};

async function seedCurriculum() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing curriculum data
    await Curriculum.deleteMany({ gradeLevel: 'O-Level', subject: 'Economics' });
    console.log('Cleared existing Economics curriculum');

    // Insert new curriculum data
    const curriculum = await Curriculum.create(economicsCurriculum);
    console.log('Created Economics curriculum:', curriculum._id);

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding curriculum:', error);
    process.exit(1);
  }
}

seedCurriculum();
