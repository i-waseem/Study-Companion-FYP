const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('API Endpoints', () => {
  let authToken;

  beforeAll(async () => {
    // Register a test user
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    // Login to get token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = response.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET /api/curriculum/subjects', async () => {
    const response = await request(app)
      .get('/api/curriculum/subjects')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/quiz/generate', async () => {
    const response = await request(app)
      .post('/api/quiz/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        subject: 'Mathematics',
        topic: 'Algebra',
        difficulty: 'medium'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('questions');
  });

  test('GET /api/user/profile', async () => {
    const response = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });
});
