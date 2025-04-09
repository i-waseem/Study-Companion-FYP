const historyData = {
  gradeLevel: 'O-Level',
  subject: 'Pakistan Studies - History',
  topics: [
    {
      name: 'The Making of Pakistan',
      subtopics: [
        {
          name: 'The Rise of Muslim Nationalism',
          description: 'Understanding the factors that led to Muslim nationalism in the subcontinent',
          learningObjectives: [
            'Explain the factors that led to the rise of Muslim nationalism in the subcontinent',
            'Analyze the role of Sir Syed Ahmad Khan in Muslim political awakening',
            'Describe the formation and objectives of the All-India Muslim League',
            'Understand the significance of the Two-Nation Theory'
          ]
        },
        {
          name: 'The Pakistan Movement',
          description: 'Key events and personalities in the Pakistan Movement',
          learningObjectives: [
            'Evaluate the importance of the Lahore Resolution 1940',
            'Describe the role of Quaid-e-Azam Muhammad Ali Jinnah in the creation of Pakistan',
            'Analyze the factors that led to the partition of Bengal 1905',
            'Explain the significance of the 1937 elections'
          ]
        }
      ]
    },
    {
      name: 'Early History of Pakistan',
      subtopics: [
        {
          name: 'Problems at Independence',
          description: 'Challenges faced by Pakistan after independence',
          learningObjectives: [
            'Identify the major problems faced by Pakistan at independence',
            'Explain how Pakistan dealt with the refugee crisis',
            'Analyze the economic challenges faced by the new state',
            'Describe the process of establishing government institutions'
          ]
        },
        {
          name: 'Constitutional Development',
          description: 'The development of Pakistan\'s constitution',
          learningObjectives: [
            'Trace the development of Pakistan\'s constitution from 1947 to 1956',
            'Analyze the main features of the 1956 Constitution',
            'Explain the reasons for the failure of the 1956 Constitution',
            'Describe the key aspects of the 1962 Constitution'
          ]
        }
      ]
    }
  ]
};

const geographyData = {
  gradeLevel: 'O-Level',
  subject: 'Pakistan Studies - Geography',
  topics: [
    {
      name: 'The Land of Pakistan',
      subtopics: [
        {
          name: 'Physical Features',
          description: 'Understanding Pakistan\'s physical geography',
          learningObjectives: [
            'Describe the major physical features of Pakistan',
            'Explain the importance of the Indus River system',
            'Identify the main mountain ranges of Pakistan',
            'Analyze the impact of physical features on human activities'
          ]
        },
        {
          name: 'Climate',
          description: 'Pakistan\'s climate patterns and their effects',
          learningObjectives: [
            'Describe the climatic regions of Pakistan',
            'Explain the factors affecting Pakistan\'s climate',
            'Analyze the impact of monsoons on Pakistan',
            'Understand the effects of climate change in Pakistan'
          ]
        }
      ]
    },
    {
      name: 'Natural Resources',
      subtopics: [
        {
          name: 'Water Resources',
          description: 'Pakistan\'s water resources and their management',
          learningObjectives: [
            'Identify the major water resources of Pakistan',
            'Explain the importance of the Indus Water Treaty',
            'Analyze water conservation methods in Pakistan',
            'Describe the challenges of water management'
          ]
        },
        {
          name: 'Mineral Resources',
          description: 'Pakistan\'s mineral wealth and its utilization',
          learningObjectives: [
            'List the major mineral resources of Pakistan',
            'Explain the distribution of mineral resources',
            'Analyze the economic importance of minerals',
            'Describe the challenges in mineral extraction'
          ]
        }
      ]
    }
  ]
};

module.exports = { historyData, geographyData };
