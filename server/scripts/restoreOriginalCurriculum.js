require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('../models/Curriculum');

const computerScience = {
  gradeLevel: 'O-Level',
  subject: 'Computer Science',
  topics: [
    {
      name: 'Computer Systems',
      subtopics: [
        {
          name: 'Data Representation',
          learningObjectives: [
            'Number Systems (Binary, Denary, Hexadecimal)',
            'Logical Binary Shifts',
            'Two\'s Complement',
            'Text, Sound, and Image Representation',
            'Data Storage and Compression (Lossy & Lossless)'
          ]
        },
        {
          name: 'Data Transmission',
          learningObjectives: [
            'Packet Switching & Data Packets',
            'Transmission Methods (Serial, Parallel, Simplex, Duplex)',
            'Universal Serial Bus (USB)',
            'Error Detection (Parity, Checksum, Echo Check)',
            'Encryption (Symmetric & Asymmetric)'
          ]
        },
        {
          name: 'Hardware',
          learningObjectives: [
            'Computer Architecture (CPU, Fetch-Decode-Execute Cycle, Registers)',
            'Input and Output Devices',
            'Data Storage (Magnetic, Optical, Solid-State)',
            'Virtual Memory & Cloud Storage',
            'Network Hardware (NIC, MAC Address, IP Address, Routers)'
          ]
        },
        {
          name: 'Software',
          learningObjectives: [
            'System Software vs. Application Software',
            'Operating Systems (Functions, Interrupts)',
            'Programming Languages (High-Level vs. Low-Level)',
            'Compilers, Interpreters & Assemblers',
            'Integrated Development Environments (IDEs)'
          ]
        },
        {
          name: 'Internet & Its Uses',
          learningObjectives: [
            'Internet vs. World Wide Web',
            'URLs, HTTP, HTTPS',
            'Web Browsers & Cookies',
            'Digital Currency & Blockchain',
            'Cybersecurity Threats & Prevention'
          ]
        },
        {
          name: 'Automated & Emerging Technologies',
          learningObjectives: [
            'Automated Systems (Sensors, Microprocessors, Actuators)',
            'Robotics (Characteristics & Applications)',
            'Artificial Intelligence (Expert Systems, Machine Learning)'
          ]
        }
      ]
    },
    {
      name: 'Algorithms, Programming, and Logic',
      subtopics: [
        {
          name: 'Algorithm Design & Problem-Solving',
          learningObjectives: [
            'Program Development Life Cycle (Analysis, Design, Coding, Testing)',
            'Decomposition of Problems',
            'Algorithm Standard Methods (Sorting, Searching, Counting)',
            'Validation & Verification',
            'Trace Tables & Dry-Run Testing'
          ]
        },
        {
          name: 'Programming',
          learningObjectives: [
            'Variables, Constants, Data Types',
            'Input, Output & Operators (Arithmetic, Relational, Logical)',
            'Control Structures (Sequence, Selection, Iteration)',
            'Procedures & Functions (With and Without Parameters)',
            'Nested Statements & Library Routines',
            'Arrays (1D, 2D) & File Handling (Read, Write, Open, Close)'
          ]
        },
        {
          name: 'Databases',
          learningObjectives: [
            'Single-Table Databases',
            'Data Types & Primary Keys',
            'SQL Queries (SELECT, WHERE, ORDER BY, COUNT, SUM, AND, OR)'
          ]
        },
        {
          name: 'Boolean Logic',
          learningObjectives: [
            'Logic Gates (AND, OR, NOT, NAND, NOR, XOR)',
            'Creating Logic Circuits from Problem Statements, Expressions & Truth Tables'
          ]
        }
      ]
    }
  ]
};

const pakistanStudiesHistory = {
  gradeLevel: 'O-Level',
  subject: 'Pakistan Studies - History',
  topics: [
    {
      name: 'Cultural and Historical Background to the Pakistan Movement',
      subtopics: [
        {
          name: 'Religious and Cultural Foundations',
          learningObjectives: [
            'Religious Thinkers and the Spread of Islam (Shah Waliullah, Syed Ahmad Barelvi, Haji Shariatullah)',
            'Decline of the Mughal Empire (Aurangzeb\'s Policies, East India Company)',
            'War of Independence 1857-58 (Causes, Consequences, British Reaction)',
            'Sir Syed Ahmad Khan and the Aligarh Movement',
            'Urdu and Regional Languages in Pakistan\'s Culture'
          ]
        }
      ]
    },
    {
      name: 'The Emergence of Pakistan (1906–1947)',
      subtopics: [
        {
          name: 'Early Political Developments',
          learningObjectives: [
            'Formation of the Muslim League',
            'Partition of Bengal and Simla Deputation',
            'Lucknow Pact, Montagu-Chelmsford Reforms, Khilafat Movement',
            'Jinnah\'s 14 Points, Round Table Conferences'
          ]
        },
        {
          name: 'Path to Independence',
          learningObjectives: [
            'Government of India Act 1935, Congress Rule (1937–39)',
            'Pakistan Resolution (1940) and Later Struggles',
            'Cabinet Mission, Direct Action Day, Independence (1947)'
          ]
        }
      ]
    },
    {
      name: 'Nationhood (1947–1999)',
      subtopics: [
        {
          name: 'Early Challenges',
          learningObjectives: [
            'Partition Challenges (Refugee Crisis, Kashmir Conflict)',
            'Political Developments (Constitutional Crises, Military Coups)',
            'Role of Leaders (Jinnah, Liaquat Ali Khan, Bhutto, Zia-ul-Haq)'
          ]
        },
        {
          name: 'National Development',
          learningObjectives: [
            'Breakup of Pakistan (Formation of Bangladesh in 1971)',
            'Economic and Social Policies (Reforms and Challenges)',
            'Pakistan\'s Role in World Affairs (Relations with India, USA, China, UN)'
          ]
        }
      ]
    }
  ]
};

