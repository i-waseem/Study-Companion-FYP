require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('./models/Curriculum');

const historyData = {
  gradeLevel: 'O-Level',
  subject: 'History',
  topics: [
    {
      name: 'Cultural and Historical Background to the Pakistan Movement',
      subtopics: [
        {
          name: 'Religious Thinkers and the Spread of Islam',
          description: 'Understanding the role of key religious thinkers in spreading Islam',
          learningObjectives: [
            'Analyze the contributions of Shah Waliullah',
            'Evaluate the impact of Syed Ahmad Barelvi',
            'Understand the role of Haji Shariatullah'
          ]
        },
        {
          name: 'Decline of the Mughal Empire',
          description: 'Understanding the factors leading to Mughal decline',
          learningObjectives: [
            'Analyze Aurangzeb\'s Policies',
            'Evaluate the role of East India Company',
            'Understand the economic and social factors'
          ]
        },
        {
          name: 'War of Independence 1857-58',
          description: 'Understanding the causes and consequences of the War of Independence',
          learningObjectives: [
            'Analyze the causes of the war',
            'Evaluate the consequences',
            'Understand the British reaction'
          ]
        },
        {
          name: 'Sir Syed Ahmad Khan and the Aligarh Movement',
          description: 'Understanding the educational and social reforms',
          learningObjectives: [
            'Analyze Sir Syed\'s educational vision',
            'Evaluate the impact of Aligarh Movement',
            'Understand the modernization efforts'
          ]
        },
        {
          name: 'Urdu and Regional Languages',
          description: 'Understanding the role of languages in Pakistan\'s culture',
          learningObjectives: [
            'Analyze the importance of Urdu',
            'Evaluate the role of regional languages',
            'Understand cultural diversity'
          ]
        }
      ]
    },
    {
      name: 'The Emergence of Pakistan (1906–1947)',
      subtopics: [
        {
          name: 'Formation of the Muslim League',
          description: 'Understanding the establishment of Muslim political identity',
          learningObjectives: [
            'Analyze the formation process',
            'Evaluate early leadership',
            'Understand political objectives'
          ]
        },
        {
          name: 'Early Political Developments',
          description: 'Understanding key political events',
          learningObjectives: [
            'Analyze the Partition of Bengal',
            'Evaluate the Simla Deputation',
            'Understand the Lucknow Pact'
          ]
        },
        {
          name: 'Constitutional Developments',
          description: 'Understanding major constitutional milestones',
          learningObjectives: [
            'Analyze Jinnah\'s 14 Points',
            'Evaluate the Round Table Conferences',
            'Understand the Government of India Act 1935'
          ]
        },
        {
          name: 'Pakistan Resolution and Independence',
          description: 'Understanding the final phase of independence',
          learningObjectives: [
            'Analyze the Pakistan Resolution (1940)',
            'Evaluate the Cabinet Mission',
            'Understand Direct Action Day and Independence'
          ]
        }
      ]
    },
    {
      name: 'Nationhood (1947–1999)',
      subtopics: [
        {
          name: 'Partition Challenges',
          description: 'Understanding early challenges of independence',
          learningObjectives: [
            'Analyze the refugee crisis',
            'Evaluate the Kashmir conflict',
            'Understand administrative challenges'
          ]
        },
        {
          name: 'Political Developments',
          description: 'Understanding major political events',
          learningObjectives: [
            'Analyze constitutional crises',
            'Evaluate military coups',
            'Understand democratic transitions'
          ]
        },
        {
          name: 'Role of Leaders',
          description: 'Understanding key leadership contributions',
          learningObjectives: [
            'Analyze Jinnah and Liaquat Ali Khan\'s roles',
            'Evaluate Bhutto\'s policies',
            'Understand Zia-ul-Haq\'s era'
          ]
        },
        {
          name: 'International Relations',
          description: 'Understanding Pakistan\'s foreign relations',
          learningObjectives: [
            'Analyze relations with India',
            'Evaluate ties with USA and China',
            'Understand role in UN'
          ]
        }
      ]
    }
  ]
};

