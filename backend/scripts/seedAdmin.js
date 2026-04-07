const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const Contact = require('../models/Contact');
const Order = require('../models/Order');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jellof');

// Demo Admin User
const adminUser = {
  firstName: 'Super',
  lastName: 'Admin',
  email: 'admin@jellof.com',
  password: 'Admin@124', // Will be hashed automatically
  role: 'admin',
  isActive: true
};

// Demo Products with valid MongoDB ObjectIds
const products = [
  {
    name: 'Summer Floral Dress',
    slug: 'summer-floral-dress',
    category: 'Dresses',
    price: 89.99,
    salePrice: 69.99,
    description: 'Beautiful floral print dress perfect for summer occasions. Made with premium breathable fabric.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80'
    ],
    tags: ['new', 'summer', 'floral'],
    colors: ['Red', 'Blue', 'Pink'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 50,
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 12
  },
  {
    name: 'Classic White T-Shirt',
    slug: 'classic-white-tshirt',
    category: 'Tops',
    price: 29.99,
    description: 'Essential white t-shirt made from 100% premium cotton. Perfect for everyday wear.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'
    ],
    tags: ['essential', 'basic'],
    colors: ['White', 'Black', 'Grey'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 100,
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 28
  },
  {
    name: 'Denim Jeans',
    slug: 'denim-jeans',
    category: 'Bottoms',
    price: 79.99,
    salePrice: 59.99,
    description: 'Classic blue denim jeans with perfect fit. Comfortable and durable for all-day wear.',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'
    ],
    tags: ['sale', 'denim'],
    colors: ['Blue', 'Black', 'Light Blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 75,
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 34
  },
  {
    name: 'Leather Jacket',
    slug: 'leather-jacket',
    category: 'Outerwear',
    price: 199.99,
    description: 'Premium genuine leather jacket for stylish outings. Classic design with modern fit.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'
    ],
    tags: ['new', 'premium', 'leather'],
    colors: ['Black', 'Brown'],
    sizes: ['M', 'L', 'XL'],
    stock: 25,
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 19
  },
  {
    name: 'Running Shoes',
    slug: 'running-shoes',
    category: 'Shoes',
    price: 129.99,
    description: 'Comfortable running shoes with excellent support. Perfect for workouts and daily activities.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
    ],
    tags: ['sport', 'comfort'],
    colors: ['White', 'Black', 'Red', 'Blue'],
    sizes: ['7', '8', '9', '10', '11'],
    stock: 60,
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 45
  },
  {
    name: 'Designer Handbag',
    slug: 'designer-handbag',
    category: 'Accessories',
    price: 299.99,
    description: 'Elegant designer handbag with premium materials. Perfect for any occasion.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500'
    ],
    tags: ['new', 'luxury', 'designer'],
    colors: ['Black', 'Brown', 'Beige'],
    sizes: ['One Size'],
    stock: 30,
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 22
  },
  {
    name: 'Silk Scarf',
    slug: 'silk-scarf',
    category: 'Accessories',
    price: 49.99,
    salePrice: 39.99,
    description: 'Luxurious silk scarf with beautiful patterns. Adds elegance to any outfit.',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500'
    ],
    tags: ['sale', 'silk', 'elegant'],
    colors: ['Red', 'Blue', 'Gold', 'Green'],
    sizes: ['One Size'],
    stock: 45,
    inStock: true,
    featured: false,
    rating: 4.3,
    reviews: 16
  },
  {
    name: 'Wool Coat',
    slug: 'wool-coat',
    category: 'Outerwear',
    price: 249.99,
    description: 'Warm wool coat for cold weather. Classic style with premium quality.',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500'
    ],
    tags: ['winter', 'warm', 'wool'],
    colors: ['Grey', 'Black', 'Camel'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 11
  }
];

// Demo Customers
const customers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    orders: [],
    wishlist: [],
    cart: [],
    totalSpent: 499.95,
    orderCount: 5,
    isVerified: true,
    status: 'active'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    orders: [],
    wishlist: [],
    cart: [],
    totalSpent: 299.97,
    orderCount: 3,
    isVerified: true,
    status: 'active'
  },
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@example.com',
    phone: '+1234567892',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    orders: [],
    wishlist: [],
    cart: [],
    totalSpent: 899.92,
    orderCount: 8,
    isVerified: true,
    status: 'active'
  },
  {
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah@example.com',
    phone: '+1234567893',
    address: {
      street: '321 Elm St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA'
    },
    orders: [],
    wishlist: [],
    cart: [],
    totalSpent: 199.98,
    orderCount: 2,
    isVerified: true,
    status: 'active'
  },
  {
    firstName: 'David',
    lastName: 'Brown',
    email: 'david@example.com',
    phone: '+1234567894',
    address: {
      street: '654 Maple Dr',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA'
    },
    orders: [],
    wishlist: [],
    cart: [],
    totalSpent: 0,
    orderCount: 0,
    isVerified: false,
    status: 'blocked'
  },
  {
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily@example.com',
    phone: '+1234567895',
    address: {
      street: '987 Cedar Ln',
      city: 'Philadelphia',
      state: 'PA',
      zipCode: '19101',
      country: 'USA'
    },
    orders: [],
    wishlist: [],
    cart: [],
    totalSpent: 1299.88,
    orderCount: 12,
    isVerified: true,
    status: 'active'
  }
];

