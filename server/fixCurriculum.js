require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('./models/Curriculum');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      // Find all documents
      const docs = await Curriculum.find({}).lean();
      console.log('\nFound documents:', docs.length);
      
      // Print each document's subject
      docs.forEach(doc => {
        console.log('\nDocument:', doc._id.toString());
        console.log('Grade:', doc.gradeLevel);
        console.log('Subject:', doc.subject);
        console.log('Topics:', doc.topics ? doc.topics.length : 0);
      });
      
      // Update the documents with correct subjects
      await Curriculum.updateMany(
        { subject: 'History' },
        { $set: { subject: 'Pakistan Studies - History' } }
      );
      
      await Curriculum.updateMany(
        { subject: 'Geography' },
        { $set: { subject: 'Pakistan Studies - Geography' } }
      );
      
      console.log('\nDocuments updated');
      
      // Verify the updates
      const updatedDocs = await Curriculum.find({}).lean();
      console.log('\nVerifying updates:');
      updatedDocs.forEach(doc => {
        console.log(`${doc.subject}: ${doc.topics ? doc.topics.length : 0} topics`);
      });
      
    } catch (error) {
      console.error('Error:', error);
    }
    process.exit();
  });
