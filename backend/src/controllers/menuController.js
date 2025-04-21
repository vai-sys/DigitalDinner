



const MenuItem = require('../models/menu');


exports.getMenuItems = async (req, res) => {
  try {
    const filter = {};
    
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    
    if (req.query.available === 'true') {
      filter.available = true;
    }

    const menuItems = await MenuItem.find(filter);

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


exports.createMenuItem = async (req, res) => {
    try {
      if (req.file) {
        req.body.image = req.file.filename;
      }
  
      const menuItem = await MenuItem.create(req.body);
  
      res.status(201).json({
        success: true,
        data: menuItem
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };


exports.updateMenuItem = async (req, res) => {
    try {
      if (req.file) {
        req.body.image = req.file.filename;
      }
  
      const menuItem = await MenuItem.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
  
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          error: 'Menu item not found'
        });
      }
  
      res.status(200).json({
        success: true,
        data: menuItem
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
  


exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


exports.getMenuItemsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    
    const menuItems = await MenuItem.find({ 
      category: categoryName,
      available: true
    });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};