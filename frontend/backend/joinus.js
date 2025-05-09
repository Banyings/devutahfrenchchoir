//Join-us server
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = 4005;

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads directory created');
}

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST'],
  credentials: true
}));

app.use(bodyParser.json());

// Multer config: only allow jpeg/jpg/png images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = function (req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, or PNG images are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Route to handle form submission
app.post('/api/apply', upload.single('picture'), (req, res) => {
  const {
    fullName, email, phone, date,
    country, state, address, zip_code, interest
  } = req.body;

  const picture = req.file;

  // Check if all required fields are present, including the picture
  if (!fullName || !email || !phone || !date || !picture) {
    return res.status(400).json({ 
      success: false, 
      message: !picture ? 'Picture is required' : 'Required fields missing' 
    });
  }

  console.log('Application received:', {
    fullName,
    email,
    phone,
    date,
    country,
    state,
    address,
    zip_code,
    interest,
    picture: picture.filename
  });

  res.status(200).json({
    success: true,
    message: 'Application submitted successfully',
    pictureUrl: `/uploads/${picture.filename}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, message: err.message });
});

// Add route for temporary image upload for preview
app.post('/api/upload-preview', upload.single('picture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    pictureUrl: `/uploads/${req.file.filename}`
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Upload directory: ${uploadDir}`);
});