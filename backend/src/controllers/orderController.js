
const { prisma } = require('../config/db');
const MenuItem = require('../models/menu');


exports.createOrder = async (req, res) => {
  try {
  
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: req.user.id
      }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty. Cannot create order.'
      });
    }

  
    const orderItemsData = await Promise.all(
      cartItems.map(async (item) => {
        const menuItem = await MenuItem.findById(item.menuItemId);
        
        if (!menuItem) {
          throw new Error(`Menu item with ID ${item.menuItemId} not found`);
        }
        
        return {
          menuItemId: item.menuItemId,
          name: menuItem.name,
          price: menuItem.price,
          quantity: item.quantity
        };
      })
    );

 
    const total = orderItemsData.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

  
    const order = await prisma.$transaction(async (prisma) => {
   
      const newOrder = await prisma.order.create({
        data: {
          userId: req.user.id,
          total,
          status: 'PENDING'
        }
      });

   
      await Promise.all(
        orderItemsData.map(async (item) => {
          await prisma.orderItem.create({
            data: {
              orderId: newOrder.id,
              menuItemId: item.menuItemId,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }
          });
        })
      );

    
      await prisma.cartItem.deleteMany({
        where: {
          userId: req.user.id
        }
      });

      return newOrder;
    });

  
    const completeOrder = await prisma.order.findUnique({
      where: {
        id: order.id
      },
      include: {
        orderItems: true
      }
    });

    res.status(201).json({
      success: true,
      data: completeOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        orderItems: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        orderItems: true
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


exports.getOrdersByPhone = async (req, res) => {
  try {
  
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber: req.params.phoneNumber
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No orders found for this phone number'
      });
    }

  
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id
      },
      include: {
        orderItems: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: PENDING, PREPARING, READY, COMPLETED, CANCELLED'
      });
    }

    const order = await prisma.order.update({
      where: {
        id: req.params.id
      },
      data: {
        status
      }
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


exports.cancelOrder = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

  
    if (order.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: 'Only pending orders can be cancelled'
      });
    }

  
    const updatedOrder = await prisma.order.update({
      where: {
        id: req.params.id
      },
      data: {
        status: 'CANCELLED'
      }
    });

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};