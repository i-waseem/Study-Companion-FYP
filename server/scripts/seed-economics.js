const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Curriculum = require('../models/Curriculum');

async function seedEconomicsCurriculum() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully');

        // Read the economics curriculum JSON file
        const economicsData = JSON.parse(
            await fs.readFile(
                path.join(__dirname, '..', 'data', 'economics-curriculum.json'),
                'utf-8'
            )
        );

        // Check if curriculum already exists
        const existingCurriculum = await Curriculum.findOne({
            gradeLevel: economicsData.gradeLevel,
            subject: economicsData.subject
        });

        if (existingCurriculum) {
            console.log('Economics curriculum already exists. Updating...');
            await Curriculum.findByIdAndUpdate(existingCurriculum._id, economicsData);
            console.log('Economics curriculum updated successfully');
        } else {
            console.log('Adding new Economics curriculum...');
            await Curriculum.create(economicsData);
            console.log('Economics curriculum added successfully');
        }

        // Log curriculum statistics
        const curriculum = await Curriculum.findOne({
            gradeLevel: economicsData.gradeLevel,
            subject: economicsData.subject
        });

        console.log('\nCurriculum Statistics:');
        console.log('Topics:', curriculum.topics.length);
        console.log('Subtopics:', curriculum.topics.reduce((acc, topic) => acc + topic.subtopics.length, 0));
        console.log('Learning Objectives:', curriculum.topics.reduce((acc, topic) => 
            acc + topic.subtopics.reduce((subacc, subtopic) => 
                subacc + subtopic.learningObjectives.length, 0), 0));

    } catch (error) {
        console.error('Error seeding economics curriculum:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the seeding function
seedEconomicsCurriculum();