const geographyData = {
  gradeLevel: 'O-Level',
  subject: 'Geography',
  topics: [
    {
      name: 'The Land of Pakistan',
      subtopics: [
        {
          name: 'Geographic Features',
          description: 'Understanding Pakistan\'s physical geography',
          learningObjectives: [
            'Analyze geographic location and provinces',
            'Evaluate major landforms',
            'Understand river systems'
          ]
        },
        {
          name: 'Climate and Environment',
          description: 'Understanding environmental factors',
          learningObjectives: [
            'Analyze climate patterns',
            'Evaluate natural resources',
            'Understand human impact'
          ]
        }
      ]
    },
    {
      name: 'Natural Resources and Sustainability',
      subtopics: [
        {
          name: 'Water Resources',
          description: 'Understanding water management',
          learningObjectives: [
            'Analyze the Indus Water Treaty',
            'Evaluate dam projects',
            'Understand water conservation'
          ]
        },
        {
          name: 'Forest Resources',
          description: 'Understanding forest management',
          learningObjectives: [
            'Analyze deforestation issues',
            'Evaluate afforestation efforts',
            'Understand conservation strategies'
          ]
        },
        {
          name: 'Mineral Resources',
          description: 'Understanding mineral wealth',
          learningObjectives: [
            'Analyze coal and oil resources',
            'Evaluate gas reserves',
            'Understand limestone deposits'
          ]
        },
        {
          name: 'Fishing Industry',
          description: 'Understanding marine resources',
          learningObjectives: [
            'Analyze fishing methods',
            'Evaluate industry challenges',
            'Understand economic impact'
          ]
        }
      ]
    },
    {
      name: 'Power and Energy',
      subtopics: [
        {
          name: 'Energy Sources',
          description: 'Understanding energy resources',
          learningObjectives: [
            'Analyze renewable energy potential',
            'Evaluate non-renewable sources',
            'Understand energy mix'
          ]
        },
        {
          name: 'Energy Development',
          description: 'Understanding energy infrastructure',
          learningObjectives: [
            'Analyze hydroelectric projects',
            'Evaluate solar and wind power',
            'Understand nuclear energy'
          ]
        }
      ]
    },
    {
      name: 'Agricultural Development',
      subtopics: [
        {
          name: 'Crop Production',
          description: 'Understanding major crops',
          learningObjectives: [
            'Analyze cotton and rice farming',
            'Evaluate wheat production',
            'Understand sugarcane cultivation'
          ]
        },
        {
          name: 'Agricultural Methods',
          description: 'Understanding farming practices',
          learningObjectives: [
            'Analyze irrigation systems',
            'Evaluate livestock management',
            'Understand modern techniques'
          ]
        },
        {
          name: 'Agricultural Policy',
          description: 'Understanding sector management',
          learningObjectives: [
            'Analyze government policies',
            'Evaluate agricultural challenges',
            'Understand development plans'
          ]
        }
      ]
    },
    {
      name: 'Industrial Development',
      subtopics: [
        {
          name: 'Major Industries',
          description: 'Understanding key industrial sectors',
          learningObjectives: [
            'Analyze textile industry',
            'Evaluate cement production',
            'Understand steel and fertilizers'
          ]
        },
        {
          name: 'Industrial Scale',
          description: 'Understanding industry types',
          learningObjectives: [
            'Analyze small-scale industries',
            'Evaluate large-scale industries',
            'Understand economic impact'
          ]
        }
      ]
    },
    {
      name: 'Trade and Transport',
      subtopics: [
        {
          name: 'International Trade',
          description: 'Understanding trade patterns',
          learningObjectives: [
            'Analyze exports and imports',
            'Evaluate trading partners',
            'Understand economic growth'
          ]
        },
        {
          name: 'Transport Networks',
          description: 'Understanding infrastructure',
          learningObjectives: [
            'Analyze road and rail networks',
            'Evaluate air transport',
            'Understand sea routes'
          ]
        },
        {
          name: 'Communications',
          description: 'Understanding modern connectivity',
          learningObjectives: [
            'Analyze digital infrastructure',
            'Evaluate telecommunication',
            'Understand technological impact'
          ]
        }
      ]
    },
    {
      name: 'Population and Employment',
      subtopics: [
        {
          name: 'Demographics',
          description: 'Understanding population patterns',
          learningObjectives: [
            'Analyze birth rates',
            'Evaluate urbanization',
            'Understand population distribution'
          ]
        },
        {
          name: 'Employment Issues',
          description: 'Understanding labor market',
          learningObjectives: [
            'Analyze unemployment',
            'Evaluate migration patterns',
            'Understand job creation'
          ]
        }
      ]
    }
  ]
};

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      // First, verify the existing data
      console.log('\nVerifying existing data...');
      const existingDocs = await Curriculum.find({
        subject: { $in: ['History', 'Geography'] }
      }).lean();
      
      console.log('Found existing documents:', existingDocs.length);
      
      // Update History curriculum
      const history = await Curriculum.findOneAndUpdate(
        { subject: 'History' },
        historyData,
        { new: true, upsert: true }
      );
      console.log('\nUpdated History curriculum:', history._id);

      // Update Geography curriculum
      const geography = await Curriculum.findOneAndUpdate(
        { subject: 'Geography' },
        geographyData,
        { new: true, upsert: true }
      );
      console.log('Updated Geography curriculum:', geography._id);

      // Verify the updates
      const updatedDocs = await Curriculum.find({
        subject: { $in: ['History', 'Geography'] }
      }).lean();

      console.log('\nVerifying updated documents:');
      updatedDocs.forEach(doc => {
        console.log(`\n${doc.subject}:`);
        console.log('Topics:', doc.topics.map(t => t.name));
        console.log('Total topics:', doc.topics.length);
        console.log('Total subtopics:', doc.topics.reduce((acc, t) => acc + t.subtopics.length, 0));
      });

    } catch (error) {
      console.error('Error:', error);
    }
    process.exit();
  });
