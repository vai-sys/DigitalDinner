const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByCategory
} = require('../controllers/menuController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getMenuItems);
router.get('/:id', getMenuItem);
router.get('/category/:categoryName', getMenuItemsByCategory);


router.post('/', protect, upload.single('image'), createMenuItem);
router.put('/:id', protect, upload.single('image'), updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);

module.exports = router;
