
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
// basic GET
app.get('/', (req, res) => {
    res.send('Welcome to Home Page!');
  });

// Parse JSON request bodies
app.use(express.json());

// Newsletter subscription endpoint
app.post('/data', (req, res) => {
  const { email } = req.body;
  console.log('Received subscription email:', email);

  // Basic email validation
  if (!email || !email.includes('@gmail.com')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // I need to connect this withe database to save the date here
  // This is just a simulation
  try {
    // Simulated successful database operation
    return res.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});