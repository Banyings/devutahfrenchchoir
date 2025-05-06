const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 4003;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(bodyParser.json());

// Endpoints
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is healthy' });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, phone, email, message } = req.body;
    
    // Validation
    if (!fullName || !phone || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }
    
    // Phone validation - basic format check
    const phoneRegex = /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number (format: 123-456-7890)'
      });
    }
    
    // Instead of storing in Supabase, we'll just log the form data
    console.log('Form submission received:', { fullName, phone, email, message });
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Thanks for reaching out! We will shortly be in touch with you.'
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});