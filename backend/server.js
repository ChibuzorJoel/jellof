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

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:4200',
  'https://jellof-clothingzz.netlify.app',
  'https://jellof-1.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean); // Removes any undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('❌ CORS blocked origin:', origin);
        callback(null, false); // Block but don't throw error
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  next();
});

/* =========================
   DATABASE CONNECTION
========================= */
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb+srv://jellofFashion:Jellof54@cluster0.arplt.mongodb.net/jellofashion?retryWrites=true&w=majority&appName=Cluster0',
      {
        autoIndex: true,
      }
    );
    console.log('═══════════════════════════════════════');
    console.log('✅ MongoDB connected successfully');
    console.log('📦 Database:', mongoose.connection.name);
    console.log('═══════════════════════════════════════');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

/* =========================
   TEST ENDPOINT (REQUIRED FOR ADMIN PANEL)
========================= */
app.get('/api/test', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  
  res.json({
    success: true,
    message: '✅ Backend API is working!',
    database: dbStatus,
    databaseName: mongoose.connection.name,
    timestamp: new Date().toISOString()
  });
});

/* =========================
   ROUTES
========================= */
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories.routes');
const orderRoutes = require('./routes/orders');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes = require('./routes/contact');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);

console.log('\n📋 Routes registered:');
console.log('✅ /api/auth');
console.log('✅ /api/products');
console.log('✅ /api/categories');
console.log('✅ /api/orders');
console.log('✅ /api/newsletter');
console.log('✅ /api/contact');
console.log('✅ /api/test\n');

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
      categories: '/api/categories',
      orders: '/api/orders',
      newsletter: '/api/newsletter',
      contact: '/api/contact',
      test: '/api/test'
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
    availableEndpoints: [
      '/api/test',
      '/api/auth',
      '/api/products',
      '/api/categories',
      '/api/orders',
      '/api/newsletter',
      '/api/contact'
    ]
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log('🚀 JELLOF FASHION BACKEND SERVER');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:4200'}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
  console.log('═══════════════════════════════════════\n');
  console.log('✅ CORS enabled for origins:', allowedOrigins);
});

module.exports = app;