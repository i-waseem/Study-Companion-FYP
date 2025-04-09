const axios = require('axios');

async function run() {
  const API_KEY = 'AIzaSyBwTluGdy2--DsNNLwa705LFv2f5au4bLs';
  const MODEL = 'models/gemini-2.0-flash';
  const API_URL = `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent?key=${API_KEY}`;

  try {
    console.log('Sending request to Gemini...');
    const response = await axios.post(API_URL, {
      contents: [{
        parts: [{
          text: 'Write "hello world"'
        }]
      }]
    });

    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

run();
