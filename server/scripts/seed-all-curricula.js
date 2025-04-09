const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Curriculum = require('../models/Curriculum');

async function seedAllCurricula() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully');

        // Clear all existing curricula
        console.log('Clearing existing curricula...');
        await Curriculum.deleteMany({});
        console.log('Cleared all existing curricula');

        // List of curriculum files to process
        const curriculumFiles = [
            'economics-curriculum.json',
            'computer-science-curriculum.json',
            'pakistan-studies-history-curriculum.json',
            'pakistan-studies-geography-curriculum.json'
        ];

        // Process each curriculum file
        for (const file of curriculumFiles) {
            console.log(`\nProcessing ${file}...`);
            
            try {
                // Read the curriculum data
                const data = JSON.parse(
                    await fs.readFile(
                        path.join(__dirname, '..', 'data', file),
                        'utf-8'
                    )
                );

                // Create the curriculum
                const curriculum = await Curriculum.create(data);
                
                // Log curriculum statistics
                console.log(`Added ${curriculum.subject} curriculum successfully`);
                console.log('Statistics:');
                console.log('- Topics:', curriculum.topics.length);
                console.log('- Total Subtopics:', curriculum.topics.reduce((acc, topic) => acc + topic.subtopics.length, 0));
                console.log('- Total Learning Objectives:', curriculum.topics.reduce((acc, topic) => 
                    acc + topic.subtopics.reduce((subacc, subtopic) => 
                        subacc + subtopic.learningObjectives.length, 0), 0));
            } catch (error) {
                console.error(`Error processing ${file}:`, error.message);
            }
        }

        // Verify the seeded data
        const seededCurricula = await Curriculum.find({}).lean();
        console.log('\nSeeded Curricula:');
        seededCurricula.forEach(curr => {
            console.log(`- ${curr.gradeLevel} ${curr.subject}`);
        });

        console.log('\nSeeding completed successfully!');
    } catch (error) {
        console.error('Error in seed script:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
}

// Run the seeding function
seedAllCurricula();
