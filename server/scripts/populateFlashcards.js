require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const FlashcardSet = require('../models/FlashcardSet');

async function populateFlashcards() {
  try {
    // Connect to MongoDB Atlas
    const uri = process.env.MONGODB_URI || 'mongodb+srv://iqrawaseem1995:Heyayan32!@cluster0.2pme8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');

    // Clear existing flashcard sets
    await FlashcardSet.deleteMany({});
    console.log('Cleared existing flashcard sets');

    // Computer Science flashcards based on curriculum
    const computerScienceFlashcards = [
      // Computer Systems Topic
      {
        gradeLevel: 'O-Level',
        subject: 'Computer Science',
        topic: 'Computer Systems',
        subtopic: 'Data Representation',
        cards: [
          {
            question: 'What are the main number systems used in computing?',
            answer: '1. Binary (base-2)\n2. Decimal (base-10)\n3. Hexadecimal (base-16)',
            type: 'fact'
          },
          {
            question: 'What is Two\'s Complement and why is it used?',
            answer: 'Two\'s Complement is a method for representing negative numbers in binary. It\'s used because it simplifies arithmetic operations and eliminates the need for separate addition and subtraction circuits.',
            type: 'concept'
          },
          {
            question: 'How are images represented in computers?',
            answer: 'Images are represented as a grid of pixels, where each pixel contains color information. In a color image, each pixel typically uses 24 bits (8 bits each for Red, Green, and Blue values).',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Computer Science',
        topic: 'Computer Systems',
        subtopic: 'Data Transmission',
        cards: [
          {
            question: 'What is packet switching?',
            answer: 'Packet switching is a method of data transmission where data is broken into smaller packets, sent independently through the network, and reassembled at the destination. Each packet contains header information including source, destination, and sequence number.',
            type: 'concept'
          },
          {
            question: 'Compare Serial and Parallel transmission',
            answer: 'Serial transmission sends data one bit at a time over a single wire, making it simpler and cheaper but slower. Parallel transmission sends multiple bits simultaneously over multiple wires, making it faster but more expensive and susceptible to timing issues.',
            type: 'example'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Computer Science',
        topic: 'Computer Systems',
        subtopic: 'Hardware',
        cards: [
          {
            question: 'Explain the Fetch-Decode-Execute Cycle',
            answer: '1. Fetch: Instruction is fetched from memory\n2. Decode: CPU determines what the instruction means\n3. Execute: The instruction is carried out\n4. The cycle repeats for the next instruction',
            type: 'concept'
          },
          {
            question: 'What are the main components of a CPU?',
            answer: '1. Control Unit (CU): Manages and coordinates CPU operations\n2. Arithmetic Logic Unit (ALU): Performs calculations\n3. Registers: Fast storage for temporary data\n4. Cache: High-speed memory for frequently used data',
            type: 'fact'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Computer Science',
        topic: 'Computer Systems',
        subtopic: 'Software',
        cards: [
          {
            question: 'What is the role of an operating system?',
            answer: 'An operating system manages hardware resources, provides user interface, handles file management, manages memory and processes, and provides security features.',
            type: 'concept'
          },
          {
            question: 'What are the two main categories of software?',
            answer: '1. System Software (e.g., operating systems, drivers)\n2. Application Software (e.g., word processors, games)',
            type: 'definition'
          }
        ]
      },
      // Algorithms, Programming, and Logic Topic
      {
        gradeLevel: 'O-Level',
        subject: 'Computer Science',
        topic: 'Algorithms, Programming, and Logic',
        subtopic: 'Algorithm Design & Problem-Solving',
        cards: [
          {
            question: 'What are the stages of the Program Development Life Cycle?',
            answer: '1. Analysis: Understanding the problem\n2. Design: Planning the solution\n3. Coding: Writing the program\n4. Testing: Checking for errors\n5. Maintenance: Updating and fixing issues',
            type: 'concept'
          },
          {
            question: 'What is a trace table and why is it used?',
            answer: 'A trace table is a tool used to track the values of variables as a program executes. It helps in debugging by showing how variables change throughout program execution and verifying if the algorithm works as intended.',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Computer Science',
        topic: 'Algorithms, Programming, and Logic',
        subtopic: 'Programming',
        cards: [
          {
            question: 'What are the three basic control structures in programming?',
            answer: '1. Sequence: Instructions executed in order\n2. Selection: Decision making (if-then-else)\n3. Iteration: Repetition (loops)',
            type: 'concept'
          },
          {
            question: 'What is the difference between a procedure and a function?',
            answer: 'A procedure is a block of code that performs a specific task but doesn\'t return a value. A function is similar but always returns a value. Both can accept parameters.',
            type: 'example'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Computer Science',
        topic: 'Algorithms, Programming, and Logic',
        subtopic: 'Databases',
        cards: [
          {
            question: 'What is a primary key?',
            answer: 'A primary key is a field or combination of fields that uniquely identifies each record in a database table. It must be unique and cannot contain null values.',
            type: 'definition'
          },
          {
            question: 'What are the basic SQL query commands?',
            answer: '1. SELECT: Retrieve data\n2. WHERE: Filter records\n3. ORDER BY: Sort results\n4. COUNT: Count records\n5. SUM: Calculate totals',
            type: 'fact'
          }
        ]
      }
    ];

    // History flashcards based on curriculum
    const historyFlashcards = [
      // Section 1: Cultural and Historical Background
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies History',
        topic: 'Cultural and Historical Background',
        subtopic: 'Decline of Mughal Empire and British Conquest',
        cards: [
          {
            question: 'What were the main factors that led to the decline of the Mughal Empire?',
            answer: '1. Aurangzeb\'s expansionist policies\n2. Weak successors\n3. Economic drain from constant warfare\n4. Rise of regional powers\n5. European intervention\n6. Administrative inefficiency',
            type: 'fact'
          },
          {
            question: 'How did the East India Company establish control over India?',
            answer: '1. Battle of Plassey (1757)\n2. Battle of Buxar (1764)\n3. Subsidiary Alliance System\n4. Doctrine of Lapse\n5. Economic exploitation\n6. Military superiority',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies History',
        topic: 'Cultural and Historical Background',
        subtopic: 'War of Independence 1857',
        cards: [
          {
            question: 'What were the immediate and long-term causes of the War of Independence 1857?',
            answer: 'Immediate Causes:\n1. Greased cartridges incident\n2. Annexation policy\n3. Religious interference\n\nLong-term Causes:\n1. Political - Loss of power by local rulers\n2. Economic - Exploitation and drain of wealth\n3. Social - Attack on customs and traditions\n4. Military - Discrimination in army',
            type: 'fact'
          },
          {
            question: 'What were the major consequences of 1857?',
            answer: '1. End of East India Company rule\n2. Direct British Crown control\n3. Changes in army organization\n4. New policy of divide and rule\n5. Changes in administrative policies\n6. Rise of Muslim political consciousness',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies History',
        topic: 'Cultural and Historical Background',
        subtopic: 'Sir Syed Ahmad Khan and Aligarh Movement',
        cards: [
          {
            question: 'What were the main objectives of the Aligarh Movement?',
            answer: '1. Modern education for Muslims\n2. Political understanding with British\n3. Reform of Muslim society\n4. Protection of Muslim rights\n5. Bridge between British and Muslims\n6. Revival of Muslim confidence',
            type: 'fact'
          },
          {
            question: 'What were Sir Syed\'s major contributions to Muslim renaissance?',
            answer: '1. Established MAO College\n2. Scientific Society\n3. Urdu-English translation works\n4. Advocacy for modern education\n5. Political guidance\n6. Social reforms',
            type: 'concept'
          }
        ]
      },
      // Section 2: Emergence of Pakistan
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies History',
        topic: 'Emergence of Pakistan 1906-1947',
        subtopic: 'Formation of Muslim League',
        cards: [
          {
            question: 'Why was the All India Muslim League formed in 1906?',
            answer: '1. Protect Muslim interests\n2. Counter Congress dominance\n3. Separate electorates demand\n4. Political representation\n5. Response to Hindu revivalism\n6. Encourage Muslim unity',
            type: 'fact'
          },
          {
            question: 'What were the main objectives of the Muslim League?',
            answer: '1. Promote loyalty to British government\n2. Protect Muslim political rights\n3. Represent Muslim interests\n4. Prevent hostility between Muslims and other communities\n5. Advance Muslim education\n6. Unity among Muslims',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies History',
        topic: 'Emergence of Pakistan 1906-1947',
        subtopic: 'Lahore Resolution to Partition',
        cards: [
          {
            question: 'Why was the Lahore Resolution (1940) a turning point?',
            answer: '1. Formal demand for separate homeland\n2. Rejection of minority status\n3. Two-Nation Theory basis\n4. Clear political objective\n5. United Muslim stance\n6. End of unity negotiations',
            type: 'fact'
          },
          {
            question: 'What were the key events from 1940-47 leading to partition?',
            answer: '1. Cripps Mission 1942\n2. Quit India Movement\n3. Gandhi-Jinnah talks 1944\n4. Simla Conference 1945\n5. Cabinet Mission 1946\n6. 3rd June Plan 1947',
            type: 'fact'
          }
        ]
      },
      // Section 3: Nationhood
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies History',
        topic: 'Nationhood 1947-1999',
        subtopic: 'Problems at Independence',
        cards: [
          {
            question: 'What were the major problems faced by Pakistan at independence?',
            answer: '1. Refugee crisis\n2. Division of assets\n3. Kashmir dispute\n4. Administrative challenges\n5. Economic difficulties\n6. Integration of princely states',
            type: 'fact'
          },
          {
            question: 'How did Pakistan handle the initial challenges of independence?',
            answer: '1. Established refugee camps\n2. Created basic administrative structure\n3. Negotiated with India for assets\n4. Developed basic infrastructure\n5. Started industrial development\n6. Formed diplomatic relations',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies History',
        topic: 'Nationhood 1947-1999',
        subtopic: 'Constitutional Development',
        cards: [
          {
            question: 'What were the main features of the 1956 Constitution?',
            answer: '1. Federal system\n2. One Unit scheme\n3. Parliamentary democracy\n4. Islamic provisions\n5. Fundamental rights\n6. Parity between wings',
            type: 'fact'
          },
          {
            question: 'Why did Pakistan face constitutional crises?',
            answer: '1. Provincial autonomy issues\n2. Language controversy\n3. Religious vs secular state debate\n4. East-West Pakistan disparity\n5. Role of military\n6. Political instability',
            type: 'concept'
          }
        ]
      }
    ];

    // Geography flashcards based on curriculum
    const geographyFlashcards = [
      // Section 1: The Land of Pakistan
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies Geography',
        topic: 'The Land of Pakistan',
        subtopic: 'Location and Topography',
        cards: [
          {
            question: 'Describe Pakistan\'s location and its geographical importance',
            answer: '1. Located in South Asia\n2. Borders: China (N), India (E), Afghanistan (W), Iran (SW)\n3. Arabian Sea coastline (S)\n4. Strategic position between South and Central Asia\n5. Part of ancient Silk Route\n6. Access to warm waters',
            type: 'fact'
          },
          {
            question: 'What are the main topographical regions of Pakistan?',
            answer: '1. Northern Mountains\n2. Western Mountains\n3. Balochistan Plateau\n4. Potwar Plateau\n5. Upper Indus Plain\n6. Lower Indus Plain\n7. Desert Areas\n8. Coastal Areas',
            type: 'fact'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies Geography',
        topic: 'The Land of Pakistan',
        subtopic: 'Geology and Climate',
        cards: [
          {
            question: 'Explain the formation of the Himalayas and its impact on Pakistan',
            answer: '1. Collision of Indian and Eurasian plates\n2. Created fold mountains\n3. Causes frequent earthquakes\n4. Influences climate patterns\n5. Source of major rivers\n6. Rich mineral deposits',
            type: 'concept'
          },
          {
            question: 'What are the main climatic regions of Pakistan?',
            answer: '1. Highland Climate (Northern Areas)\n2. Mediterranean Climate (Western Mountains)\n3. Continental Climate (Plains)\n4. Coastal Climate (Arabian Sea)\n5. Desert Climate (Thar, Cholistan)\n6. Each region has distinct temperature and rainfall patterns',
            type: 'fact'
          }
        ]
      },
      // Section 2: Natural Resources
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies Geography',
        topic: 'Natural Resources',
        subtopic: 'Water Resources',
        cards: [
          {
            question: 'What are Pakistan\'s major water resources?',
            answer: '1. Rivers (Indus River System)\n2. Glaciers and Snow\n3. Groundwater\n4. Rainfall\n5. Lakes and Dams\n6. Coastal Waters',
            type: 'fact'
          },
          {
            question: 'Explain the importance of the Indus Water Treaty',
            answer: '1. Signed in 1960 between Pakistan and India\n2. Divides rivers between countries\n3. Pakistan gets Indus, Chenab, Jhelum\n4. India gets Ravi, Beas, Sutlej\n5. Regulates water usage\n6. International arbitration mechanism',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies Geography',
        topic: 'Natural Resources',
        subtopic: 'Power Resources',
        cards: [
          {
            question: 'What are Pakistan\'s main power resources?',
            answer: '1. Thermal Power (Oil, Gas, Coal)\n2. Hydroelectric Power\n3. Nuclear Power\n4. Solar Energy\n5. Wind Energy\n6. Biogas',
            type: 'fact'
          },
          {
            question: 'Why is there an energy crisis in Pakistan?',
            answer: '1. Growing population demand\n2. Limited generation capacity\n3. Transmission losses\n4. Circular debt\n5. Dependence on imported fuel\n6. Infrastructure problems',
            type: 'concept'
          }
        ]
      },
      // Section 3: Agriculture
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies Geography',
        topic: 'Agriculture',
        subtopic: 'Agricultural Practices',
        cards: [
          {
            question: 'What are the main farming systems in Pakistan?',
            answer: '1. Subsistence farming\n2. Commercial farming\n3. Intensive farming\n4. Extensive farming\n5. Irrigation-based farming\n6. Rain-fed (barani) farming',
            type: 'fact'
          },
          {
            question: 'What factors affect agricultural productivity?',
            answer: '1. Water availability\n2. Soil quality\n3. Climate conditions\n4. Farm size\n5. Technology access\n6. Market access',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies Geography',
        topic: 'Agriculture',
        subtopic: 'Major Crops',
        cards: [
          {
            question: 'What are Pakistan\'s major food crops?',
            answer: '1. Wheat (staple food)\n2. Rice (major export)\n3. Maize\n4. Pulses\n5. Vegetables\n6. Fruits',
            type: 'fact'
          },
          {
            question: 'What are Pakistan\'s major cash crops?',
            answer: '1. Cotton (white gold)\n2. Sugarcane\n3. Tobacco\n4. Oilseeds\n5. Each has specific growing requirements\n6. Important for economy and exports',
            type: 'concept'
          }
        ]
      },
      // Section 4: Industry
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies Geography',
        topic: 'Industry',
        subtopic: 'Major Industries',
        cards: [
          {
            question: 'What are Pakistan\'s major industries?',
            answer: '1. Textile Industry\n2. Food Processing\n3. Cement Industry\n4. Steel Industry\n5. Automotive Industry\n6. Pharmaceutical Industry',
            type: 'fact'
          },
          {
            question: 'Why is the textile industry important for Pakistan?',
            answer: '1. Largest industrial sector\n2. Major employer\n3. Main export earner\n4. Uses local raw materials\n5. Attracts foreign investment\n6. Supports related industries',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies Geography',
        topic: 'Industry',
        subtopic: 'Industrial Regions',
        cards: [
          {
            question: 'Where are Pakistan\'s main industrial regions?',
            answer: '1. Karachi-Hyderabad region\n2. Faisalabad-Lahore region\n3. Rawalpindi-Islamabad region\n4. Multan-Bahawalpur region\n5. Peshawar valley\n6. Quetta region',
            type: 'fact'
          },
          {
            question: 'What factors influence industrial location?',
            answer: '1. Raw material availability\n2. Transport links\n3. Market access\n4. Labor availability\n5. Power supply\n6. Government policies',
            type: 'concept'
          }
        ]
      },
      // Section 5: Population
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies Geography',
        topic: 'Population',
        subtopic: 'Population Characteristics',
        cards: [
          {
            question: 'What are the key features of Pakistan\'s population?',
            answer: '1. Rapid growth rate\n2. Young population\n3. Uneven distribution\n4. Rural-urban migration\n5. High dependency ratio\n6. Cultural diversity',
            type: 'fact'
          },
          {
            question: 'What are the main population problems in Pakistan?',
            answer: '1. Overpopulation\n2. Unemployment\n3. Housing shortage\n4. Education access\n5. Healthcare needs\n6. Resource pressure',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Pakistan Studies Geography',
        topic: 'Population',
        subtopic: 'Settlement Patterns',
        cards: [
          {
            question: 'What are the main types of rural settlements in Pakistan?',
            answer: '1. Nucleated villages\n2. Dispersed settlements\n3. Linear settlements\n4. Temporary settlements\n5. Based on water availability\n6. Influenced by topography',
            type: 'fact'
          },
          {
            question: 'How are urban areas developing in Pakistan?',
            answer: '1. Rapid urbanization\n2. Metropolitan growth\n3. Suburban expansion\n4. Informal settlements\n5. Infrastructure challenges\n6. Environmental issues',
            type: 'concept'
          }
        ]
      }
    ];

    // Economics flashcards based on curriculum
    const economicsFlashcards = [
      // Section 1: Basic Economic Problems
      {
        gradeLevel: 'O-Level',
        subject: 'Economics',
        topic: 'Basic Economic Problems',
        subtopic: 'Scarcity and Choice',
        cards: [
          {
            question: 'What are the basic economic problems?',
            answer: '1. What to produce?\n2. How to produce?\n3. For whom to produce?\n4. Limited resources vs unlimited wants\n5. Opportunity cost\n6. Economic efficiency',
            type: 'concept'
          },
          {
            question: 'Explain opportunity cost with examples',
            answer: '1. Definition: Cost of next best alternative foregone\n2. Student choosing study vs work\n3. Business investing in machinery vs advertising\n4. Government spending on education vs healthcare\n5. Limited budget choices\n6. Trade-offs in decision making',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Economics',
        topic: 'Basic Economic Problems',
        subtopic: 'Economic Systems',
        cards: [
          {
            question: 'Compare different economic systems',
            answer: '1. Free Market Economy: Private ownership, price mechanism\n2. Planned Economy: State control, central planning\n3. Mixed Economy: Both private and public sectors\n4. Traditional Economy: Custom-based decisions\n5. Each has pros and cons\n6. Most countries use mixed system',
            type: 'fact'
          },
          {
            question: 'How does the price mechanism work?',
            answer: '1. Supply and demand interaction\n2. Price signals guide resources\n3. Consumer sovereignty\n4. Producer response to profits\n5. Market equilibrium\n6. Resource allocation',
            type: 'concept'
          }
        ]
      },
      // Section 2: Markets and Prices
      {
        gradeLevel: 'O-Level',
        subject: 'Economics',
        topic: 'Markets and Prices',
        subtopic: 'Demand and Supply',
        cards: [
          {
            question: 'What factors affect demand?',
            answer: '1. Price of good\n2. Income levels\n3. Prices of related goods\n4. Tastes and preferences\n5. Population/Market size\n6. Future expectations',
            type: 'fact'
          },
          {
            question: 'What factors affect supply?',
            answer: '1. Price of good\n2. Cost of production\n3. Technology\n4. Government policies\n5. Natural factors\n6. Future expectations',
            type: 'fact'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Economics',
        topic: 'Markets and Prices',
        subtopic: 'Market Structure',
        cards: [
          {
            question: 'What are the main types of market structures?',
            answer: '1. Perfect Competition\n2. Monopolistic Competition\n3. Oligopoly\n4. Monopoly\n5. Each has different characteristics\n6. Affects price and output decisions',
            type: 'fact'
          },
          {
            question: 'Compare perfect competition and monopoly',
            answer: '1. Number of firms (Many vs One)\n2. Product type (Identical vs Unique)\n3. Price control (None vs Significant)\n4. Entry barriers (None vs High)\n5. Information (Perfect vs Imperfect)\n6. Profit maximization approaches',
            type: 'concept'
          }
        ]
      },
      // Section 3: Money and Banking
      {
        gradeLevel: 'O-Level',
        subject: 'Economics',
        topic: 'Money and Banking',
        subtopic: 'Functions of Money',
        cards: [
          {
            question: 'What are the functions of money?',
            answer: '1. Medium of exchange\n2. Store of value\n3. Unit of account\n4. Standard of deferred payment\n5. Must be widely accepted\n6. Should maintain value',
            type: 'fact'
          },
          {
            question: 'How do banks create money?',
            answer: '1. Accept deposits\n2. Make loans\n3. Credit creation process\n4. Fractional reserve system\n5. Money multiplier effect\n6. Central bank regulation',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Economics',
        topic: 'Money and Banking',
        subtopic: 'Central Banking',
        cards: [
          {
            question: 'What are the functions of a central bank?',
            answer: '1. Issue currency\n2. Banker to government\n3. Banker to banks\n4. Monetary policy\n5. Foreign exchange management\n6. Financial stability',
            type: 'fact'
          },
          {
            question: 'What monetary policy tools are available?',
            answer: '1. Interest rates\n2. Open market operations\n3. Reserve requirements\n4. Discount rate\n5. Credit controls\n6. Moral suasion',
            type: 'concept'
          }
        ]
      },
      // Section 4: Government Economic Policy
      {
        gradeLevel: 'O-Level',
        subject: 'Economics',
        topic: 'Government Economic Policy',
        subtopic: 'Fiscal Policy',
        cards: [
          {
            question: 'What is fiscal policy?',
            answer: '1. Government spending\n2. Taxation\n3. Budget management\n4. Economic stability\n5. Income redistribution\n6. Resource allocation',
            type: 'fact'
          },
          {
            question: 'How can fiscal policy affect the economy?',
            answer: '1. Control inflation/deflation\n2. Manage unemployment\n3. Economic growth\n4. Income equality\n5. Public services provision\n6. Debt management',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Economics',
        topic: 'Government Economic Policy',
        subtopic: 'International Trade',
        cards: [
          {
            question: 'What are the benefits of international trade?',
            answer: '1. Specialization advantages\n2. Wider consumer choice\n3. Competition benefits\n4. Technology transfer\n5. Economic growth\n6. International relations',
            type: 'fact'
          },
          {
            question: 'What affects exchange rates?',
            answer: '1. Trade balance\n2. Interest rates\n3. Inflation rates\n4. Political stability\n5. Economic growth\n6. Speculation',
            type: 'concept'
          }
        ]
      },
      // Section 5: Development Economics
      {
        gradeLevel: 'O-Level',
        subject: 'Economics',
        topic: 'Development Economics',
        subtopic: 'Economic Growth',
        cards: [
          {
            question: 'What factors affect economic growth?',
            answer: '1. Natural resources\n2. Human capital\n3. Physical capital\n4. Technology\n5. Institutions\n6. Government policies',
            type: 'fact'
          },
          {
            question: 'What are the costs and benefits of economic growth?',
            answer: 'Benefits:\n1. Higher living standards\n2. Better public services\n3. More employment\n\nCosts:\n1. Environmental damage\n2. Income inequality\n3. Social problems',
            type: 'concept'
          }
        ]
      },
      {
        gradeLevel: 'O-Level',
        subject: 'Economics',
        topic: 'Development Economics',
        subtopic: 'Poverty and Inequality',
        cards: [
          {
            question: 'What are the main causes of poverty?',
            answer: '1. Lack of education\n2. Limited job opportunities\n3. Poor healthcare\n4. Social discrimination\n5. Economic policies\n6. Resource distribution',
            type: 'fact'
          },
          {
            question: 'How can governments reduce poverty?',
            answer: '1. Education investment\n2. Job creation programs\n3. Healthcare access\n4. Social welfare\n5. Infrastructure development\n6. Economic opportunities',
            type: 'concept'
          }
        ]
      }
    ];

    // Insert all flashcard sets
    await FlashcardSet.insertMany([
      ...computerScienceFlashcards,
      ...historyFlashcards,
      ...geographyFlashcards,
      ...economicsFlashcards
    ]);

    console.log('Successfully populated flashcard sets');
  } catch (error) {
    console.error('Error populating flashcard sets:', error);
  } finally {
    mongoose.disconnect();
  }
}

populateFlashcards();
