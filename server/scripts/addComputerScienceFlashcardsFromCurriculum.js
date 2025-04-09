require('dotenv').config();
const mongoose = require('mongoose');
const FlashcardSet = require('../models/FlashcardSet');

const computerScienceFlashcards = [
  // Computer Systems - Data Representation
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Computer Systems',
    subtopic: 'Data Representation',
    cards: [
      {
        question: 'What are the main number systems used in computer systems?',
        answer: '1. Binary (Base-2)\n2. Decimal (Base-10)\n3. Hexadecimal (Base-16)\n4. Octal (Base-8)',
        type: 'concept'
      },
      {
        question: 'How is text represented in computers?',
        answer: 'Text is represented using character encoding systems:\n1. ASCII (7 or 8 bits per character)\n2. Unicode (UTF-8, UTF-16)\n3. Each character has a unique numerical code\n4. Stored as binary data',
        type: 'concept'
      },
      {
        question: 'What is the difference between analog and digital data?',
        answer: 'Analog Data:\n- Continuous values\n- Infinite possible values\n- Example: sound waves\n\nDigital Data:\n- Discrete values\n- Fixed number of possible values\n- Example: binary (0s and 1s)',
        type: 'concept'
      }
    ]
  },
  // Computer Systems - Data Transmission
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Computer Systems',
    subtopic: 'Data Transmission',
    cards: [
      {
        question: 'What are the main transmission modes in data communication?',
        answer: '1. Simplex: One-way only\n2. Half-duplex: Both ways, one at a time\n3. Full-duplex: Both ways simultaneously',
        type: 'concept'
      },
      {
        question: 'What is a protocol in data transmission?',
        answer: 'A protocol is a set of rules that govern data transmission. It defines:\n1. Format of data\n2. How data is sent\n3. Error handling\n4. Flow control\n5. Connection establishment/termination',
        type: 'concept'
      },
      {
        question: 'What are the common transmission media?',
        answer: 'Physical Media:\n1. Twisted pair cable\n2. Coaxial cable\n3. Fiber optic cable\n\nWireless Media:\n1. Radio waves\n2. Microwaves\n3. Infrared',
        type: 'concept'
      }
    ]
  },
  // Computer Systems - Hardware
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Computer Systems',
    subtopic: 'Hardware',
    cards: [
      {
        question: 'What are the main components of a computer system?',
        answer: '1. Input devices (keyboard, mouse)\n2. Output devices (monitor, printer)\n3. Processing unit (CPU)\n4. Memory (RAM, ROM)\n5. Storage devices (HDD, SSD)',
        type: 'concept'
      },
      {
        question: 'What are the key components of the CPU?',
        answer: '1. Control Unit (CU): Controls operations\n2. Arithmetic Logic Unit (ALU): Performs calculations\n3. Registers: Fast temporary storage\n4. Cache: High-speed memory\n5. System Clock: Synchronizes operations',
        type: 'concept'
      },
      {
        question: 'What is the difference between primary and secondary storage?',
        answer: 'Primary Storage (RAM, ROM):\n- Directly accessible by CPU\n- Faster access\n- Volatile (RAM)\n- Limited capacity\n\nSecondary Storage (HDD, SSD):\n- Not directly accessible by CPU\n- Slower access\n- Non-volatile\n- Large capacity',
        type: 'concept'
      }
    ]
  },
  // Computer Systems - Software
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Computer Systems',
    subtopic: 'Software',
    cards: [
      {
        question: 'What are the main types of software?',
        answer: '1. System Software:\n- Operating Systems\n- Utilities\n- Device drivers\n\n2. Application Software:\n- Word processors\n- Spreadsheets\n- Games\n- Web browsers',
        type: 'concept'
      },
      {
        question: 'What are the main functions of an operating system?',
        answer: '1. Memory management\n2. Process management\n3. File management\n4. Device management\n5. User interface\n6. Security control',
        type: 'concept'
      },
      {
        question: 'What is the difference between compiler and interpreter?',
        answer: 'Compiler:\n- Translates entire program at once\n- Creates executable file\n- Faster execution\n- Shows all errors at once\n\nInterpreter:\n- Translates line by line\n- No executable file\n- Slower execution\n- Shows errors one at a time',
        type: 'concept'
      }
    ]
  },
  // Computer Systems - Internet & Its Uses
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Computer Systems',
    subtopic: 'Internet & Its Uses',
    cards: [
      {
        question: 'What are the main services provided by the Internet?',
        answer: '1. World Wide Web (WWW)\n2. Email\n3. File Transfer (FTP)\n4. Video conferencing\n5. Social networking\n6. E-commerce\n7. Cloud computing',
        type: 'concept'
      },
      {
        question: 'What is the difference between the Internet and World Wide Web?',
        answer: 'Internet:\n- Global network of connected computers\n- Infrastructure for communication\n- Provides various services\n\nWorld Wide Web:\n- Service on the Internet\n- Collection of web pages\n- Accessed through browsers\n- Uses HTTP protocol',
        type: 'concept'
      },
      {
        question: 'What are the common Internet security threats?',
        answer: '1. Viruses and malware\n2. Phishing attacks\n3. Identity theft\n4. Hacking\n5. Denial of Service (DoS)\n6. Data breaches\n7. Social engineering',
        type: 'concept'
      }
    ]
  },
  // Algorithms, Programming, and Logic - Algorithm Design & Problem-Solving
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Algorithms, Programming, and Logic',
    subtopic: 'Algorithm Design & Problem-Solving',
    cards: [
      {
        question: 'What are the key steps in problem-solving?',
        answer: '1. Understand the problem\n2. Plan the solution\n3. Design the algorithm\n4. Code the solution\n5. Test and debug\n6. Document the solution',
        type: 'concept'
      },
      {
        question: 'What are the three basic control structures in algorithms?',
        answer: '1. Sequence: Instructions executed in order\n2. Selection: Decision making (if-then-else)\n3. Iteration: Loops (for, while, do-while)',
        type: 'concept'
      },
      {
        question: 'What are the common ways to represent algorithms?',
        answer: '1. Pseudocode: English-like description\n2. Flowcharts: Visual representation\n3. Program code: Implementation in programming language',
        type: 'concept'
      }
    ]
  },
  // Algorithms, Programming, and Logic - Programming
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Algorithms, Programming, and Logic',
    subtopic: 'Programming',
    cards: [
      {
        question: 'What are the basic data types in programming?',
        answer: '1. Integer: Whole numbers\n2. Float/Double: Decimal numbers\n3. Character: Single letters/symbols\n4. String: Text\n5. Boolean: True/False',
        type: 'concept'
      },
      {
        question: 'What are arrays and why are they used?',
        answer: 'Arrays are:\n1. Collection of similar data types\n2. Fixed size\n3. Elements accessed by index\n4. Used for:\n   - Storing multiple values\n   - Efficient data processing\n   - Implementing lists/tables',
        type: 'concept'
      },
      {
        question: 'What is the difference between a function and a procedure?',
        answer: 'Function:\n- Returns a value\n- Used in expressions\n- Typically for calculations\n\nProcedure:\n- Performs actions\n- No return value\n- Used for tasks/operations',
        type: 'concept'
      }
    ]
  },
  // Algorithms, Programming, and Logic - Databases
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Algorithms, Programming, and Logic',
    subtopic: 'Databases',
    cards: [
      {
        question: 'What is a database and why is it used?',
        answer: 'A database is:\n1. Organized collection of data\n2. Used for:\n   - Storing large amounts of data\n   - Easy retrieval and updating\n   - Data integrity\n   - Multiple user access\n   - Data security',
        type: 'concept'
      },
      {
        question: 'What are the basic SQL commands?',
        answer: '1. SELECT: Retrieve data\n2. INSERT: Add new records\n3. UPDATE: Modify existing records\n4. DELETE: Remove records\n5. CREATE: Make new tables\n6. DROP: Remove tables',
        type: 'concept'
      },
      {
        question: 'What is the difference between primary key and foreign key?',
        answer: 'Primary Key:\n- Uniquely identifies each record\n- Cannot be null\n- Only one per table\n\nForeign Key:\n- References primary key of another table\n- Creates relationships between tables\n- Can be null\n- Multiple allowed per table',
        type: 'concept'
      }
    ]
  },
  // Algorithms, Programming, and Logic - Boolean Logic
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topic: 'Algorithms, Programming, and Logic',
    subtopic: 'Boolean Logic',
    cards: [
      {
        question: 'What are the basic logic gates?',
        answer: '1. AND: Output true only if all inputs true\n2. OR: Output true if any input true\n3. NOT: Inverts input\n4. NAND: NOT of AND\n5. NOR: NOT of OR\n6. XOR: Output true if inputs different',
        type: 'concept'
      },
      {
        question: 'What is a truth table?',
        answer: 'A truth table shows:\n1. All possible input combinations\n2. Corresponding outputs\n3. Used to:\n   - Document logic gate behavior\n   - Design digital circuits\n   - Verify boolean expressions',
        type: 'concept'
      },
      {
        question: 'How are boolean expressions used in programming?',
        answer: 'Boolean expressions are used in:\n1. Conditional statements (if-then-else)\n2. Loop conditions (while, for)\n3. Search operations\n4. Data validation\n5. Combining conditions (AND, OR, NOT)',
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
