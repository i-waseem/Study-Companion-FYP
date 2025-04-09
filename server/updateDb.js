require('dotenv').config();
const mongoose = require('mongoose');
const Curriculum = require('./models/Curriculum');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      // Get all curricula
      const curricula = await Curriculum.find({}).lean();
      
      // Update each curriculum document
      for (const curr of curricula) {
        const subject = curr.subject;
        
        // Map old subjects to new format
        let newSubject = subject;
        if (subject === 'History') {
          newSubject = 'Pakistan Studies - History';
        } else if (subject === 'Geography') {
          newSubject = 'Pakistan Studies - Geography';
        }
        
        // Update the document
        await Curriculum.findByIdAndUpdate(curr._id, {
          $set: { subject: newSubject }
        });
        
        console.log(`Updated ${subject} to ${newSubject}`);
      }
      
      console.log('All documents updated successfully');
    } catch (error) {
      console.error('Error:', error);
    }
    process.exit();
  });
