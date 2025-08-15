const express = require('express');
const { createClient } = require('@vercel/kv');
const app = express();

// ADD THIS LINE
app.use(express.json()); // Middleware to parse JSON bodies

// Create a Vercel KV client
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Serve static files from the `public` directory (or root)
// NOTE: Vercel handles this automatically, but this line is good practice.
app.use(express.static('public'));

// API Endpoint: GET the current count from Vercel KV
app.get('/api/count', async (req, res) => {
  try {
    const totalApes = await kv.get('totalApes');
    res.json({ totalApes: totalApes || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not retrieve count.' });
  }
});

// API Endpoint: POST to increment the count
app.post('/api/increment', async (req, res) => {
  try {
    const newCount = await kv.incr('totalApes');
    res.json({ totalApes: newCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not increment count.' });
  }
});

// API Endpoint: POST for the banana bonus
app.post('/api/add-bonus', async (req, res) => {
  try {
    const newCount = await kv.incrby('totalApes', 5);
    res.json({ totalApes: newCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not add bonus.' });
  }
});

// Remove the app.listen part and export the app
module.exports = app;