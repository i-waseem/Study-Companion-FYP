require('dotenv').config();

test('Simple test', () => {
  expect(true).toBe(true);
});

test('Environment variables are loaded', () => {
  expect(process.env.GEMINI_API_KEY).toBeDefined();
  expect(process.env.MONGODB_URI).toBeDefined();
});

test('Math operations work', () => {
  expect(2 + 2).toBe(4);
  expect(10 * 2).toBe(20);
  expect(15 - 5).toBe(10);
});
