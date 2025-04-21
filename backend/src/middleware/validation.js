
const { body, validationResult } = require('express-validator');


exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};


exports.registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phoneNumber')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
];


exports.menuItemValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom(value => value > 0)
    .withMessage('Price must be greater than 0'),
  body('category')
    .isIn(['Appetizers', 'Main Courses', 'Desserts', 'Drinks'])
    .withMessage('Category must be one of: Appetizers, Main Courses, Desserts, Drinks')
];


exports.addToCartValidation = [
  body('menuItemId').notEmpty().withMessage('Menu item ID is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
];

exports.updateCartItemValidation = [
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer')
];


exports.updateOrderStatusValidation = [
  body('status')
    .isIn(['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status must be one of: PENDING, PREPARING, READY, COMPLETED, CANCELLED')
];