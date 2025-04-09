require('dotenv').config();
const { MongoClient } = require('mongodb');

async function resetDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Get database name from connection string
    const dbName = process.env.MONGODB_URI.split('/').pop().split('?')[0];
    console.log('Using database:', dbName || 'test');

    const db = client.db(dbName || 'test');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));

    // Drop users collection if it exists
    if (collections.some(c => c.name === 'users')) {
      await db.collection('users').drop();
      console.log('Users collection dropped');
    }

    // Create users collection with proper indexes
    const users = db.collection('users');
    await users.createIndex({ email: 1 }, { unique: true });
    await users.createIndex({ username: 1 }, { unique: true });
    console.log('Created users collection with indexes');

    console.log('Database reset complete');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

resetDatabase();