// Demo Payments
const payments = [
  {
    orderId: 'ORD-' + Date.now() + '-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    amount: 89.99,
    paymentMethod: 'card',
    transactionId: 'TXN-' + Date.now() + '-001',
    status: 'pending',
    paymentDate: new Date()
  },
  {
    orderId: 'ORD-' + Date.now() + '-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    amount: 129.99,
    paymentMethod: 'paypal',
    transactionId: 'TXN-' + Date.now() + '-002',
    status: 'approved',
    paymentDate: new Date(Date.now() - 86400000)
  },
  {
    orderId: 'ORD-' + Date.now() + '-003',
    customerName: 'Mike Johnson',
    customerEmail: 'mike@example.com',
    amount: 299.99,
    paymentMethod: 'card',
    transactionId: 'TXN-' + Date.now() + '-003',
    status: 'completed',
    paymentDate: new Date(Date.now() - 172800000)
  },
  {
    orderId: 'ORD-' + Date.now() + '-004',
    customerName: 'Sarah Williams',
    customerEmail: 'sarah@example.com',
    amount: 199.99,
    paymentMethod: 'bank',
    transactionId: 'TXN-' + Date.now() + '-004',
    status: 'pending',
    paymentDate: new Date()
  },
  {
    orderId: 'ORD-' + Date.now() + '-005',
    customerName: 'Emily Davis',
    customerEmail: 'emily@example.com',
    amount: 79.99,
    paymentMethod: 'card',
    transactionId: 'TXN-' + Date.now() + '-005',
    status: 'rejected',
    paymentDate: new Date(Date.now() - 259200000)
  }
];

// Demo Contacts
const contacts = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1234567896',
    subject: 'Product Inquiry',
    message: 'I would like to know more about the summer collection and available sizes. Do you offer international shipping?',
    status: 'new',
    createdAt: new Date()
  },
  {
    name: 'Tom Wilson',
    email: 'tom.w@example.com',
    phone: '+1234567897',
    subject: 'Order Status',
    message: 'Can you please check the status of my order #ORD-123? It has been 5 days and I have not received any update.',
    status: 'read',
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.a@example.com',
    phone: '+1234567898',
    subject: 'Return Request',
    message: 'I would like to return the product I ordered last week. The size does not fit well.',
    status: 'replied',
    reply: 'Thank you for contacting us. We have processed your return request. Please check your email for the return shipping label.',
    repliedAt: new Date(Date.now() - 43200000),
    createdAt: new Date(Date.now() - 172800000)
  },
  {
    name: 'Robert Taylor',
    email: 'robert.t@example.com',
    phone: '+1234567899',
    subject: 'Shipping Question',
    message: 'How long does shipping usually take for international orders to Canada?',
    status: 'new',
    createdAt: new Date()
  }
];

// Seed function
async function seedAllData() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Delete existing data
    console.log('🗑️  Deleting existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Payment.deleteMany({});
    await Contact.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Existing data deleted\n');

    // Create admin user
    console.log('👤 Creating admin user...');
    await User.deleteOne({ email: 'admin@jellof.com' });
    const admin = new User(adminUser);
    await admin.save();
    console.log('✅ Admin user created');

    // Create products
    console.log('📦 Creating products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products created`);

    // Create customers
    console.log('👥 Creating customers...');
    const createdCustomers = await Customer.insertMany(customers);
    console.log(`✅ ${createdCustomers.length} customers created`);

    // Create payments
    console.log('💰 Creating payments...');
    const createdPayments = await Payment.insertMany(payments);
    console.log(`✅ ${createdPayments.length} payments created`);

    // Create contacts
    console.log('📧 Creating contact messages...');
    const createdContacts = await Contact.insertMany(contacts);
    console.log(`✅ ${createdContacts.length} contact messages created\n`);

    // Summary
    console.log('╔════════════════════════════════════════╗');
    console.log('║   ✅ DATABASE SEEDED SUCCESSFULLY!   ║');
    console.log('╠════════════════════════════════════════╣');
    console.log('║   📊 SUMMARY                          ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║   👤 Admin Users:      ${String(1).padEnd(15)}║`);
    console.log(`║   📦 Products:         ${String(createdProducts.length).padEnd(15)}║`);
    console.log(`║   👥 Customers:        ${String(createdCustomers.length).padEnd(15)}║`);
    console.log(`║   💰 Payments:         ${String(createdPayments.length).padEnd(15)}║`);
    console.log(`║   📧 Messages:         ${String(createdContacts.length).padEnd(15)}║`);
    console.log('╠════════════════════════════════════════╣');
    console.log('║   🔐 ADMIN CREDENTIALS                ║');
    console.log('╠════════════════════════════════════════╣');
    console.log('║   Email:    admin@jellof.com          ║');
    console.log('║   Password: Admin@124                 ║');
    console.log('╚════════════════════════════════════════╝\n');

    console.log('🎉 You can now:');
    console.log('   1. Start your server: npm run dev');
    console.log('   2. Login with the admin credentials above');
    console.log('   3. Test all admin features with demo data\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

// Run seed when connected
mongoose.connection.once('connected', () => {
  console.log('✅ Connected to MongoDB\n');
  seedAllData();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});