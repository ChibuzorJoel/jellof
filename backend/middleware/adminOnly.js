const adminOnly = (req, res, next) => {
    // req.user is set by auth middleware
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access only'
      });
    }
  
    next();
  };
  
  module.exports = adminOnly;