const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

const { protect } = require('../middleware/auth');
const {
  addToCartValidation,
  updateCartItemValidation,
  validate
} = require('../middleware/validation');

router.use(protect);

// Cart routes
router.get('/', getCart);
router.post('/', addToCartValidation, validate, addToCart);
router.delete('/', clearCart);

router.put('/:id', updateCartItemValidation, validate, updateCartItem);
router.delete('/:id', removeFromCart);

module.exports = router;
