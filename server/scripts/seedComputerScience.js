const mongoose = require('mongoose');
const Curriculum = require('../models/Curriculum');

const computerScienceCurriculum = {
  gradeLevel: 'O-Level',
  subject: 'Computer Science',
  topics: [
    {
      name: 'Computer Systems',
      subtopics: [
        {
          name: 'Data Representation',
          learningObjectives: [
            'Explain the different number systems: Binary, Denary, and Hexadecimal',
            'Understand how to perform logical binary shifts',
            'Explain Two\'s Complement representation',
            'Describe how text, sound, and images are represented in computers',
            'Compare lossy and lossless data compression methods'
          ]
        },
        {
          name: 'Data Transmission',
          learningObjectives: [
            'Explain packet switching and the structure of data packets',
            'Compare serial, parallel, simplex, and duplex transmission methods',
            'Describe the features and uses of Universal Serial Bus (USB)',
            'Explain different error detection methods: parity, checksum, and echo check',
            'Compare symmetric and asymmetric encryption methods'
          ]
        },
        {
          name: 'Hardware',
          learningObjectives: [
            'Explain computer architecture including CPU, fetch-decode-execute cycle, and registers',
            'Describe various input and output devices and their uses',
            'Compare different data storage methods: magnetic, optical, and solid-state',
            'Explain virtual memory and cloud storage concepts',
            'Describe network hardware components including NIC, MAC Address, IP Address, and Routers'
          ]
        },
        {
          name: 'Software',
          learningObjectives: [
            'Compare system software and application software',
            'Explain the functions and interrupts of operating systems',
            'Compare high-level and low-level programming languages',
            'Explain the role of compilers, interpreters, and assemblers',
            'Describe the features of Integrated Development Environments (IDEs)'
          ]
        },
        {
          name: 'Internet and Its Uses',
          learningObjectives: [
            'Distinguish between the Internet and World Wide Web',
            'Explain URLs, HTTP, and HTTPS protocols',
            'Describe how web browsers work and the purpose of cookies',
            'Explain digital currency and blockchain technology',
            'Identify various cybersecurity threats and prevention methods'
          ]
        },
        {
          name: 'Automated and Emerging Technologies',
          learningObjectives: [
            'Explain automated systems including sensors, microprocessors, and actuators',
            'Describe robotics characteristics and applications',
            'Explain artificial intelligence concepts including expert systems and machine learning'
          ]
        }
      ]
    },
    {
      name: 'Algorithms, Programming, and Logic',
      subtopics: [
        {
          name: 'Algorithm Design',
          learningObjectives: [
            'Explain the program development life cycle: analysis, design, coding, and testing',
            'Describe how to decompose problems into smaller parts',
            'Explain standard algorithm methods for sorting, searching, and counting',
            'Understand validation and verification in programming',
            'Explain how to use trace tables and dry-run testing'
          ]
        },
        {
          name: 'Programming Fundamentals',
          learningObjectives: [
            'Explain variables, constants, and different data types',
            'Describe input/output operations and different types of operators',
            'Explain control structures: sequence, selection, and iteration',
            'Understand procedures and functions with and without parameters',
            'Explain nested statements and library routines',
            'Describe arrays (1D, 2D) and file handling operations'
          ]
        },
        {
          name: 'Databases',
          learningObjectives: [
            'Explain single-table database concepts',
            'Describe different data types and primary keys in databases',
            'Write and understand SQL queries using SELECT, WHERE, ORDER BY, COUNT, SUM, AND, OR'
          ]
        },
        {
          name: 'Boolean Logic',
          learningObjectives: [
            'Explain different logic gates: AND, OR, NOT, NAND, NOR, XOR',
            'Create logic circuits from problem statements',
            'Understand truth tables and Boolean expressions'
          ]
        }
      ]
    }
  ]
};

async function seedComputerScience() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/study-companion');
    
    // Delete existing Computer Science curriculum
    await Curriculum.deleteOne({ subject: 'Computer Science', gradeLevel: 'O-Level' });
    
    // Insert new curriculum
    const curriculum = new Curriculum(computerScienceCurriculum);
    await curriculum.save();
    
    console.log('Computer Science curriculum seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding curriculum:', error);
    process.exit(1);
  }
}

seedComputerScience();
