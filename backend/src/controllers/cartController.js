
const { prisma } = require('../config/db');
const MenuItem = require('../models/menu');


exports.getCart = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: req.user.id
      }
    });

    
    const cartWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        const menuItem = await MenuItem.findById(item.menuItemId);
        
        return {
          id: item.id,
          menuItem: menuItem ? {
            id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            category: menuItem.category,
            image: menuItem.image
          } : { name: 'Item no longer available', price: 0 },
          quantity: item.quantity
        };
      })
    );

    const total = cartWithDetails.reduce(
      (sum, item) => sum + (item.menuItem.price * item.quantity), 
      0
    );

    res.status(200).json({
      success: true,
      data: {
        items: cartWithDetails,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


exports.addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity = 1 } = req.body;

   
    const menuItem = await MenuItem.findById(menuItemId);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

 
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: req.user.id,
        menuItemId
      }
    });

    let cartItem;

    if (existingCartItem) {
    
      cartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id
        },
        data: {
          quantity: existingCartItem.quantity + quantity
        }
      });
    } else {
     
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user.id,
          menuItemId,
          quantity
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: cartItem.id,
        menuItem: {
          id: menuItem._id,
          name: menuItem.name,
          price: menuItem.price
        },
        quantity: cartItem.quantity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

   
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

 
    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: {
          id: req.params.id
        }
      });

      return res.status(200).json({
        success: true,
        data: {}
      });
    }

    
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: req.params.id
      },
      data: {
        quantity
      }
    });

   
    const menuItem = await MenuItem.findById(cartItem.menuItemId);

    res.status(200).json({
      success: true,
      data: {
        id: updatedCartItem.id,
        menuItem: {
          id: menuItem._id,
          name: menuItem.name,
          price: menuItem.price
        },
        quantity: updatedCartItem.quantity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


exports.removeFromCart = async (req, res) => {
  try {
  
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

  
    await prisma.cartItem.delete({
      where: {
        id: req.params.id
      }
    });

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


exports.clearCart = async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: {
        userId: req.user.id
      }
    });

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