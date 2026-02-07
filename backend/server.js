const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/* ======================
   ENV DEBUG (IMPORTANT)
====================== */
console.log('ENV CHECK → MONGODB_URI:', process.env.MONGODB_URI);

/* ======================
   APP SETUP
====================== */
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

/* ======================
   MONGODB CONNECTION
====================== */
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing in .env');
} else {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('✓ MongoDB Connected'))
    .catch(err => {
      console.error('✗ MongoDB Connection Error:', err.message);
      process.exit(1);
    });
}

/* ======================
   ROUTES
====================== */
const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');
const productsRoutes = require('./routes/products');
const collectionsRoutes = require('./routes/collections');
const lookbookRoutes = require('./routes/lookbook');
const ordersRoutes = require('./routes/orders');

app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/lookbook', lookbookRoutes);
app.use('/api/orders', ordersRoutes);

/* ======================
   HEALTH CHECK
====================== */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'JELLOF API is running',
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1
        ? 'Connected'
        : 'Disconnected',
    env: process.env.NODE_ENV || 'development'
  });
});

/* ======================
   ROOT
====================== */
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to JELLOF API',
    endpoints: {
      health: '/api/health',
      products: '/api/products'
    }
  });
});

/* ======================
   ERRORS
====================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

/* ======================
   START SERVER
====================== */
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🌿 JELLOF API Server Running 🌿     ║
╠════════════════════════════════════════╣
║  Port: ${PORT.toString().padEnd(33)}║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(26)}║
║  MongoDB: ${(mongoose.connection.readyState === 1 ? 'Connected' : 'Not configured').padEnd(30)}║
╚════════════════════════════════════════╝
`);
});

module.exports = app;
