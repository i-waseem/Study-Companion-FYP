const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');

describe('MongoDB Tests', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('Create & Retrieve User', async () => {
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword123'
    });
    await testUser.save();

    const foundUser = await User.findOne({ email: 'test@example.com' });
    expect(foundUser.username).toBe('testuser');
  });

  test('Update User', async () => {
    const user = new User({
      username: 'oldname',
      email: 'test@example.com',
      password: 'hashedpassword123'
    });
    await user.save();

    await User.updateOne(
      { email: 'test@example.com' },
      { username: 'newname' }
    );

    const updatedUser = await User.findOne({ email: 'test@example.com' });
    expect(updatedUser.username).toBe('newname');
  });
});
