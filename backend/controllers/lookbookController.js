const Lookbook = require('../models/Lookbook');
exports.getAllLookbookItems = async (req, res) => {
  try {
    const items = Lookbook ? await Lookbook.find() : [];
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve lookbook items' });
  }
};
exports.getLookbookItemById = async (req, res) => {
  try {
    const item = Lookbook ? await Lookbook.findById(req.params.id) : null;
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve item' });
  }
};
exports.createLookbookItem = async (req, res) => {
  try {
    if (!Lookbook) return res.status(500).json({ success: false, message: 'Database not configured' });
    const item = new Lookbook(req.body);
    await item.save();
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create item' });
  }
};
exports.updateLookbookItem = async (req, res) => {
  try {
    const item = await Lookbook.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update item' });
  }
};
exports.deleteLookbookItem = async (req, res) => {
  try {
    await Lookbook.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete item' });
  }
};