const pakistanStudiesGeography = {
  gradeLevel: 'O-Level',
  subject: 'Pakistan Studies - Geography',
  topics: [
    {
      name: 'The Land of Pakistan',
      subtopics: [
        {
          name: 'Physical Geography',
          learningObjectives: [
            'Geographic Location, Provinces, Cities, Landforms',
            'Rivers, Climate, Natural Resources',
            'Human Impact on Environment'
          ]
        }
      ]
    },
    {
      name: 'Natural Resources and Sustainability',
      subtopics: [
        {
          name: 'Water and Forest Resources',
          learningObjectives: [
            'Water Resources (Indus Water Treaty, Dams)',
            'Forests (Deforestation, Afforestation)'
          ]
        },
        {
          name: 'Mineral and Energy Resources',
          learningObjectives: [
            'Mineral Resources (Coal, Oil, Gas, Limestone)',
            'Fishing Industry',
            'Renewable and Non-Renewable Energy',
            'Hydroelectric, Solar, Wind, and Nuclear Energy'
          ]
        }
      ]
    },
    {
      name: 'Economic Development',
      subtopics: [
        {
          name: 'Agriculture',
          learningObjectives: [
            'Crop Production (Cotton, Rice, Wheat, Sugarcane)',
            'Farming Methods (Irrigation, Livestock)',
            'Government Policies and Challenges'
          ]
        },
        {
          name: 'Industry and Trade',
          learningObjectives: [
            'Major Industries (Cotton, Cement, Steel, Fertilizers)',
            'Role of Small and Large-Scale Industries',
            'Impact on Economy and Trade',
            'Major Exports & Imports',
            'Pakistan\'s Trading Partners and Economic Growth'
          ]
        }
      ]
    },
    {
      name: 'Infrastructure and Population',
      subtopics: [
        {
          name: 'Transport and Communications',
          learningObjectives: [
            'Road, Rail, Air, and Sea Transport Networks',
            'Role of Digital and Communication Technologies'
          ]
        },
        {
          name: 'Demographics',
          learningObjectives: [
            'Demographic Trends (Birth Rate, Urbanization)',
            'Challenges of Unemployment and Migration'
          ]
        }
      ]
    }
  ]
};

const economics = {
  gradeLevel: 'O-Level',
  subject: 'Economics',
  topics: [
    {
      name: 'The Basic Economic Problem',
      subtopics: [
        {
          name: 'Scarcity and Choice',
          learningObjectives: [
            'Definition of scarcity',
            'Finite resources vs. infinite wants',
            'Economic decision-making (consumers, workers, firms, governments)'
          ]
        },
        {
          name: 'Factors of Production',
          learningObjectives: [
            'Land, labour, capital, and enterprise',
            'Rewards: rent, wages, interest, and profit',
            'Quantity and quality of factors of production'
          ]
        },
        {
          name: 'Economic Concepts',
          learningObjectives: [
            'Opportunity Cost definition and examples',
            'Production Possibility Curve (PPC)',
            'Economic growth representation'
          ]
        }
      ]
    },
    {
      name: 'The Allocation of Resources',
      subtopics: [
        {
          name: 'Market Forces',
          learningObjectives: [
            'Market mechanism and types',
            'Demand and Supply analysis',
            'Price determination and elasticity'
          ]
        },
        {
          name: 'Market Systems',
          learningObjectives: [
            'Market economic system characteristics',
            'Market failure types and causes',
            'Mixed economic system and government intervention'
          ]
        }
      ]
    },
    {
      name: 'Microeconomic Decision-Makers',
      subtopics: [
        {
          name: 'Economic Agents',
          learningObjectives: [
            'Money and banking functions',
            'Household financial decisions',
            'Workers and wage determination'
          ]
        },
        {
          name: 'Business Economics',
          learningObjectives: [
            'Types of firms and growth',
            'Production methods and productivity',
            'Costs, revenue, and profit analysis'
          ]
        }
      ]
    },
    {
      name: 'Government and Macroeconomy',
      subtopics: [
        {
          name: 'Government Policies',
          learningObjectives: [
            'Fiscal and monetary policy',
            'Supply-side policy',
            'Economic growth and cycles'
          ]
        },
        {
          name: 'Economic Indicators',
          learningObjectives: [
            'Employment and unemployment',
            'Inflation types and control',
            'Living standards measurement'
          ]
        }
      ]
    },
    {
      name: 'International Trade',
      subtopics: [
        {
          name: 'Global Economics',
          learningObjectives: [
            'Specialization and free trade',
            'Globalization and trade restrictions',
            'Exchange rates and balance of payments'
          ]
        }
      ]
    }
  ]
};

async function restoreOriginalCurriculum() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Curriculum.deleteMany({});
    console.log('Cleared existing curriculum data');

    // Insert original curriculum data
    const documents = [
      computerScience,
      pakistanStudiesHistory,
      pakistanStudiesGeography,
      economics
    ];

    const result = await Curriculum.insertMany(documents);
    console.log(`Restored ${result.length} original curriculum documents`);

  } catch (error) {
    console.error('Error restoring curriculum data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

restoreOriginalCurriculum();
