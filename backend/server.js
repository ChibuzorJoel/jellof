const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  })
);

/* =========================
   DATABASE CONNECTION
========================= */
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jellof-clothing',
      {
        autoIndex: true,
      }
    );

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

/* =========================
   ROUTES
========================= */
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes = require('./routes/contact');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy 🚀',
    time: new Date().toISOString(),
  });
});

/* =========================
   ROOT
========================= */
app.get('/', (req, res) => {
  res.json({
    success: true,
    app: 'JELLOF Clothing API',
    version: '1.0.0',
    routes: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      newsletter: '/api/newsletter',
      contact: '/api/contact',
    },
  });
});

/* =========================
   ERROR HANDLING
========================= */
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:4200'}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
});

module.exports = app;