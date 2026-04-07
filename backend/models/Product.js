const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Shoes'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    validate: {
      validator: function(value) {
        // Discount price must be less than regular price
        return !value || value < this.price;
      },
      message: 'Discount price must be less than regular price'
    }
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    default: 'assets/images/placeholder.jpg'
  },
  images: [{
    type: String
  }],
  isNew: {
    type: Boolean,
    default: false
  },
  colors: [{
    type: String,
    trim: true
  }],
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    trim: true
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt
});

// ✅ FIXED: Pre-save hook - Use async WITHOUT next parameter
productSchema.pre('save', async function() {
  // Auto-update inStock based on stockQuantity
  this.inStock = this.stockQuantity > 0;
  
  // If images array is provided, set the first image as the main image
  if (this.images && this.images.length > 0 && !this.image) {
    this.image = this.images[0];
  }
  
  // If main image is provided but images array is empty, populate images array
  if (this.image && (!this.images || this.images.length === 0)) {
    this.images = [this.image];
  }
});

// Virtual for checking if product is on sale
productSchema.virtual('isOnSale').get(function() {
  return !!(this.discountPrice && this.discountPrice < this.price);
});

// Virtual for actual selling price
productSchema.virtual('sellingPrice').get(function() {
  return this.isOnSale ? this.discountPrice : this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.isOnSale) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

// Ensure virtuals are included when converting to JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Indexes for faster queries
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ inStock: 1 });

module.exports = mongoose.model('Product', productSchema);