const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Curriculum = require('../models/Curriculum');

async function seedPakistanStudiesCurriculum() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully');

        // Read both curriculum JSON files
        const historyData = JSON.parse(
            await fs.readFile(
                path.join(__dirname, '..', 'data', 'pakistan-studies-history-curriculum.json'),
                'utf-8'
            )
        );

        const geographyData = JSON.parse(
            await fs.readFile(
                path.join(__dirname, '..', 'data', 'pakistan-studies-geography-curriculum.json'),
                'utf-8'
            )
        );

        // Update History curriculum
        const existingHistory = await Curriculum.findOne({
            gradeLevel: historyData.gradeLevel,
            subject: historyData.subject
        });

        if (existingHistory) {
            console.log('Pakistan Studies - History curriculum already exists. Updating...');
            await Curriculum.findByIdAndUpdate(existingHistory._id, historyData);
            console.log('History curriculum updated successfully');
        } else {
            console.log('Adding new Pakistan Studies - History curriculum...');
            await Curriculum.create(historyData);
            console.log('History curriculum added successfully');
        }

        // Update Geography curriculum
        const existingGeography = await Curriculum.findOne({
            gradeLevel: geographyData.gradeLevel,
            subject: geographyData.subject
        });

        if (existingGeography) {
            console.log('Pakistan Studies - Geography curriculum already exists. Updating...');
            await Curriculum.findByIdAndUpdate(existingGeography._id, geographyData);
            console.log('Geography curriculum updated successfully');
        } else {
            console.log('Adding new Pakistan Studies - Geography curriculum...');
            await Curriculum.create(geographyData);
            console.log('Geography curriculum added successfully');
        }

        // Log curriculum statistics
        const historyCurriculum = await Curriculum.findOne({
            gradeLevel: historyData.gradeLevel,
            subject: historyData.subject
        });

        const geographyCurriculum = await Curriculum.findOne({
            gradeLevel: geographyData.gradeLevel,
            subject: geographyData.subject
        });

        console.log('\nHistory Curriculum Statistics:');
        console.log('Topics:', historyCurriculum.topics.length);
        console.log('Subtopics:', historyCurriculum.topics.reduce((acc, topic) => acc + topic.subtopics.length, 0));
        console.log('Learning Objectives:', historyCurriculum.topics.reduce((acc, topic) => 
            acc + topic.subtopics.reduce((subacc, subtopic) => 
                subacc + subtopic.learningObjectives.length, 0), 0));

        console.log('\nGeography Curriculum Statistics:');
        console.log('Topics:', geographyCurriculum.topics.length);
        console.log('Subtopics:', geographyCurriculum.topics.reduce((acc, topic) => acc + topic.subtopics.length, 0));
        console.log('Learning Objectives:', geographyCurriculum.topics.reduce((acc, topic) => 
            acc + topic.subtopics.reduce((subacc, subtopic) => 
                subacc + subtopic.learningObjectives.length, 0), 0));

    } catch (error) {
        console.error('Error seeding Pakistan Studies curriculum:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the seeding function
seedPakistanStudiesCurriculum();
