const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 4004;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(bodyParser.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Donation server is healthy' });
});

// Process credit/debit card donations
app.post('/api/donate/card', async (req, res) => {
  try {
    const {
      amount,
      donationType,
      cardDetails
    } = req.body;

    // Validate required fields
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid donation amount is required'
      });
    }

    if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
      return res.status(400).json({
        success: false,
        message: 'All card details are required'
      });
    }

    // Validate card number (basic check)
    const cardNumberNoSpaces = cardDetails.cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(cardNumberNoSpaces)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card number'
      });
    }

    // Validate expiry date format
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expiry date format (must be MM/YY)'
      });
    }

    // Validate CVV
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid CVV'
      });
    }

    // In a real application, you would:
    // 1. Connect to a payment processor (Stripe, PayPal, etc.)
    // 2. Process the payment
    // 3. Save transaction to database if successful

    // For demo purposes, let's simulate a payment process
    console.log('Processing card payment:', {
      amount,
      donationType,
      cardLastFour: cardNumberNoSpaces.slice(-4),
      cardHolder: cardDetails.cardHolder
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return success response
    res.status(200).json({
      success: true,
      transactionId: `CARD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      message: `Your ${donationType} donation of $${amount} has been successfully processed. Thank you for your support!`
    });
  } catch (error) {
    console.error('Error processing card donation:', error);
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later.'
    });
  }
});

// Generate payment link for third-party services (Venmo, CashApp)
app.post('/api/donate/thirdparty', async (req, res) => {
  try {
    const { amount, donationType, service } = req.body;
    
    // Validate required fields
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid donation amount is required'
      });
    }
    
    if (!service || !['venmo', 'cashapp'].includes(service.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment service is required'
      });
    }
    
    // In a real application, you would:
    // 1. Generate a unique payment request link/ID for the selected service
    // 2. Store pending transaction info for later verification
    
    console.log(`Processing ${service} donation request:`, {
      amount,
      donationType,
      service
    });
    
    // Simulate backend processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate fake redirect URL based on service
    const serviceUrl = service.toLowerCase() === 'venmo' 
      ? 'https://venmo.com/code?user_id=YourChurchID'
      : 'https://cash.app/$YourChurchID';
    
    res.status(200).json({
      success: true,
      redirectUrl: `${serviceUrl}?amount=${amount}&note=Choir%20${donationType}%20Donation`,
      message: `You'll be redirected to ${service} to complete your ${donationType} donation of $${amount}.`
    });
  } catch (error) {
    console.error(`Error processing ${req.body.service} donation:`, error);
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later.'
    });
  }
});

// Get donation statistics (for admin dashboard)
app.get('/api/donate/stats', (req, res) => {
  // In a real application, you would fetch this from your database
  // For now, return mock statistics
  res.status(200).json({
    totalDonations: 1247,
    monthlyDonations: 127,
    totalAmount: 15843.50,
    monthlyAmount: 2150.75,
    recentDonations: [
      { id: 'CARD-1683921', amount: 50, type: 'one-time', date: '2025-05-03T14:22:10Z' },
      { id: 'VENMO-1683815', amount: 20, type: 'monthly', date: '2025-05-02T09:15:43Z' },
      { id: 'CARD-1683742', amount: 100, type: 'one-time', date: '2025-05-01T16:30:22Z' }
    ]
  });
});

// Webhook for handling third-party payment confirmations
app.post('/api/webhooks/donation', (req, res) => {
  // This endpoint would be called by Venmo/CashApp to confirm payment
  // You would verify the webhook signature, etc.
  
  console.log('Received donation webhook:', req.body);
  
  // In production you would validate this data and update your database
  
  res.status(200).json({ received: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Donation server running on port ${PORT}`);
});