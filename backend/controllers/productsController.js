const Product = require('../models/Product');

// Sample products data (fallback if no database)
const sampleProducts = [
  {
    id: 1,
    name: 'Silk Summer Dress',
    category: 'Dresses',
    price: 189.99,
    description: 'Elegant silk dress perfect for summer occasions',
    image: 'assets/images/product-1.jpg',
    isNew: true,
    colors: ['Black', 'White', 'Green'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true
  },
  {
    id: 2,
    name: 'Linen Blazer',
    category: 'Outerwear',
    price: 249.99,
    description: 'Breathable linen blazer for professional style',
    image: 'assets/images/product-2.jpg',
    isNew: true,
    colors: ['Navy', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true
  }
  // Add more products as needed
];

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    let products;
    
    if (Product) {
      const { category, minPrice, maxPrice, search, sort } = req.query;
      let query = {};

      // Filter by category
      if (category) {
        query.category = category;
      }

      // Filter by price range
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }

      // Search
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      products = await Product.find(query);

      // Sort
      if (sort === 'price-low') products.sort((a, b) => a.price - b.price);
      if (sort === 'price-high') products.sort((a, b) => b.price - a.price);
      if (sort === 'name') products.sort((a, b) => a.name.localeCompare(b.name));
      if (sort === 'newest') products.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      // Return sample products if no database
      products = sampleProducts;
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products'
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    let product;

    if (Product) {
      product = await Product.findById(req.params.id);
    } else {
      product = sampleProducts.find(p => p.id === parseInt(req.params.id));
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product'
    });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    let products;

    if (Product) {
      products = await Product.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ]
      });
    } else {
      products = sampleProducts.filter(p => 
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    let products;

    if (Product) {
      products = await Product.find({ category });
    } else {
      products = sampleProducts.filter(p => p.category === category);
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error getting products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products'
    });
  }
};

// Create product (admin)
exports.createProduct = async (req, res) => {
  try {
    if (!Product) {
      return res.status(500).json({
        success: false,
        message: 'Database not configured'
      });
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
};

// Update product (admin)
exports.updateProduct = async (req, res) => {
  try {
    if (!Product) {
      return res.status(500).json({
        success: false,
        message: 'Database not configured'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
};

// Delete product (admin)
exports.deleteProduct = async (req, res) => {
  try {
    if (!Product) {
      return res.status(500).json({
        success: false,
        message: 'Database not configured'
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
};