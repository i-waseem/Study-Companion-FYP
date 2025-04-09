require('dotenv').config();
const mongoose = require('mongoose');
const FlashcardSet = require('../models/FlashcardSet');

async function viewFlashcards() {
  try {
    const uri = 'mongodb+srv://iqrawaseem1995:Heyayan32!@cluster0.2pme8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');

    const flashcardSets = await FlashcardSet.find().lean();
    console.log('\nFound', flashcardSets.length, 'flashcard sets:\n');
    
    flashcardSets.forEach(set => {
      console.log(`Subject: ${set.subject}`);
      console.log(`Topic: ${set.topic}`);
      console.log(`Subtopic: ${set.subtopic}`);
      console.log(`Cards: ${set.cards.length}`);
      console.log('Sample Question:', set.cards[0]?.question);
      console.log('-------------------');
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

viewFlashcards();
