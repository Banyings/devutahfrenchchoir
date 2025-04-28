// server.js
const express = require('express');
const app = express();
const PORT = 4003;

// Middleware to parse JSON
app.use(express.json());

// AdminPage
app.get('/', (req, res) => {
  res.send('Welcome to Book Us Page!');
});

// Sample POST route
app.post('/data', (req, res) => {
  console.log(req.body); // log the sent data
  res.json({ message: 'Data received', yourData: req.body });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});