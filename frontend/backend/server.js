require('dotenv').config();


const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Add debug logging to check environment variables
console.log('Environment check:');
console.log('- SUPABASE_URL set:', !!supabaseUrl);
console.log('- SUPABASE_SERVICE_ROLE_KEY set:', !!supabaseServiceKey);

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing required Supabase environment variables');
  console.error('Please make sure your .env file is set up correctly with:');
  console.error('- SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enable CORS for all routes
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Parse JSON request bodies
app.use(express.json());

// Basic GET
app.get('/', (req, res) => {
  res.send('Welcome to Home Page!');
});

// Newsletter subscription endpoint (Create)
app.post('/data', async (req, res) => {
  const { email } = req.body;
  console.log('Received subscription email:', email);

  if (!email || !email.endsWith('@gmail.com')) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  

  try {
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email }])
      .select();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'This email is already subscribed' });
      }
      throw error;
    }

    return res.status(200).json({ message: 'Subscribed successfully', data });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Update subscription email (PUT)
app.put('/data', async (req, res) => {
  const { oldEmail, newEmail } = req.body;
  console.log(`Updating subscription from ${oldEmail} to ${newEmail}`);

  if (!oldEmail || !newEmail || !newEmail.includes('@gmail.com')) {
    return res.status(400).json({ error: 'Invalid email data' });
  }

  try {
    // First check if the old email exists
    const { data: existingData, error: existingError } = await supabase
      .from('subscribers')
      .select()
      .eq('email', oldEmail)
      .single();

    if (existingError || !existingData) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Update the email
    const { data, error } = await supabase
      .from('subscribers')
      .update({ email: newEmail })
      .eq('email', oldEmail)
      .select();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'New email is already subscribed' });
      }
      throw error;
    }

    return res.status(200).json({ message: 'Email updated successfully', data });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Delete subscription email (DELETE)
app.delete('/data', async (req, res) => {
  const { email } = req.body;
  console.log(`Deleting subscription for email: ${email}`);

  if (!email) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const { data, error } = await supabase
      .from('subscribers')
      .delete()
      .eq('email', email)
      .select();

    if (error) throw error;

    if (data && data.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    return res.status(200).json({ message: 'Email deleted successfully', data });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get all subscribers (GET)
app.get('/data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});