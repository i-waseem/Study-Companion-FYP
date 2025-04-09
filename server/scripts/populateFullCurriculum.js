require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('../models/Curriculum');

const curricula = [
  {
    gradeLevel: 'O-Level',
    subject: 'Computer Science',
    topics: [
      {
        name: 'Computer Systems',
        subtopics: [
          {
            name: 'Data Representation',
            description: 'Understanding data representation in computer systems',
            learningObjectives: [
              'Explain binary number system and its importance',
              'Analyze different number bases and conversions',
              'Understand ASCII and Unicode encoding',
              'Describe image and sound representation'
            ]
          },
          {
            name: 'Data Transmission',
            description: 'Understanding data communication',
            learningObjectives: [
              'Explain serial and parallel data transmission',
              'Understand communication protocols',
              'Analyze error checking methods',
              'Describe network topologies'
            ]
          },
          {
            name: 'Hardware',
            description: 'Understanding computer hardware components',
            learningObjectives: [
              'Identify main hardware components',
              'Understand CPU architecture',
              'Explain memory hierarchy',
              'Describe input/output devices'
            ]
          },
          {
            name: 'Software',
            description: 'Understanding software types and functions',
            learningObjectives: [
              'Distinguish system and application software',
              'Understand operating system functions',
              'Explain utility software purposes',
              'Describe software development tools'
            ]
          },
          {
            name: 'Internet & Its Uses',
            description: 'Understanding internet technologies',
            learningObjectives: [
              'Explain internet protocols',
              'Understand web technologies',
              'Analyze internet security',
              'Describe cloud computing'
            ]
          },
          {
            name: 'Automated & Emerging Technologies',
            description: 'Understanding modern computing trends',
            learningObjectives: [
              'Explain automation concepts',
              'Understand artificial intelligence basics',
              'Analyze robotics applications',
              'Describe IoT technologies'
            ]
          }
        ]
      },
      {
        name: 'Algorithms, Programming, and Logic',
        subtopics: [
          {
            name: 'Algorithm Design & Problem-Solving',
            description: 'Understanding algorithm development',
            learningObjectives: [
              'Develop problem-solving strategies',
              'Create flowcharts and pseudocode',
              'Analyze algorithm efficiency',
              'Design structured algorithms'
            ]
          },
          {
            name: 'Programming',
            description: 'Understanding programming concepts',
            learningObjectives: [
              'Write structured programs',
              'Implement control structures',
              'Use arrays and functions',
              'Debug and test programs'
            ]
          },
          {
            name: 'Databases',
            description: 'Understanding database concepts',
            learningObjectives: [
              'Design database structures',
              'Write SQL queries',
              'Understand data normalization',
              'Implement data validation'
            ]
          },
          {
            name: 'Boolean Logic',
            description: 'Understanding logic operations',
            learningObjectives: [
              'Apply Boolean operators',
              'Create truth tables',
              'Simplify logic expressions',
              'Design logic circuits'
            ]
          }
        ]
      }
    ]
  },
  {
    gradeLevel: 'O-Level',
    subject: 'Pakistan Studies - History',
    topics: [
      {
        name: 'British Rule in the Subcontinent',
        subtopics: [
          {
            name: 'Early British Colonization',
            description: 'Understanding the arrival and establishment of British rule',
            learningObjectives: [
              'Explain the East India Company\'s role in colonization',
              'Analyze the impact of British policies on local governance',
              'Understand the War of Independence 1857',
              'Describe the transition to Crown rule'
            ]
          },
          {
            name: 'Colonial Reforms and Policies',
            description: 'Understanding British administrative and social reforms',
            learningObjectives: [
              'Evaluate educational and social reforms',
              'Analyze economic policies and their impact',
              'Understand changes in political structure',
              'Describe the development of railways and infrastructure'
            ]
          }
        ]
      },
      {
        name: 'Independence Movement',
        subtopics: [
          {
            name: 'Early Nationalist Movements',
            description: 'Understanding the development of political consciousness',
            learningObjectives: [
              'Explain the formation of political organizations',
              'Analyze the role of Sir Syed Ahmad Khan',
              'Understand the Khilafat Movement',
              'Describe the evolution of Muslim political thought'
            ]
          },
          {
            name: 'Pakistan Movement',
            description: 'Understanding the struggle for Pakistan',
            learningObjectives: [
              'Explain the Allahabad Address and Two-Nation Theory',
              'Analyze the role of Quaid-e-Azam Muhammad Ali Jinnah',
              'Understand key events leading to independence',
              'Describe the partition process and challenges'
            ]
          }
        ]
      }
    ]
  },
  {
    gradeLevel: 'O-Level',
    subject: 'Pakistan Studies - Geography',
    topics: [
      {
        name: 'Physical Geography',
        subtopics: [
          {
            name: 'Topography and Climate',
            description: 'Understanding Pakistan\'s physical features and climate',
            learningObjectives: [
              'Describe the major landforms of Pakistan',
              'Analyze climatic regions and weather patterns',
              'Understand the impact of monsoons',
              'Explain the importance of river systems'
            ]
          },
          {
            name: 'Natural Resources',
            description: 'Understanding Pakistan\'s natural resources',
            learningObjectives: [
              'Identify major mineral resources',
              'Analyze water resources and their management',
              'Understand energy resources',
              'Describe conservation challenges'
            ]
          }
        ]
      },
      {
        name: 'Human Geography',
        subtopics: [
          {
            name: 'Population and Settlement',
            description: 'Understanding population dynamics and settlement patterns',
            learningObjectives: [
              'Analyze population distribution and density',
              'Explain rural-urban migration patterns',
              'Understand urbanization challenges',
              'Describe settlement hierarchies'
            ]
          },
          {
            name: 'Economic Activities',
            description: 'Understanding economic geography',
            learningObjectives: [
              'Analyze agricultural patterns',
              'Understand industrial development',
              'Explain trade and transportation networks',
              'Describe economic challenges and opportunities'
            ]
          }
        ]
      }
    ]
  },
  {
    gradeLevel: 'O-Level',
    subject: 'Economics',
    topics: [
      {
        name: 'Basic Economic Concepts',
        subtopics: [
          {
            name: 'Scarcity and Choice',
            description: 'Understanding fundamental economic principles',
            learningObjectives: [
              'Explain the concept of scarcity',
              'Analyze opportunity costs',
              'Understand economic systems',
              'Describe resource allocation'
            ]
          },
          {
            name: 'Factors of Production',
            description: 'Understanding production resources',
            learningObjectives: [
              'Identify factors of production',
              'Analyze factor mobility',
              'Understand factor rewards',
              'Describe productivity and efficiency'
            ]
          }
        ]
      },
      {
        name: 'Market Forces',
        subtopics: [
          {
            name: 'Demand and Supply',
            description: 'Understanding market mechanisms',
            learningObjectives: [
              'Explain demand and supply laws',
              'Analyze market equilibrium',
              'Understand price mechanisms',
              'Describe market changes'
            ]
          },
          {
            name: 'Price Elasticity',
            description: 'Understanding price responsiveness',
            learningObjectives: [
              'Calculate price elasticity',
              'Analyze elasticity factors',
              'Understand business applications',
              'Describe policy implications'
            ]
          }
        ]
      }
    ]
  }
];

async function populateCurriculum() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing curricula
    await Curriculum.deleteMany({});
    console.log('Cleared existing curricula');

    // Insert new curricula
    await Curriculum.insertMany(curricula);
    console.log('Successfully populated curricula');

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

populateCurriculum();
