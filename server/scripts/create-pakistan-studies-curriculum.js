require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('../models/Curriculum');

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create Pakistan Studies - History curriculum
    const historyData = {
      gradeLevel: 'O-Level',
      subject: 'Pakistan Studies - History',
      topics: [
        {
          name: 'Cultural and Historical Background to the Pakistan Movement',
          subtopics: [
            {
              name: 'Religious Thinkers and the Spread of Islam',
              description: 'Understanding the contributions of key religious thinkers in the spread of Islam in the subcontinent.',
              learningObjectives: [
                'Analyze the contributions of Shah Waliullah to Islamic thought',
                'Evaluate the reform movements of Syed Ahmad Barelvi',
                'Understand the impact of Haji Shariatullah and the Faraizi Movement',
                'Assess how these thinkers influenced the development of Muslim identity'
              ]
            },
            {
              name: 'Decline of the Mughal Empire',
              description: 'Understanding the factors that led to the decline of the Mughal Empire and the rise of British power.',
              learningObjectives: [
                'Analyze Aurangzeb\'s policies and their long-term effects',
                'Evaluate the role of the East India Company in the decline',
                'Understand the political fragmentation after Aurangzeb',
                'Assess the economic impact of declining Mughal power'
              ]
            },
            {
              name: 'War of Independence 1857-58',
              description: 'Understanding the causes, events, and consequences of the War of Independence.',
              learningObjectives: [
                'Identify the military, political, and social causes of the uprising',
                'Analyze key events and personalities during the conflict',
                'Evaluate the consequences for Muslims in the subcontinent',
                'Understand British reaction and policy changes after 1858'
              ]
            },
            {
              name: 'Sir Syed Ahmad Khan and the Aligarh Movement',
              description: 'Understanding the role of Sir Syed Ahmad Khan in Muslim educational and social reform.',
              learningObjectives: [
                'Analyze Sir Syed\'s educational philosophy and reforms',
                'Evaluate the impact of the Aligarh Movement on Muslim society',
                'Understand Sir Syed\'s political views and their significance',
                'Assess the long-term influence of Aligarh on the Pakistan Movement'
              ]
            },
            {
              name: 'Urdu and Regional Languages in Pakistan\'s Culture',
              description: 'Understanding the development and significance of Urdu and regional languages in Pakistan\'s cultural identity.',
              learningObjectives: [
                'Trace the development of Urdu as a language of Muslim identity',
                'Analyze the role of regional languages in cultural expression',
                'Evaluate language controversies in pre-partition India',
                'Understand the significance of linguistic diversity in Pakistan'
              ]
            }
          ]
        },
        {
          name: 'The Emergence of Pakistan (1906–1947)',
          subtopics: [
            {
              name: 'Formation of the Muslim League',
              description: 'Understanding the circumstances and significance of the formation of the All-India Muslim League.',
              learningObjectives: [
                'Analyze the political context leading to the formation of the Muslim League',
                'Evaluate the role of key personalities in establishing the League',
                'Understand the initial objectives and strategies of the organization',
                'Assess the significance of the League in representing Muslim interests'
              ]
            },
            {
              name: 'Partition of Bengal and Simla Deputation',
              description: 'Understanding the impact of the Partition of Bengal and the significance of the Simla Deputation.',
              learningObjectives: [
                'Analyze the causes and implementation of the Partition of Bengal',
                'Evaluate Hindu and Muslim reactions to the partition',
                'Understand the objectives and outcomes of the Simla Deputation',
                'Assess how these events shaped Muslim political consciousness'
              ]
            },
            {
              name: 'Pakistan Resolution and Later Struggles',
              description: 'Understanding the significance of the Pakistan Resolution and the final phase of the independence movement.',
              learningObjectives: [
                'Analyze the context and content of the Pakistan Resolution (1940)',
                'Evaluate the impact of World War II on the independence movement',
                'Understand the Cripps Mission, Quit India Movement, and their significance',
                'Assess the role of Quaid-e-Azam Muhammad Ali Jinnah in this period'
              ]
            },
            {
              name: 'Cabinet Mission and Independence',
              description: 'Understanding the final negotiations leading to independence and partition.',
              learningObjectives: [
                'Analyze the Cabinet Mission Plan and reactions to it',
                'Evaluate the significance of Direct Action Day',
                'Understand the Mountbatten Plan and Partition arrangements',
                'Assess the immediate challenges faced during independence in 1947'
              ]
            }
          ]
        },
        {
          name: 'Nationhood (1947–1999)',
          subtopics: [
            {
              name: 'Partition Challenges',
              description: 'Understanding the immediate challenges faced by Pakistan after independence.',
              learningObjectives: [
                'Analyze the scale and impact of the refugee crisis',
                'Evaluate the economic challenges of early independence',
                'Understand the origins and development of the Kashmir conflict',
                'Assess how these challenges shaped Pakistan\'s early development'
              ]
            },
            {
              name: 'Political Developments',
              description: 'Understanding the major political developments in Pakistan from 1947 to 1999.',
              learningObjectives: [
                'Analyze the constitutional crises and development of Pakistan',
                'Evaluate the causes and consequences of military interventions',
                'Understand the transition between civilian and military rule',
                'Assess the development of democratic institutions in Pakistan'
              ]
            },
            {
              name: 'Breakup of Pakistan',
              description: 'Understanding the factors leading to the separation of East Pakistan and formation of Bangladesh.',
              learningObjectives: [
                'Analyze the political, economic, and cultural disparities between East and West Pakistan',
                'Evaluate the events of 1970-71 leading to separation',
                'Understand the role of international actors in the conflict',
                'Assess the impact of the 1971 war on Pakistan\'s development'
              ]
            },
            {
              name: 'Pakistan\'s Role in World Affairs',
              description: 'Understanding Pakistan\'s foreign policy and international relations.',
              learningObjectives: [
                'Analyze Pakistan\'s relations with India and the ongoing Kashmir dispute',
                'Evaluate Pakistan\'s alliance with the United States during the Cold War',
                'Understand Pakistan\'s relations with China and the Muslim world',
                'Assess Pakistan\'s role in international organizations like the UN'
              ]
            }
          ]
        }
      ]
    };

    // Create Pakistan Studies - Geography curriculum
    const geographyData = {
      gradeLevel: 'O-Level',
      subject: 'Pakistan Studies - Geography',
      topics: [
        {
          name: 'The Land of Pakistan',
          subtopics: [
            {
              name: 'Geographic Location and Physical Features',
              description: 'Understanding Pakistan\'s location, provinces, cities, and major landforms.',
              learningObjectives: [
                'Identify Pakistan\'s geographic location and strategic importance',
                'Analyze the physical features of Pakistan\'s provinces and territories',
                'Understand the major landforms and their significance',
                'Evaluate the impact of geography on settlement patterns'
              ]
            },
            {
              name: 'Climate and Natural Resources',
              description: 'Understanding Pakistan\'s climate patterns and natural resource distribution.',
              learningObjectives: [
                'Analyze Pakistan\'s climate zones and seasonal patterns',
                'Identify major natural resources and their distribution',
                'Understand the relationship between climate and agriculture',
                'Evaluate the challenges of climate change for Pakistan'
              ]
            },
            {
              name: 'Rivers and Water Systems',
              description: 'Understanding Pakistan\'s river systems and their importance.',
              learningObjectives: [
                'Identify the major rivers of Pakistan and their tributaries',
                'Analyze the importance of the Indus River system',
                'Understand the seasonal variations in water flow',
                'Evaluate water management challenges and solutions'
              ]
            }
          ]
        },
        {
          name: 'Natural Resources and Sustainability',
          subtopics: [
            {
              name: 'Water Resources',
              description: 'Understanding Pakistan\'s water resources and management issues.',
              learningObjectives: [
                'Analyze the Indus Water Treaty and its implications',
                'Evaluate the role of dams and reservoirs in water management',
                'Understand groundwater resources and their exploitation',
                'Assess water scarcity challenges and conservation strategies'
              ]
            },
            {
              name: 'Forests and Conservation',
              description: 'Understanding Pakistan\'s forest resources and conservation efforts.',
              learningObjectives: [
                'Identify the major forest types and their distribution',
                'Analyze the causes and consequences of deforestation',
                'Understand afforestation and reforestation programs',
                'Evaluate the ecological importance of forests in Pakistan'
              ]
            },
            {
              name: 'Mineral Resources',
              description: 'Understanding Pakistan\'s mineral resources and their economic importance.',
              learningObjectives: [
                'Identify the major mineral resources of Pakistan',
                'Analyze the distribution of coal, oil, gas, and limestone deposits',
                'Understand the economic significance of mineral extraction',
                'Evaluate the environmental impact of mining activities'
              ]
            }
          ]
        },
        {
          name: 'Agriculture and Industry',
          subtopics: [
            {
              name: 'Agricultural Development',
              description: 'Understanding Pakistan\'s agricultural systems and development.',
              learningObjectives: [
                'Analyze the major crops and their cultivation patterns',
                'Evaluate irrigation systems and their effectiveness',
                'Understand livestock farming and its economic importance',
                'Assess agricultural challenges and government policies'
              ]
            },
            {
              name: 'Industrial Development',
              description: 'Understanding Pakistan\'s industrial sector and its development.',
              learningObjectives: [
                'Identify major industries and their distribution',
                'Analyze the factors affecting industrial location',
                'Understand the role of small and large-scale industries',
                'Evaluate industrial policies and their impact on development'
              ]
            },
            {
              name: 'Trade and Economic Growth',
              description: 'Understanding Pakistan\'s trade patterns and economic development.',
              learningObjectives: [
                'Analyze Pakistan\'s major exports and imports',
                'Identify key trading partners and trade agreements',
                'Understand the balance of trade and its implications',
                'Evaluate strategies for economic growth through trade'
              ]
            }
          ]
        },
        {
          name: 'Population and Development',
          subtopics: [
            {
              name: 'Population Dynamics',
              description: 'Understanding Pakistan\'s population trends and demographic challenges.',
              learningObjectives: [
                'Analyze population growth rates and distribution patterns',
                'Evaluate the causes and consequences of urbanization',
                'Understand age and gender structures in the population',
                'Assess population policies and their effectiveness'
              ]
            },
            {
              name: 'Transport and Communication',
              description: 'Understanding Pakistan\'s transport and communication networks.',
              learningObjectives: [
                'Identify major road, rail, air, and sea transport networks',
                'Analyze the development of transport infrastructure',
                'Understand the role of digital and communication technologies',
                'Evaluate the economic impact of transportation systems'
              ]
            },
            {
              name: 'Employment and Migration',
              description: 'Understanding employment patterns and migration trends in Pakistan.',
              learningObjectives: [
                'Analyze employment sectors and labor force participation',
                'Evaluate the challenges of unemployment and underemployment',
                'Understand internal and international migration patterns',
                'Assess the economic and social impact of migration'
              ]
            }
          ]
        }
      ]
    };

    // Check if Pakistan Studies curricula already exist
    const existingHistory = await Curriculum.findOne({ subject: 'Pakistan Studies - History' });
    const existingGeography = await Curriculum.findOne({ subject: 'Pakistan Studies - Geography' });

    // Create or update History curriculum
    if (existingHistory) {
      console.log('Pakistan Studies - History curriculum already exists. Updating...');
      await Curriculum.findByIdAndUpdate(existingHistory._id, historyData);
      console.log('Pakistan Studies - History curriculum updated successfully');
    } else {
      console.log('Creating Pakistan Studies - History curriculum...');
      const historyModel = new Curriculum(historyData);
      await historyModel.save();
      console.log('Pakistan Studies - History curriculum created successfully');
    }

    // Create or update Geography curriculum
    if (existingGeography) {
      console.log('Pakistan Studies - Geography curriculum already exists. Updating...');
      await Curriculum.findByIdAndUpdate(existingGeography._id, geographyData);
      console.log('Pakistan Studies - Geography curriculum updated successfully');
    } else {
      console.log('Creating Pakistan Studies - Geography curriculum...');
      const geographyModel = new Curriculum(geographyData);
      await geographyModel.save();
      console.log('Pakistan Studies - Geography curriculum created successfully');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

main();
