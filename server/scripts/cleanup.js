require('dotenv').config();
const { MongoClient } = require('mongodb');

async function cleanup() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const users = db.collection('users');

    // Delete specific test users
    const result = await users.deleteMany({
      email: { 
        $in: [
          'iwaseem@bradford.ac.uk',
          'iqrawaseem1995@gmail.com'
        ]
      }
    });

    console.log(`Deleted ${result.deletedCount} test users`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

cleanup();
