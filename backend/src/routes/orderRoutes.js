const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getOrdersByPhone,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');

const { protect } = require('../middleware/auth');
const {
  updateOrderStatusValidation,
  validate
} = require('../middleware/validation');


router.get('/phone/:phoneNumber', getOrdersByPhone);



router.use(protect);


router.post('/', createOrder);

router.get('/', getUserOrders);


router.get('/:id', getOrderById);


router.put('/:id', updateOrderStatusValidation, validate, updateOrderStatus);


router.put('/:id/cancel', cancelOrder);

module.exports = router;
