const Lookbook = require('../models/Lookbook');

// Get all lookbook items
exports.getAllLookbookItems = async (req, res) => {
  try {
    const { season, featured, active = true } = req.query;

    let query = { active: active === 'true' };

    if (season) query.season = season;
    if (featured) query.featured = featured === 'true';

    const items = await Lookbook.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .populate('products.productId', 'name price images');

    console.log(`✅ Retrieved ${items.length} lookbook items`);

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });

  } catch (error) {
    console.error('❌ Error getting lookbook items:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve lookbook items'
    });
  }
};

// Get lookbook item by ID
exports.getLookbookItemById = async (req, res) => {
  try {
    const item = await Lookbook.findById(req.params.id)
      .populate('products.productId', 'name price images description');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lookbook item not found'
      });
    }

    res.status(200).json({
      success: true,
      item
    });

  } catch (error) {
    console.error('❌ Error getting lookbook item:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve lookbook item'
    });
  }
};

// Create lookbook item
exports.createLookbookItem = async (req, res) => {
  try {
    const itemData = {
      title: req.body.title,
      season: req.body.season || 'Spring/Summer 2026',
      image: req.body.image,
      description: req.body.description,
      products: req.body.products || [],
      featured: req.body.featured || false,
      active: req.body.active !== undefined ? req.body.active : true,
      displayOrder: req.body.displayOrder || 0,
      tags: req.body.tags || []
    };

    const item = new Lookbook(itemData);
    await item.save();

    console.log('✅ Lookbook item created:', item._id);

    res.status(201).json({
      success: true,
      message: 'Lookbook item created successfully',
      item
    });

  } catch (error) {
    console.error('❌ Error creating lookbook item:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create lookbook item'
    });
  }
};

// Update lookbook item
exports.updateLookbookItem = async (req, res) => {
  try {
    const item = await Lookbook.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lookbook item not found'
      });
    }

    console.log('✅ Lookbook item updated:', item._id);

    res.status(200).json({
      success: true,
      message: 'Lookbook item updated successfully',
      item
    });

  } catch (error) {
    console.error('❌ Error updating lookbook item:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update lookbook item'
    });
  }
};

// Delete lookbook item
exports.deleteLookbookItem = async (req, res) => {
  try {
    const item = await Lookbook.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lookbook item not found'
      });
    }

    console.log('✅ Lookbook item deleted:', item._id);

    res.status(200).json({
      success: true,
      message: 'Lookbook item deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting lookbook item:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete lookbook item'
    });
  }
};

// Toggle featured status
exports.toggleFeatured = async (req, res) => {
  try {
    const item = await Lookbook.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lookbook item not found'
      });
    }

    item.featured = !item.featured;
    item.updatedAt = new Date();
    await item.save();

    console.log(`✅ Lookbook item ${item._id} featured status: ${item.featured}`);

    res.status(200).json({
      success: true,
      message: 'Featured status updated',
      item
    });

  } catch (error) {
    console.error('❌ Error toggling featured status:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update featured status'
    });
  }
};

module.exports = exports;