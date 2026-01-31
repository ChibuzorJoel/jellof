const Collection = require('../models/Collection');

exports.getAllCollections = async (req, res) => {
  try {
    const collections = Collection ? await Collection.find() : [];
    res.status(200).json({ success: true, collections });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve collections' });
  }
};

exports.getCollectionById = async (req, res) => {
  try {
    const collection = Collection ? await Collection.findById(req.params.id) : null;
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });
    res.status(200).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve collection' });
  }
};

exports.createCollection = async (req, res) => {
  try {
    if (!Collection) return res.status(500).json({ success: false, message: 'Database not configured' });
    const collection = new Collection(req.body);
    await collection.save();
    res.status(201).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create collection' });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    if (!Collection) return res.status(500).json({ success: false, message: 'Database not configured' });
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });
    res.status(200).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update collection' });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    if (!Collection) return res.status(500).json({ success: false, message: 'Database not configured' });
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });
    res.status(200).json({ success: true, message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete collection' });
  }
};

module.exports = exports;