const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');
const mongoose = require('mongoose');
const Curriculum = require('../models/Curriculum');
require('dotenv').config();

async function readPDF(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  return pdf(dataBuffer);
}

function cleanText(text) {
  // Remove page headers and footers
  return text.replace(/Cambridge O Level.+?\n/g, '')
            .replace(/www\.cambridgeinternational\.org.+?\n/g, '')
            .replace(/Syllabus.+?\n/g, '')
            .replace(/\[Turn over\]/g, '')
            .replace(/Back to contents page/g, '');
}

function extractSections(text, debug = false) {
  // Clean the text first
  text = cleanText(text);
  
  // Split text into lines and remove empty lines
  const lines = text.split('\n').filter(line => line.trim());
  
  const sections = {
    topics: [],
    currentTopic: null,
    currentSubtopic: null
  };

  let inSyllabusContent = false;
  let inLearningObjectives = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    if (debug) {
      console.log('Processing line:', line);
    }

    // Skip administrative content
    if (line.includes('not available in all administrative zones') ||
        line.includes('Please check the syllabus page') ||
        line.includes('For the purposes of screen readers')) {
      continue;
    }

    // Start capturing content after "Syllabus content"
    if (line.toLowerCase().includes('syllabus content')) {
      inSyllabusContent = true;
      continue;
    }

    if (!inSyllabusContent) continue;

    // Stop when we reach assessment or other sections
    if (line.toLowerCase().includes('assessment objectives') ||
        line.toLowerCase().includes('assessment at a glance')) {
      break;
    }

    // Look for main topics (e.g., "1. Data Representation" or "Topic 1: Data Representation")
    if ((/^\d+[\.:]\s/.test(line) || /^Topic\s+\d+:/.test(line)) && !line.includes('.')) {
      const topicName = line.replace(/^\d+[\.:]\s*/, '')
                           .replace(/^Topic\s+\d+:\s*/, '')
                           .trim();
      
      if (topicName && !topicName.toLowerCase().includes('assessment')) {
        sections.currentTopic = {
          name: topicName,
          subtopics: []
        };
        sections.topics.push(sections.currentTopic);
        inLearningObjectives = false;
      }
    }
    // Look for subtopics (e.g., "1.1 Binary Systems" or numbered lists)
    else if (/^\d+\.\d+\s/.test(line) || /^[a-z]\)\s/.test(line)) {
      if (sections.currentTopic) {
        const subtopicName = line.replace(/^\d+\.\d+\s*/, '')
                               .replace(/^[a-z]\)\s*/, '')
                               .trim();
        
        if (subtopicName && !subtopicName.toLowerCase().includes('assessment')) {
          sections.currentSubtopic = {
            name: subtopicName,
            description: '',
            learningObjectives: []
          };
          sections.currentTopic.subtopics.push(sections.currentSubtopic);
          inLearningObjectives = false;
        }
      }
    }
    // Look for learning objectives sections
    else if (line.toLowerCase().includes('candidates should be able to')) {
      inLearningObjectives = true;
      continue;
    }
    // Capture learning objectives
    else if (inLearningObjectives && sections.currentSubtopic && 
            (line.startsWith('•') || line.startsWith('-') || /^\d+\.\s/.test(line))) {
      const objective = line.replace(/^[•\-]\s*/, '')
                           .replace(/^\d+\.\s*/, '')
                           .trim();
      if (objective) {
        sections.currentSubtopic.learningObjectives.push(objective);
      }
    }
    // Other lines might be descriptions or continuation of previous content
    else if (sections.currentSubtopic && line && !line.toLowerCase().includes('assessment')) {
      if (!inLearningObjectives) {
        if (sections.currentSubtopic.description) {
          sections.currentSubtopic.description += ' ' + line;
        } else {
          sections.currentSubtopic.description = line;
        }
      }
    }
  }

  // Clean up empty topics
  sections.topics = sections.topics.filter(topic => 
    topic.subtopics.length > 0 || topic.name.toLowerCase().includes('topic')
  );

  return sections.topics;
}

async function parsePakistanStudies(pdfData) {
  const text = pdfData.text;
  console.log('Parsing Pakistan Studies content...');
  
  const topics = extractSections(text);
  
  return {
    gradeLevel: 'O-Level',
    subject: 'Pakistan-Studies',
    topics
  };
}

async function parseComputerScience(pdfData) {
  const text = pdfData.text;
  console.log('Parsing Computer Science content...');
  
  const topics = extractSections(text, true); // Enable debug for Computer Science
  
  return {
    gradeLevel: 'O-Level',
    subject: 'Computer-Science',
    topics
  };
}

async function parseEconomics(pdfData) {
  const text = pdfData.text;
  console.log('Parsing Economics content...');
  
  const topics = extractSections(text);
  
  return {
    gradeLevel: 'O-Level',
    subject: 'Economics',
    topics
  };
}

async function parseSyllabus() {
  try {
    console.log('Starting syllabus parsing...');

    // Define paths to PDF files
    const resourcesDir = path.join(__dirname, '..', 'resources', 'curriculum');
    const pdfFiles = {
      computerScience: path.join(resourcesDir, 'computer-science', '697287-2026-2028-syllabus.pdf'),
      pakistanStudies: path.join(resourcesDir, 'pakistan-studies', '697282-2026-syllabus.pdf'),
      economics: path.join(resourcesDir, 'economics', '718206-2027-2029-syllabus.pdf')
    };

    // Read and parse each PDF
    console.log('Reading Pakistan Studies syllabus...');
    const pakStudiesData = await readPDF(pdfFiles.pakistanStudies);
    const pakStudiesCurriculum = await parsePakistanStudies(pakStudiesData);
    console.log(`Found ${pakStudiesCurriculum.topics.length} topics in Pakistan Studies`);

    console.log('Reading Computer Science syllabus...');
    const csData = await readPDF(pdfFiles.computerScience);
    const csCurriculum = await parseComputerScience(csData);
    console.log(`Found ${csCurriculum.topics.length} topics in Computer Science`);

    console.log('Reading Economics syllabus...');
    const econData = await readPDF(pdfFiles.economics);
    const econCurriculum = await parseEconomics(econData);
    console.log(`Found ${econCurriculum.topics.length} topics in Economics`);

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing curricula
    await Curriculum.deleteMany({
      gradeLevel: 'O-Level',
      subject: { $in: ['Computer-Science', 'Pakistan-Studies', 'Economics'] }
    });
    console.log('Cleared existing curricula');

    // Save parsed curricula
    const savedCurricula = await Promise.all([
      new Curriculum(pakStudiesCurriculum).save(),
      new Curriculum(csCurriculum).save(),
      new Curriculum(econCurriculum).save()
    ]);

    console.log('\nCurricula saved to database with the following structure:');
    savedCurricula.forEach(curr => {
      console.log(`\n${curr.subject}:`);
      curr.topics.forEach(topic => {
        console.log(`\nTopic: ${topic.name}`);
        topic.subtopics.forEach(subtopic => {
          console.log(`  Subtopic: ${subtopic.name}`);
          console.log(`    Learning Objectives: ${subtopic.learningObjectives.length}`);
        });
      });
    });

    console.log('\nSyllabus parsing and saving completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error parsing syllabus:', error);
    process.exit(1);
  }
}

// Run the parser
parseSyllabus();
