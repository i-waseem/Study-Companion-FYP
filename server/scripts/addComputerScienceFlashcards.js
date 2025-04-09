require('dotenv').config();
const mongoose = require('mongoose');
const FlashcardSet = require('../models/FlashcardSet');

const computerScienceFlashcards = [
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Algorithms and Programming',
    subtopic: 'Introduction to Algorithms',
    cards: [
      {
        question: 'What is an algorithm?',
        answer: 'An algorithm is a step-by-step procedure or set of rules for solving a specific problem or accomplishing a particular task.',
        type: 'definition'
      },
      {
        question: 'What are the key characteristics of an algorithm?',
        answer: '1. Input: Takes zero or more inputs\n2. Output: Produces at least one output\n3. Definiteness: Each step is clear and unambiguous\n4. Finiteness: Terminates after a finite number of steps\n5. Effectiveness: Each step is basic enough to be carried out',
        type: 'concept'
      },
      {
        question: 'What are the common ways to represent algorithms?',
        answer: '1. Pseudocode: English-like description of steps\n2. Flowcharts: Visual representation using shapes and arrows\n3. Program code: Implementation in a programming language',
        type: 'concept'
      }
    ]
  },
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Algorithms and Programming',
    subtopic: 'Control Structures',
    cards: [
      {
        question: 'What are the three basic control structures in programming?',
        answer: '1. Sequence: Instructions executed in order\n2. Selection: Decision making (if-then-else)\n3. Iteration: Loops (for, while, do-while)',
        type: 'concept'
      },
      {
        question: 'What is the difference between a while loop and a for loop?',
        answer: '- While loop: Used when number of iterations is unknown, continues until condition is false\n- For loop: Used when number of iterations is known, has initialization, condition, and increment/decrement',
        type: 'concept'
      },
      {
        question: 'What is nested selection?',
        answer: 'Nested selection is when one selection statement (if-then-else) is placed inside another selection statement. It allows for more complex decision-making based on multiple conditions.',
        type: 'concept'
      }
    ]
  },
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Data Representation',
    subtopic: 'Number Systems',
    cards: [
      {
        question: 'What are the main number systems used in computing?',
        answer: '1. Binary (Base-2): Uses 0 and 1\n2. Decimal (Base-10): Uses 0-9\n3. Hexadecimal (Base-16): Uses 0-9 and A-F',
        type: 'concept'
      },
      {
        question: 'Why is binary used in computers?',
        answer: 'Binary is used because:\n1. Digital circuits have two stable states (on/off)\n2. Easy to represent using electronic signals\n3. Less prone to errors\n4. Simpler circuit design\n5. Efficient for logical operations',
        type: 'concept'
      },
      {
        question: 'How do you convert decimal to binary?',
        answer: 'To convert decimal to binary:\n1. Divide the number by 2\n2. Keep track of remainders\n3. Continue until quotient becomes 0\n4. Read remainders from bottom to top\n\nExample: 13 → 1101\n13÷2 = 6 remainder 1\n6÷2 = 3 remainder 0\n3÷2 = 1 remainder 1\n1÷2 = 0 remainder 1',
        type: 'concept'
      }
    ]
  },
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Data Representation',
    subtopic: 'Data Types',
    cards: [
      {
        question: 'What are the basic data types in programming?',
        answer: '1. Integer: Whole numbers\n2. Float/Double: Decimal numbers\n3. Character: Single letters/symbols\n4. String: Text\n5. Boolean: True/False values',
        type: 'concept'
      },
      {
        question: 'What is the difference between integer and float?',
        answer: '- Integer: Whole numbers only (e.g., -3, 0, 42)\n- Float: Numbers with decimal points (e.g., 3.14, -0.5, 2.0)\n\nIntegers use less memory but can\'t represent fractional values.',
        type: 'concept'
      },
      {
        question: 'What is type conversion?',
        answer: 'Type conversion is changing data from one type to another:\n1. Implicit: Automatic (e.g., int to float)\n2. Explicit: Manual casting (e.g., float to int)\n\nExample: int(3.14) → 3',
        type: 'concept'
      }
    ]
  },
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Computer Architecture',
    subtopic: 'CPU Components',
    cards: [
      {
        question: 'What are the main components of a CPU?',
        answer: '1. Control Unit (CU): Controls operations\n2. Arithmetic Logic Unit (ALU): Performs calculations\n3. Registers: Fast temporary storage\n4. Cache: High-speed memory\n5. System Clock: Synchronizes operations',
        type: 'concept'
      },
      {
        question: 'What is the fetch-execute cycle?',
        answer: 'The fetch-execute cycle has four stages:\n1. Fetch: Get instruction from memory\n2. Decode: Understand the instruction\n3. Execute: Perform the operation\n4. Store: Save the result\n\nThis cycle repeats continuously while the computer is running.',
        type: 'concept'
      },
      {
        question: 'What are registers used for?',
        answer: 'Registers are used for:\n1. Storing instructions being executed\n2. Holding data being processed\n3. Keeping track of memory addresses\n4. Storing status information\n5. Temporary results in calculations',
        type: 'concept'
      }
    ]
  },
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Computer Architecture',
    subtopic: 'Memory',
    cards: [
      {
        question: 'What is the memory hierarchy?',
        answer: 'From fastest/smallest to slowest/largest:\n1. Registers\n2. Cache (L1, L2, L3)\n3. RAM (Main Memory)\n4. Storage (SSD/HDD)\n5. External Storage',
        type: 'concept'
      },
      {
        question: 'What is the difference between RAM and ROM?',
        answer: 'RAM (Random Access Memory):\n- Temporary storage\n- Lost when power off\n- Fast read/write\n\nROM (Read Only Memory):\n- Permanent storage\n- Retains data without power\n- Contains essential startup instructions',
        type: 'concept'
      },
      {
        question: 'Why is cache memory important?',
        answer: 'Cache memory is important because:\n1. Reduces CPU waiting time\n2. Bridges speed gap between CPU and RAM\n3. Stores frequently used data\n4. Improves system performance\n5. Multiple levels for efficiency',
        type: 'concept'
      }
    ]
  }
];

async function addComputerScienceFlashcards() {
  try {
    const uri = 'mongodb+srv://iqrawaseem1995:Heyayan32!@cluster0.2pme8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');

    // Remove existing Computer Science flashcards
    await FlashcardSet.deleteMany({ subject: 'Computer Science' });
    console.log('Cleared existing Computer Science flashcard sets');

    // Add new Computer Science flashcards
    await FlashcardSet.insertMany(computerScienceFlashcards);
    console.log('Successfully added new Computer Science flashcard sets');

    // Display the added flashcards
    const addedSets = await FlashcardSet.find({ subject: 'Computer Science' }).lean();
    console.log('\nAdded', addedSets.length, 'Computer Science flashcard sets:');
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

addComputerScienceFlashcards();
