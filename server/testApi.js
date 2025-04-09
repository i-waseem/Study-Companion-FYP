require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Curriculum = require('./models/Curriculum');

// Create a test token (for testing only)
const jwt = require('jsonwebtoken');
const testToken = jwt.sign({ id: 'test' }, process.env.JWT_SECRET);

const app = express();

// Add curriculum routes
const curriculumRoutes = require('./routes/curriculum');
app.use('/api/curriculum', curriculumRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    const server = app.listen(5001, async () => {
      console.log('Test server running on port 5001');
      
      try {
        // Test the subjects endpoint
        console.log('\nTesting /subjects endpoint...');
        console.log('Using token:', testToken);
        
        const response = await fetch('http://localhost:5001/api/curriculum/subjects', {
          headers: {
            'Authorization': `Bearer ${testToken}`
          }
        });
        
        const data = await response.json();
        console.log('\nResponse:', JSON.stringify(data, null, 2));
        
        // Test the curriculum endpoint for each subject
        for (const subject of data) {
          console.log(`\nTesting /o-level/${subject.urlFriendlySubject} endpoint...`);
          const currResponse = await fetch(`http://localhost:5001/api/curriculum/o-level/${subject.urlFriendlySubject}`, {
            headers: {
              'Authorization': `Bearer ${testToken}`
            }
          });
          
          const currData = await currResponse.json();
          console.log('Status:', currResponse.status);
          if (!currResponse.ok) {
            console.log('Error:', currData);
          } else {
            console.log('Topics:', currData.topics.map(t => t.name));
          }
        }
      } catch (error) {
        console.error('Test error:', error);
      }
      
      // Close everything
      server.close();
      mongoose.connection.close();
      process.exit();
    });
  });
