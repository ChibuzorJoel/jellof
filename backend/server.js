const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✓ MongoDB Connected'))
  .catch(err => console.log('✗ MongoDB Error:', err.message));
} else {
  console.log('⚠ MongoDB not configured - using in-memory storage');
}

// Import Routes
const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');
const productsRoutes = require('./routes/products');
const collectionsRoutes = require('./routes/collections');
const lookbookRoutes = require('./routes/lookbook');
const ordersRoutes = require('./routes/orders');

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/lookbook', lookbookRoutes);
app.use('/api/orders', ordersRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'JELLOF API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    email: process.env.EMAIL_USER ? 'Configured' : 'Not configured'
  });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to JELLOF API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      contact: '/api/contact',
      newsletter: '/api/newsletter',
      products: '/api/products',
      collections: '/api/collections',
      lookbook: '/api/lookbook',
      orders: '/api/orders'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🌿 JELLOF API Server Running 🌿     ║
╠════════════════════════════════════════╣
║  Port: ${PORT.toString().padEnd(33)}║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(26)}║
║  MongoDB: ${(mongoose.connection.readyState === 1 ? 'Connected' : 'Not configured').padEnd(30)}║
║  Email: ${(process.env.EMAIL_USER ? 'Configured' : 'Not configured').padEnd(32)}║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;