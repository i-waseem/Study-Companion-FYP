require('dotenv').config();
const mongoose = require('mongoose');
const FlashcardSet = require('../models/FlashcardSet');

const economicsFlashcards = [
  {
    gradeLevel: 'O-Level',
    subject: 'Economics',
    topic: 'Basic Economic Concepts',
    subtopic: 'Scarcity and Choice',
    cards: [
      {
        question: 'What is scarcity in economics?',
        answer: 'Scarcity refers to the basic economic problem that resources are limited but human wants are unlimited. This leads to the need for making choices about how to use available resources.',
        type: 'definition'
      },
      {
        question: 'What are the factors of production?',
        answer: 'The four factors of production are:\n1. Land (natural resources)\n2. Labor (human resources)\n3. Capital (man-made resources)\n4. Enterprise (entrepreneurship)',
        type: 'concept'
      },
      {
        question: 'What is opportunity cost?',
        answer: 'Opportunity cost is the value of the next best alternative that must be given up when making a choice. For example, if you spend money on a movie ticket, the opportunity cost might be the book you could have bought instead.',
        type: 'concept'
      },
      {
        question: 'Explain the economic problem of choice',
        answer: 'The economic problem of choice arises because:\n1. Human wants are unlimited\n2. Resources are limited\n3. Resources have alternative uses\n4. We must decide how to allocate resources efficiently',
        type: 'concept'
      }
    ]
  },
  {
    gradeLevel: 'O-Level',
    subject: 'Economics',
    topic: 'Basic Economic Concepts',
    subtopic: 'Economic Systems',
    cards: [
      {
        question: 'What are the three main types of economic systems?',
        answer: '1. Market/Capitalist Economy: Based on private ownership and market forces\n2. Command/Planned Economy: Government controls resources and production\n3. Mixed Economy: Combines elements of both market and planned systems',
        type: 'concept'
      },
      {
        question: 'What are the key features of a market economy?',
        answer: '1. Private ownership of resources\n2. Price mechanism determines allocation\n3. Consumer sovereignty\n4. Competition between producers\n5. Profit motive drives production\n6. Limited government intervention',
        type: 'concept'
      },
      {
        question: 'What is the role of government in a mixed economy?',
        answer: 'In a mixed economy, the government:\n1. Provides public goods and services\n2. Regulates private sector activities\n3. Implements fiscal and monetary policies\n4. Ensures social welfare\n5. Corrects market failures',
        type: 'concept'
      }
    ]
  },
  {
    gradeLevel: 'O-Level',
    subject: 'Economics',
    topic: 'Market Forces',
    subtopic: 'Demand',
    cards: [
      {
        question: 'What is the law of demand?',
        answer: 'The law of demand states that, other things being equal, as the price of a good or service increases, the quantity demanded decreases, and vice versa. This creates a downward-sloping demand curve.',
        type: 'definition'
      },
      {
        question: 'What factors affect demand?',
        answer: 'Factors affecting demand include:\n1. Price of the good\n2. Income of consumers\n3. Prices of related goods (substitutes/complements)\n4. Tastes and preferences\n5. Population/Market size\n6. Future price expectations',
        type: 'concept'
      },
      {
        question: 'What is the difference between a change in demand and a change in quantity demanded?',
        answer: '- Change in Quantity Demanded: Movement along the demand curve caused by a change in price\n- Change in Demand: Shift of the entire demand curve caused by changes in other factors (income, preferences, etc.)',
        type: 'concept'
      }
    ]
  },
  {
    gradeLevel: 'O-Level',
    subject: 'Economics',
    topic: 'Market Forces',
    subtopic: 'Supply',
    cards: [
      {
        question: 'What is the law of supply?',
        answer: 'The law of supply states that, other things being equal, as the price of a good or service increases, the quantity supplied increases, and vice versa. This creates an upward-sloping supply curve.',
        type: 'definition'
      },
      {
        question: 'What factors affect supply?',
        answer: 'Factors affecting supply include:\n1. Price of the product\n2. Cost of production\n3. Technology\n4. Government policies\n5. Number of sellers\n6. Prices of related goods\n7. Future price expectations',
        type: 'concept'
      },
      {
        question: 'What is producer surplus?',
        answer: 'Producer surplus is the difference between what producers are willing to accept for their goods and what they actually receive. It represents the additional benefit producers get from selling at the market price.',
        type: 'concept'
      }
    ]
  },
  {
    gradeLevel: 'O-Level',
    subject: 'Economics',
    topic: 'Market Forces',
    subtopic: 'Price Mechanism',
    cards: [
      {
        question: 'What is market equilibrium?',
        answer: 'Market equilibrium occurs when quantity demanded equals quantity supplied at a specific price (equilibrium price). At this point, there is no tendency for price to change.',
        type: 'definition'
      },
      {
        question: 'How does the price mechanism work?',
        answer: 'The price mechanism works through:\n1. Excess demand drives prices up\n2. Excess supply drives prices down\n3. Price changes signal producers and consumers\n4. Resources are allocated efficiently\n5. Market reaches equilibrium automatically',
        type: 'concept'
      },
      {
        question: 'What causes market disequilibrium?',
        answer: 'Market disequilibrium can be caused by:\n1. Changes in demand or supply\n2. Price controls (price ceiling/floor)\n3. Government intervention\n4. External shocks\n5. Market imperfections',
        type: 'concept'
      }
    ]
  }
];

async function addEconomicsFlashcards() {
  try {
    const uri = 'mongodb+srv://iqrawaseem1995:Heyayan32!@cluster0.2pme8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');

    // Remove existing Economics flashcards
    await FlashcardSet.deleteMany({ subject: 'Economics' });
    console.log('Cleared existing Economics flashcard sets');

    // Add new Economics flashcards
    await FlashcardSet.insertMany(economicsFlashcards);
    console.log('Successfully added new Economics flashcard sets');

    // Display the added flashcards
    const addedSets = await FlashcardSet.find({ subject: 'Economics' }).lean();
    console.log('\nAdded', addedSets.length, 'Economics flashcard sets:');
    addedSets.forEach(set => {
      console.log(`\nTopic: ${set.topic}`);
      console.log(`Subtopic: ${set.subtopic}`);
      console.log(`Number of cards: ${set.cards.length}`);
      console.log('-------------------');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

addEconomicsFlashcards();
